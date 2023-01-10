from celery import Celery
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'messenger.settings',)
django.setup()
app = Celery('messenger')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()
