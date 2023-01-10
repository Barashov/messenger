python manage.py collectstatic --no-input
python manage.py migrate --no-input
daphne -b 0.0.0.0 -p 8000 messenger.asgi:application
