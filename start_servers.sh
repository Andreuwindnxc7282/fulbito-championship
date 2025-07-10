#!/bin/bash

echo "=== INICIANDO SERVIDORES FULBITO CHAMPIONSHIP ==="

# Iniciar backend Django
echo "Iniciando backend Django..."
cd backend
python manage.py runserver &
BACKEND_PID=$!

# Esperar un poco para que se inicie
sleep 5

# Verificar que el backend esté corriendo
echo "Verificando backend..."
curl -s http://localhost:8000/api/public/standings/1/ > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ Backend funcionando en http://localhost:8000"
else
    echo "❌ Backend no responde"
fi

# Volver al directorio raíz e iniciar frontend
cd ..
echo "Iniciando frontend Next.js..."
npm run dev &
FRONTEND_PID=$!

echo "=== SERVIDORES INICIADOS ==="
echo "Backend: http://localhost:8000"  
echo "Frontend: http://localhost:3002"
echo ""
echo "Para detener los servidores, presiona Ctrl+C"
echo "PIDs: Backend=$BACKEND_PID, Frontend=$FRONTEND_PID"

# Mantener el script corriendo
wait
