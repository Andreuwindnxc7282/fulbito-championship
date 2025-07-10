@echo off
echo === CONFIGURANDO FULBITO CHAMPIONSHIP ===

echo.
echo 🔧 Aplicando migraciones...
python manage.py migrate

echo.
echo 📊 Configurando datos iniciales...
python setup_db.py

echo.
echo 🚀 Iniciando servidor...
python manage.py runserver
