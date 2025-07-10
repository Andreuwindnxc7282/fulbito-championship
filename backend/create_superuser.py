#!/usr/bin/env python
"""
Script para crear un superusuario y generar su token JWT
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

def create_superuser():
    """Crear superusuario y generar tokens JWT"""
    print("🏆 Fulbito Championship - Crear Superusuario")
    print("=" * 55)
    
    # Datos del superusuario
    username = 'admin'
    email = 'admin@fulbito.com'
    password = 'admin123'
    
    try:
        # Verificar si ya existe
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            print(f"✅ Superusuario existente: {username}")
            
            # Actualizar contraseña si es necesario
            user.set_password(password)
            user.is_superuser = True
            user.is_staff = True
            user.is_active = True
            user.save()
            print("🔄 Contraseña y permisos actualizados")
        else:
            # Crear nuevo superusuario
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                is_superuser=True,
                is_staff=True,
                is_active=True
            )
            print(f"✅ Superusuario creado: {username}")
        
        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        print("\n🔑 TOKENS JWT:")
        print(f"ACCESS TOKEN:\n{access_token}")
        print(f"\nREFRESH TOKEN:\n{refresh}")
        
        print("\n👤 CREDENCIALES DE SUPERUSUARIO:")
        print(f"Usuario: {username}")
        print(f"Email: {email}")
        print(f"Contraseña: {password}")
        
        print("\n🌐 ACCESOS DISPONIBLES:")
        print("• Admin Django: http://localhost:8000/admin/")
        print("• API Swagger: http://localhost:8000/swagger/")
        print("• Login API: http://localhost:8000/api/auth/login/")
        
        print("\n📋 INSTRUCCIONES:")
        print("1. Usa las credenciales para acceder al admin de Django")
        print("2. Usa el ACCESS TOKEN para autenticación en la API")
        print("3. Usa las credenciales para login en el frontend")
        
        return {
            'username': username,
            'password': password,
            'email': email,
            'access_token': str(access_token),
            'refresh_token': str(refresh)
        }
        
    except Exception as e:
        print(f"❌ Error creando superusuario: {e}")
        return None

if __name__ == '__main__':
    result = create_superuser()
    if result:
        print(f"\n🎯 SUPERUSUARIO LISTO PARA USAR")
        print(f"Accede a: http://localhost:8000/admin/")
        print(f"Usuario: {result['username']}")
        print(f"Contraseña: {result['password']}")
    else:
        print("\n💥 Error al crear superusuario")
        sys.exit(1)
