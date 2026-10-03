import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'velqino_backend.settings')

app = Celery('velqino_backend')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

from celery.signals import task_postrun
from django.db import connections

@task_postrun.connect
def close_celery_db_connections(*args, **kwargs):
    for conn in connections.all():
        try:
            conn.close()
        except Exception:
            pass