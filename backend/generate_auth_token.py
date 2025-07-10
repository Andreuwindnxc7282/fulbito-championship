#!/usr/bin/env python
"""
Script para crear un usuario de prueba y generar un token JWT para desarrollo
"""
import os
import sys
import django

# Configurar Django
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(backend_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

def create_test_user_and_token():
    """Crear usuario de prueba y generar token"""
    username = 'testuser'
    password = 'testpass123'
    email = 'test@fulbito.com'
    
    # Crear o obtener usuario
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': email,
            'first_name': 'Test',
            'last_name': 'User',
            'is_staff': True,
            'is_superuser': True
        }
    )
    
    if created:
        user.set_password(password)
        user.save()
        print(f"✅ Usuario creado: {username}")
    else:
        print(f"✅ Usuario existente: {username}")
    
    # Generar token JWT
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)
    
    print(f"\n🔑 TOKEN DE ACCESO:")
    print(f"{access_token}")
    
    print(f"\n🔄 TOKEN DE REFRESH:")
    print(f"{refresh_token}")
    
    print(f"\n👤 CREDENCIALES DE LOGIN:")
    print(f"Usuario: {username}")
    print(f"Contraseña: {password}")
    
    return access_token, refresh_token

if __name__ == '__main__':
    print("🏆 Fulbito Championship - Generar Token de Desarrollo")
    print("=" * 55)
    
    try:
        access_token, refresh_token = create_test_user_and_token()
        
        print(f"\n📋 INSTRUCCIONES:")
        print(f"1. Copia el TOKEN DE ACCESO")
        print(f"2. Úsalo en el localStorage como 'access_token'")
        print(f"3. O usa las credenciales para hacer login")
        
    except Exception as e:
        print(f"❌ Error: {e}")
