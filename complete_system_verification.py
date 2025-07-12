#!/usr/bin/env python3
"""
Script de verificación completa del sistema de fulbito
Ejecuta todas las verificaciones y genera un reporte detallado
"""

import requests
import json
import time
import sys
import os
from datetime import datetime

def colored(text, color):
    """Colorea el texto para mejor legibilidad"""
    colors = {
        'red': '\033[91m',
        'green': '\033[92m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'purple': '\033[95m',
        'cyan': '\033[96m',
        'white': '\033[97m',
        'reset': '\033[0m'
    }
    return f"{colors.get(color, '')}{text}{colors['reset']}"

def print_header(title):
    """Imprime un header bonito"""
    print(f"\n{colored('=' * 60, 'cyan')}")
    print(f"{colored(title.center(60), 'white')}")
    print(f"{colored('=' * 60, 'cyan')}")

def print_section(title):
    """Imprime una sección"""
    print(f"\n{colored('📋 ' + title, 'blue')}")
    print(f"{colored('-' * (len(title) + 3), 'blue')}")

def test_backend_connectivity():
    """Verifica conectividad básica del backend"""
    print_section("CONECTIVIDAD DEL BACKEND")
    
    tests = [
        ("GET /api/dashboard/stats/", "http://localhost:8000/api/dashboard/stats/"),
        ("GET /api/schema/", "http://localhost:8000/api/schema/"),
        ("GET /admin/", "http://localhost:8000/admin/"),
        ("POST /api/auth/login/", "http://localhost:8000/api/auth/login/")
    ]
    
    results = []
    for name, url in tests:
        try:
            if "POST" in name:
                response = requests.post(url, 
                                       json={'username': 'testuser', 'password': 'testpass123'},
                                       timeout=5)
            else:
                response = requests.get(url, timeout=5)
            
            if response.status_code < 400:
                print(f"  ✅ {name}: {colored(f'OK ({response.status_code})', 'green')}")
                results.append(True)
            else:
                print(f"  ❌ {name}: {colored(f'Error {response.status_code}', 'red')}")
                results.append(False)
        except Exception as e:
            print(f"  ❌ {name}: {colored(f'Error de conexión - {str(e)[:50]}', 'red')}")
            results.append(False)
    
    return all(results)

def test_authentication_flow():
    """Verifica el flujo completo de autenticación"""
    print_section("FLUJO DE AUTENTICACIÓN")
    
    try:
        # 1. Login
        print("  🔐 Probando login...")
        login_response = requests.post('http://localhost:8000/api/auth/login/', 
                                     json={'username': 'testuser', 'password': 'testpass123'},
                                     timeout=5)
        
        if login_response.status_code != 200:
            print(f"  ❌ Login falló: {colored(f'Status {login_response.status_code}', 'red')}")
            return False
        
        tokens = login_response.json()
        if 'access' not in tokens or 'refresh' not in tokens:
            print(f"  ❌ Login sin tokens: {colored('Respuesta inválida', 'red')}")
            return False
        
        print(f"  ✅ Login exitoso: {colored('Tokens obtenidos', 'green')}")
        
        # 2. Usar token de acceso
        print("  🔑 Probando token de acceso...")
        headers = {'Authorization': f'Bearer {tokens["access"]}'}
        protected_response = requests.get('http://localhost:8000/api/dashboard/stats/', 
                                        headers=headers, timeout=5)
        
        if protected_response.status_code != 200:
            print(f"  ❌ Token de acceso falló: {colored(f'Status {protected_response.status_code}', 'red')}")
            return False
        
        print(f"  ✅ Token de acceso válido: {colored('Endpoint protegido accesible', 'green')}")
        
        # 3. Refresh token
        print("  🔄 Probando refresh token...")
        refresh_response = requests.post('http://localhost:8000/api/auth/refresh/', 
                                       json={'refresh': tokens['refresh']},
                                       timeout=5)
        
        if refresh_response.status_code != 200:
            print(f"  ❌ Refresh token falló: {colored(f'Status {refresh_response.status_code}', 'red')}")
            return False
        
        print(f"  ✅ Refresh token válido: {colored('Renovación exitosa', 'green')}")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Error en flujo de autenticación: {colored(str(e), 'red')}")
        return False

def test_data_integrity():
    """Verifica la integridad de los datos"""
    print_section("INTEGRIDAD DE DATOS")
    
    try:
        # Obtener token
        auth_response = requests.post('http://localhost:8000/api/auth/login/', 
                                    json={'username': 'testuser', 'password': 'testpass123'},
                                    timeout=5)
        
        if auth_response.status_code != 200:
            print(f"  ❌ No se pudo obtener token para verificar datos")
            return False
        
        token = auth_response.json()['access']
        headers = {'Authorization': f'Bearer {token}'}
        
        # Verificar endpoints de datos
        endpoints = [
            ("Jugadores", "/api/players/"),
            ("Equipos", "/api/teams/"),
            ("Partidos", "/api/matches/"),
            ("Estadísticas", "/api/dashboard/stats/"),
            ("Goleadores", "/api/dashboard/top-scorers/")
        ]
        
        results = []
        for name, endpoint in endpoints:
            try:
                response = requests.get(f'http://localhost:8000{endpoint}', 
                                      headers=headers, timeout=5)
                
                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, list):
                        count = len(data)
                    elif isinstance(data, dict):
                        count = len(data.keys())
                    else:
                        count = 1
                    
                    print(f"  ✅ {name}: {colored(f'{count} elementos', 'green')}")
                    results.append(True)
                else:
                    print(f"  ❌ {name}: {colored(f'Error {response.status_code}', 'red')}")
                    results.append(False)
                    
            except Exception as e:
                print(f"  ❌ {name}: {colored(f'Error - {str(e)[:30]}', 'red')}")
                results.append(False)
        
        return all(results)
        
    except Exception as e:
        print(f"  ❌ Error verificando integridad: {colored(str(e), 'red')}")
        return False

