#!/usr/bin/env python
"""
Script para generar y probar token inmediatamente
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
import requests

def test_token_immediately():
    """Generar y probar token inmediatamente"""
    print("🔍 Generando token fresco...")
    
    # Crear usuario
    user, created = User.objects.get_or_create(
        username='testuser',
        defaults={'email': 'test@fulbito.com'}
    )
    
    # Generar token
    token = AccessToken.for_user(user)
    token_str = str(token)
    
    print(f"✅ Token generado: {token_str}")
    
    # Probar inmediatamente
    headers = {
        'Authorization': f'Bearer {token_str}',
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get('http://localhost:8000/api/matches/', headers=headers)
        print(f"📡 Status: {response.status_code}")
        print(f"📋 Response: {response.text[:200]}...")
        
        if response.status_code == 200:
            print("✅ Token funciona correctamente")
            return token_str
        else:
            print("❌ Token no funciona")
            return None
            
    except Exception as e:
        print(f"❌ Error en request: {e}")
        return None

if __name__ == '__main__':
    token = test_token_immediately()
    if token:
        print(f"\n🎯 Token válido para usar: {token}")
    else:
        print("\n💥 No se pudo generar token válido")
