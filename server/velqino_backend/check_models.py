import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'velqino_backend.settings')
django.setup()

from intelligence.models import AIModelProfile, AIModelAnglePose

profiles = AIModelProfile.objects.all().order_by('demographic', 'display_order')
print(f"Total profiles: {profiles.count()}")
for p in profiles:
    print(f"[{p.demographic.upper()}] id={p.id} slug={p.slug} name=\"{p.name}\" default={p.is_default}")
    print(f"  preview: {p.preview_image_url}")
    for a in p.angles.all().order_by('display_order'):
        print(f"    - {a.angle_key}: {a.base_image_url}")