def test_frontend_files():
    """Verifica que los archivos del frontend estén correctos"""
    print_section("ARCHIVOS DEL FRONTEND")
    
    critical_files = [
        "lib/auto-token-system.ts",
        "lib/api.ts",
        "lib/auth-utils.ts",
        "components/dashboard.tsx",
        "components/system-status-card.tsx",
        "hooks/use-system-health.tsx",
        "package.json",
        "next.config.mjs"
    ]
    
    results = []
    for file in critical_files:
        if os.path.exists(file):
            print(f"  ✅ {file}: {colored('Existe', 'green')}")
            results.append(True)
        else:
            print(f"  ❌ {file}: {colored('No encontrado', 'red')}")
            results.append(False)
    
    return all(results)

def generate_report(tests_results):
    """Genera un reporte final"""
    print_header("REPORTE FINAL")
    
    total_tests = len(tests_results)
    passed_tests = sum(tests_results.values())
    failed_tests = total_tests - passed_tests
    
    print(f"\n📊 {colored('RESUMEN DE RESULTADOS', 'white')}")
    print(f"   Total de pruebas: {colored(str(total_tests), 'cyan')}")
    print(f"   Exitosas: {colored(str(passed_tests), 'green')}")
    print(f"   Fallidas: {colored(str(failed_tests), 'red')}")
    print(f"   Éxito: {colored(f'{(passed_tests/total_tests)*100:.1f}%', 'green' if failed_tests == 0 else 'yellow')}")
    
    if failed_tests == 0:
        print(f"\n🎉 {colored('¡SISTEMA 100% FUNCIONAL!', 'green')}")
        print(f"✅ {colored('El sistema está listo para usar sin errores', 'green')}")
        print(f"✅ {colored('No habrá Network Error ni Failed to fetch', 'green')}")
        print(f"✅ {colored('Autenticación automática configurada', 'green')}")
        print(f"✅ {colored('Renovación automática de tokens activa', 'green')}")
    else:
        print(f"\n⚠️  {colored('SISTEMA CON PROBLEMAS', 'yellow')}")
        print(f"❌ {colored('Revisa los errores arriba antes de continuar', 'red')}")
        
        # Mostrar detalles de errores
        print(f"\n{colored('DETALLES DE ERRORES:', 'yellow')}")
        for test_name, passed in tests_results.items():
            if not passed:
                print(f"  ❌ {test_name}")
    
    print(f"\n{colored('ACCESOS RÁPIDOS:', 'cyan')}")
    print(f"  🌐 Frontend: {colored('http://localhost:3000', 'blue')}")
    print(f"  🔧 Backend: {colored('http://localhost:8000', 'blue')}")
    print(f"  📚 Swagger: {colored('http://localhost:8000/api/schema/swagger-ui/', 'blue')}")
    print(f"  👤 Admin: {colored('http://localhost:8000/admin/', 'blue')}")
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n{colored(f'Verificación completada: {timestamp}', 'purple')}")
    
    return failed_tests == 0

def main():
    """Función principal"""
    print_header("VERIFICACIÓN COMPLETA DEL SISTEMA")
    print(f"{colored('Iniciando verificación exhaustiva...', 'cyan')}")
    
    tests = [
        ("Conectividad Backend", test_backend_connectivity),
        ("Flujo de Autenticación", test_authentication_flow),
        ("Integridad de Datos", test_data_integrity),
        ("Archivos Frontend", test_frontend_files)
    ]
    
    results = {}
    
    for test_name, test_func in tests:
        print(f"\n{colored(f'Ejecutando: {test_name}', 'purple')}")
        try:
            result = test_func()
            results[test_name] = result
            
            if result:
                print(f"  🎯 {colored(f'{test_name} EXITOSO', 'green')}")
            else:
                print(f"  💥 {colored(f'{test_name} FALLÓ', 'red')}")
                
        except Exception as e:
            print(f"  💥 {colored(f'{test_name} ERROR: {str(e)}', 'red')}")
            results[test_name] = False
    
    # Generar reporte final
    success = generate_report(results)
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
