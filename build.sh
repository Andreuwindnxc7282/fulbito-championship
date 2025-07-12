#!/bin/bash
echo "Iniciando migración..."
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
echo "Backend listo!"
