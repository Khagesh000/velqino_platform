from django.urls import path
from . import views

urlpatterns = [

    path('cart/', views.get_cart, name='get-cart'),
    path('cart/add/', views.add_to_cart, name='add-to-cart'),
    path('cart/item/<int:item_id>/', views.update_cart_item, name='update-cart-item'),
    path('cart/item/<int:item_id>/remove/', views.remove_cart_item, name='remove-cart-item'),
    path('cart/coupon/apply/', views.apply_coupon, name='apply-coupon'),
    path('cart/coupon/remove/', views.remove_coupon, name='remove-coupon'),
    path('cart/clear/', views.clear_cart, name='clear-cart'),

    path('cart/merge/', views.merge_cart, name='merge-cart'),

    path('orders/create/', views.create_order, name='create-order'),
    path('orders/', views.get_orders, name='get-orders'),
    path('orders/<str:order_id>/', views.get_order, name='get-order'),
    path('orders/<str:order_id>/cancel/', views.cancel_order, name='cancel-order'),
    # Customer orders
    path('orders/customer/create/', views.create_customer_order, name='create-customer-order'),
    path('orders/customer/list/', views.get_customer_orders, name='customer-orders'),
    
    # Retailer orders & customers
    path('orders/retailer/list/', views.get_retailer_orders, name='retailer-orders'),
    path('retailer/customers/', views.get_retailer_customers, name='retailer-customers'),
    path('retailer/returns/', views.get_retailer_returns, name='retailer-returns'),
    path('returns/create/', views.create_return_request, name='create-return'),
    path('returns/<str:return_id>/status/', views.update_return_status, name='update-return-status'),

    path('orders/<str:order_id>/invoice/', views.download_invoice, name='download-invoice'),
    path('orders/<str:order_id>/status/', views.update_order_status, name='update-order-status'),
    path('orders/<str:order_id>/status-history/', views.get_order_status_history, name='order-status-history'),

    path('orders/<str:order_id>/status/', views.update_order_status, name='update-order-status'),
    path('orders/<str:order_id>/status-history/', views.get_order_status_history, name='order-status-history'),

    # ========== REVIEWS URLS ==========
    path('reviews/<int:product_id>/summary/', views.get_product_reviews_summary, name='product-reviews-summary'),
    path('reviews/<int:product_id>/', views.get_product_reviews, name='product-reviews'),
    path('reviews/create/', views.create_review, name='create-review'),
    path('reviews/<int:review_id>/update/', views.update_review, name='update-review'),
    path('reviews/<int:review_id>/delete/', views.delete_review, name='delete-review'),
    path('reviews/<int:review_id>/helpful/', views.mark_review_helpful, name='mark-review-helpful'),

    #-----------------------------------------Retaielrs endpoints--------------------------------
    # ========== LOYALTY ENDPOINTS ==========
    path('loyalty/settings/', views.loyalty_settings, name='loyalty-settings'),
    path('points/transactions/', views.get_points_transactions, name='points-transactions'),
    path('points/summary/', views.get_customer_points_summary, name='points-summary'),
    path('points/redeem/', views.redeem_points, name='redeem-points'),

    # ========== REWARDS CATALOG URLS ==========
    path('rewards/', views.list_rewards, name='list-rewards'),
    path('rewards/<int:reward_id>/', views.get_reward_detail, name='reward-detail'),
    path('rewards/create/', views.create_reward, name='create-reward'),
    path('rewards/<int:reward_id>/update/', views.update_reward, name='update-reward'),
    path('rewards/<int:reward_id>/delete/', views.delete_reward, name='delete-reward'),

    # ========== CAMPAIGNS URLS ==========
    path('campaigns/', views.list_campaigns, name='list-campaigns'),
    path('campaigns/<int:campaign_id>/', views.get_campaign_detail, name='campaign-detail'),
    path('campaigns/create/', views.create_campaign, name='create-campaign'),
    path('campaigns/<int:campaign_id>/update/', views.update_campaign, name='update-campaign'),
    path('campaigns/<int:campaign_id>/delete/', views.delete_campaign, name='delete-campaign'),
    path('campaigns/<int:campaign_id>/apply/', views.apply_campaign_bonus, name='apply-campaign-bonus'),

    # ========== LOYALTY SETTINGS URLS ==========
    path('loyalty-settings/', views.loyalty_settings, name='loyalty-settings'),

    #--------------------------Retailer Reports----------------------------------
    # ========== EXPENSES URLS ==========
    path('expenses/retailer/list/', views.get_retailer_expenses, name='expenses-list'),
    path('expenses/retailer/create/', views.create_expense, name='expense-create'),
    path('expenses/retailer/<int:expense_id>/update/', views.update_expense, name='expense-update'),
    path('expenses/retailer/<int:expense_id>/delete/', views.delete_expense, name='expense-delete'),
    path('expenses/retailer/by-category/', views.get_expense_by_category, name='expense-by-category'),

]