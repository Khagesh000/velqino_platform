from django.contrib import admin
from .models import AIModelProfile, AIModelAnglePose, TryOnGenerationSession, TryOnGeneratedAngle


class AIModelAnglePoseInline(admin.TabularInline):
    model = AIModelAnglePose
    extra = 0


@admin.register(AIModelProfile)
class AIModelProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'demographic', 'gender', 'body_type', 'skin_tone', 'skin_tone_label', 'is_faceless', 'is_active', 'display_order')
    list_filter = ('demographic', 'gender', 'body_type', 'skin_tone', 'is_active')
    search_fields = ('name', 'description')
    inlines = [AIModelAnglePoseInline]


class TryOnGeneratedAngleInline(admin.TabularInline):
    model = TryOnGeneratedAngle
    extra = 0
    readonly_fields = ('angle_key', 'angle_label', 'created_at')


@admin.register(TryOnGenerationSession)
class TryOnGenerationSessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'model_profile', 'seller_type', 'garment_type', 'fit_silhouette', 'status', 'created_at')
    list_filter = ('seller_type', 'garment_type', 'fit_silhouette', 'status', 'created_at')
    search_fields = ('garment_title', 'user__email')
    inlines = [TryOnGeneratedAngleInline]
