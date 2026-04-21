from django.db import models 
from django.db import transaction
from django.core.cache import cache
from decimal import Decimal
from ..models import Cart, CartItem
from catalog.models import Product
from django.utils import timezone

class CartService:
    """Advanced cart service with caching and business logic"""
    
    CACHE_TTL = 300  # 5 minutes
    
    @staticmethod
    def get_or_create_cart(user=None, session_id=None, user_type='customer'):
        """Get existing cart or create new one"""
        
        # Priority: User cart > Session cart > New cart
        cart = None
        
        if user and user.is_authenticated:
            cart = Cart.objects.filter(user=user, status='active').first()
            if cart:
                # Update user type if changed
                if cart.user_type != user.role:
                    cart.user_type = user.role
                    cart.save()
        
        if not cart and session_id:
            cart = Cart.objects.filter(session_id=session_id, status='active', user__isnull=True).first()
        
        if not cart:
            cart = Cart.objects.create(
                user=user if user and user.is_authenticated else None,
                session_id=session_id if not user or not user.is_authenticated else None,
                user_type=user.role if user and user.is_authenticated else user_type
            )
        
        # Merge guest cart with user cart if user just logged in
        if user and user.is_authenticated and session_id:
            guest_cart = Cart.objects.filter(session_id=session_id, status='active', user__isnull=True).first()
            if guest_cart and guest_cart.id != cart.id:
                cart = guest_cart.merge_with_user_cart(cart)
        
        # Invalidate cache
        CartService._invalidate_cart_cache(cart.id)
        
        return cart
    
    @staticmethod
    def add_to_cart(cart, product_id, quantity=1, selected_size='', selected_color=''):
        """Add product to cart with pricing based on user type"""
        
        with transaction.atomic():
            try:
                product = Product.objects.select_for_update().get(id=product_id, status='active')
            except Product.DoesNotExist:
                raise ValueError("Product not found")
            
            # Check stock
            if product.stock < quantity:
                raise ValueError(f"Only {product.stock} items available")
            
            # Get price based on user type
            if cart.user_type == 'customer':
                price = float(product.retail_price) if product.retail_price else float(product.price)
            elif cart.user_type in ['wholesaler', 'retailer']:
                price = float(product.price)
                # Check minimum order quantity
                if product.min_order_qty > quantity:
                    raise ValueError(f"Minimum order quantity is {product.min_order_qty}")
            else:
                price = float(product.price)
            
            # Get or create cart item
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                selected_size=selected_size,
                selected_color=selected_color,
                defaults={
                    'quantity': quantity,
                    'price_at_add': price
                }
            )
            
            if not created:
                # Update existing item
                new_quantity = cart_item.quantity + quantity
                if product.stock < new_quantity:
                    raise ValueError(f"Only {product.stock} items available")
                cart_item.quantity = new_quantity
                cart_item.save()
            
            # Update last activity
            cart.save(update_fields=['last_activity'])
            
            # Invalidate cache
            CartService._invalidate_cart_cache(cart.id)
            
            return cart_item
    
    @staticmethod
    def update_cart_item(cart_item_id, quantity):
        """Update cart item quantity"""
        
        with transaction.atomic():
            cart_item = CartItem.objects.select_for_update().get(id=cart_item_id)
            
            if quantity <= 0:
                cart_item.delete()
                result = None
            else:
                # Check stock
                if cart_item.product.stock < quantity:
                    raise ValueError(f"Only {cart_item.product.stock} items available")
                
                cart_item.quantity = quantity
                cart_item.save()
                result = cart_item
            
            # Update cart last activity
            cart_item.cart.save(update_fields=['last_activity'])
            
            # Invalidate cache
            CartService._invalidate_cart_cache(cart_item.cart.id)
            
            return result
    
    @staticmethod
    def remove_cart_item(cart_item_id):
        """Remove item from cart"""
        
        with transaction.atomic():
            cart_item = CartItem.objects.get(id=cart_item_id)
            cart_id = cart_item.cart.id
            cart_item.delete()
            
            # Update cart last activity
              # Make sure this import is here
            Cart.objects.filter(id=cart_id).update(last_activity=timezone.now())  # ✅ Changed from models.now()
            
            # Invalidate cache
            CartService._invalidate_cart_cache(cart_id)
            
            return True
    
    @staticmethod
    def get_cart_details(cart):
        """Get cart details with caching"""
        
        cache_key = f"cart:details:{cart.id}"
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return cached_data
        
        # Calculate additional data
        data = {
            'cart': cart,
            'items': cart.items.all().select_related('product'),
            'summary': {
                'subtotal': cart.subtotal,
                'discount': cart.discount_amount,
                'total': cart.total,
                'savings': sum(item.saved_amount for item in cart.items.all()),
                'item_count': cart.item_count,
            }
        }
        
        cache.set(cache_key, data, CartService.CACHE_TTL)
        return data
    
    @staticmethod
    def clear_cart(cart):
        """Remove all items from cart"""
        
        with transaction.atomic():
            cart.items.all().delete()
            cart.coupon_code = ''
            cart.coupon_discount = 0
            cart.save()
            
            CartService._invalidate_cart_cache(cart.id)
    
    @staticmethod
    def _invalidate_cart_cache(cart_id):
        """Invalidate cart cache"""
        cache.delete(f"cart:details:{cart_id}")