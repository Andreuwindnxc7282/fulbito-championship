#!/bin/bash
# Build script for Render deployment

# Install dependencies
pip install -r requirements_prod.txt

# Collect static files
python manage.py collectstatic --noinput

# Run migrations
python manage.py migrate

# Create superuser if it doesn't exist
python manage.py shell -c "
from django.contrib.auth.models import User
import os
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', os.environ.get('ADMIN_PASSWORD', 'admin123'))
    print('Superuser created')
else:
    print('Superuser already exists')
"
