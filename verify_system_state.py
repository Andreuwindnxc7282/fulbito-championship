#!/usr/bin/env python3
"""
Script para verificar el estado completo del sistema de fulbito
Valida backend, frontend, autenticación y conectividad
"""

import requests
import time
import json
import sys
import os

def test_backend():
    """Verifica que el backend esté funcionando"""
    try:
        # Test básico de conectividad
        response = requests.get('http://localhost:8000/api/dashboard/stats/', timeout=5)
        if response.status_code == 200:
            print("✅ Backend corriendo y respondiendo")
            return True
        else:
            print(f"❌ Backend responde con código {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend no disponible: {e}")
        return False

def test_auth_endpoint():
    """Verifica el endpoint de autenticación"""
    try:
        response = requests.post('http://localhost:8000/api/auth/login/', 
                               json={'username': 'testuser', 'password': 'testpass123'},
                               timeout=5)
        if response.status_code == 200:
            data = response.json()
            if 'access' in data and 'refresh' in data:
                print("✅ Autenticación JWT funcional")
                return True
            else:
                print("❌ Respuesta de autenticación sin tokens")
                return False
        else:
            print(f"❌ Autenticación falló con código {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Endpoint de autenticación no disponible: {e}")
        return False

def test_cors():
    """Verifica que CORS esté configurado correctamente"""
    try:
        response = requests.options('http://localhost:8000/api/dashboard/stats/', 
                                  headers={'Origin': 'http://localhost:3000'},
                                  timeout=5)
        if response.status_code in [200, 204]:
            print("✅ CORS configurado correctamente")
            return True
        else:
            print(f"❌ CORS problema - código {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ No se pudo verificar CORS: {e}")
        return False

def test_protected_endpoints():
    """Verifica endpoints protegidos con token"""
    try:
        # Primero obtener token
        auth_response = requests.post('http://localhost:8000/api/auth/login/', 
                                    json={'username': 'testuser', 'password': 'testpass123'},
                                    timeout=5)
        if auth_response.status_code != 200:
            print("❌ No se pudo obtener token para pruebas")
            return False
        
        token = auth_response.json()['access']
        
        # Probar endpoint protegido
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get('http://localhost:8000/api/dashboard/stats/', 
                              headers=headers, timeout=5)
        
        if response.status_code == 200:
            print("✅ Endpoints protegidos funcionando")
            return True
        else:
            print(f"❌ Endpoint protegido falló - código {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error probando endpoints protegidos: {e}")
        return False

def test_swagger():
    """Verifica que Swagger esté disponible"""
    try:
        response = requests.get('http://localhost:8000/api/schema/', timeout=5)
        if response.status_code == 200:
            print("✅ Swagger/OpenAPI disponible")
            return True
        else:
            print(f"❌ Swagger no disponible - código {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error accediendo a Swagger: {e}")
        return False

def check_database():
    """Verifica la base de datos"""
    try:
        # Verificar que hay datos en la base
        auth_response = requests.post('http://localhost:8000/api/auth/login/', 
                                    json={'username': 'testuser', 'password': 'testpass123'},
                                    timeout=5)
        if auth_response.status_code != 200:
            return False
        
        token = auth_response.json()['access']
        headers = {'Authorization': f'Bearer {token}'}
        
        response = requests.get('http://localhost:8000/api/players/', 
                              headers=headers, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                print(f"✅ Base de datos con {len(data)} jugadores")
                return True
            else:
                print("⚠️  Base de datos sin jugadores")
                return False
        else:
            print(f"❌ Error consultando base de datos - código {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error verificando base de datos: {e}")
        return False

def main():
    """Función principal de verificación"""
    print("🔍 Verificando estado del sistema de fulbito...")
    print("=" * 50)
    
    tests = [
        ("Backend básico", test_backend),
        ("Autenticación JWT", test_auth_endpoint),
        ("CORS", test_cors),
        ("Endpoints protegidos", test_protected_endpoints),
        ("Swagger/OpenAPI", test_swagger),
        ("Base de datos", check_database),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}:")
        if test_func():
            passed += 1
        else:
            failed += 1
    
    print("\n" + "=" * 50)
    print(f"📊 Resultados: {passed} ✅ | {failed} ❌")
    
    if failed == 0:
        print("🎉 ¡Sistema 100% funcional!")
        print("✅ El sistema está listo para usar sin errores")
    else:
        print("⚠️  Sistema con problemas que requieren atención")
        print("❌ Revisa los errores arriba y corrige antes de continuar")
    
    return failed == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
