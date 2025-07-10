#!/usr/bin/env python
"""
Script para probar la validación JWT directamente
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
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.test import APIRequestFactory
from django.test import RequestFactory
from rest_framework import status

def test_jwt_validation():
    """Probar la validación JWT"""
    print("🔍 Probando validación JWT...")
    
    # Crear usuario
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={'email': 'test@fulbito.com'}
    )
    
    # Generar token
    token = AccessToken.for_user(user)
    token_str = str(token)
    
    print(f"✅ Token generado: {token_str[:50]}...")
    
    # Crear request factory
    factory = RequestFactory()
    request = factory.get('/api/matches/')
    request.META['HTTP_AUTHORIZATION'] = f'Bearer {token_str}'
    
    # Probar autenticación
    auth = JWTAuthentication()
    try:
        result = auth.authenticate(request)
        if result:
            user, validated_token = result
            print(f"✅ Token válido para usuario: {user.username}")
            return True
        else:
            print("❌ Token no válido")
            return False
    except Exception as e:
        print(f"❌ Error en validación: {e}")
        return False

if __name__ == '__main__':
    success = test_jwt_validation()
    sys.exit(0 if success else 1)
