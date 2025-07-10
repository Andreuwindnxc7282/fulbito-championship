#!/usr/bin/env python
"""
Script de evaluación completa del proyecto Fulbito Championship
"""
import os
import django
import requests
import json
from datetime import datetime

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')
django.setup()

from django.contrib.auth.models import User
from apps.clubs.models import Team, Player
from apps.matches.models import Match, MatchEvent
from apps.competition.models import Tournament, Stage
from apps.infrastructure.models import Venue
from apps.statistics.models import Standing

def check_backend_endpoints():
    """Verificar endpoints del backend"""
    base_url = "http://localhost:8000"
    endpoints = [
        "/api/teams/",
        "/api/players/", 
        "/api/matches/",
        "/api/dashboard/stats/",
        "/swagger/",
        "/admin/",
    ]
    
    results = {}
    
    # Verificar login por separado con POST
    try:
        login_data = {"username": "admin", "password": "admin123"}
        response = requests.post(f"{base_url}/api/auth/login/", 
                               json=login_data, timeout=5)
        results["/api/auth/login/"] = {
            "status": response.status_code,
            "working": response.status_code == 200
        }
    except Exception as e:
        results["/api/auth/login/"] = {"status": "ERROR", "error": str(e), "working": False}
    
    # Verificar otros endpoints con GET
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            results[endpoint] = {
                "status": response.status_code,
                "working": response.status_code in [200, 401, 403]  # 401/403 means auth required but endpoint exists
            }
        except Exception as e:
            results[endpoint] = {"status": "ERROR", "error": str(e), "working": False}
    
    return results

def check_database_data():
    """Verificar datos en la base de datos"""
    return {
        "users": User.objects.count(),
        "superusers": User.objects.filter(is_superuser=True).count(),
        "teams": Team.objects.count(),
        "players": Player.objects.count(),
        "tournaments": Tournament.objects.count(),
        "matches": Match.objects.count(),
        "venues": Venue.objects.count(),
        "standings": Standing.objects.count(),
    }

def check_auth_system():
    """Verificar sistema de autenticación"""
    try:
        # Verificar login
        login_data = {"username": "admin", "password": "admin123"}
        response = requests.post("http://localhost:8000/api/auth/login/", 
                               json=login_data, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            return {
                "login_working": True,
                "has_tokens": "access" in data and "refresh" in data,
                "has_user_data": "user" in data,
                "response_size": len(response.content)
            }
        else:
            return {"login_working": False, "status": response.status_code}
    except Exception as e:
        return {"login_working": False, "error": str(e)}

def main():
    print("=" * 80)
    print("🏆 EVALUACIÓN COMPLETA DEL PROYECTO FULBITO CHAMPIONSHIP")
    print("=" * 80)
    print(f"📅 Fecha de evaluación: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # 1. BACKEND - Base de datos y modelos
    print("\n" + "=" * 50)
    print("🗄️  BACKEND - BASE DE DATOS")
    print("=" * 50)
    
    db_data = check_database_data()
    for key, value in db_data.items():
        status = "✅" if value > 0 else "⚠️"
        print(f"  {status} {key.capitalize()}: {value}")
    
    # 2. BACKEND - Endpoints API
    print("\n" + "=" * 50)
    print("🌐 BACKEND - ENDPOINTS API")
    print("=" * 50)
    
    endpoints = check_backend_endpoints()
    working_endpoints = 0
    total_endpoints = len(endpoints)
    
    for endpoint, data in endpoints.items():
        if data["working"]:
            print(f"  ✅ {endpoint} - Status: {data['status']}")
            working_endpoints += 1
        else:
            print(f"  ❌ {endpoint} - {data.get('error', 'Status: ' + str(data['status']))}")
    
    # 3. SISTEMA DE AUTENTICACIÓN
    print("\n" + "=" * 50)
    print("🔐 SISTEMA DE AUTENTICACIÓN")
    print("=" * 50)
    
    auth_check = check_auth_system()
    if auth_check.get("login_working"):
        print("  ✅ Login funcionando")
        print(f"  ✅ Tokens JWT: {'Sí' if auth_check.get('has_tokens') else 'No'}")
        print(f"  ✅ Datos de usuario: {'Sí' if auth_check.get('has_user_data') else 'No'}")
    else:
        print(f"  ❌ Login falló: {auth_check.get('error', auth_check.get('status'))}")
    
    # 4. DOCUMENTACIÓN
    print("\n" + "=" * 50)
    print("📚 DOCUMENTACIÓN Y HERRAMIENTAS")
    print("=" * 50)
    
    # Verificar archivos de documentación
    docs = [
        "README.md",
        "SOLUCION_AUTENTICACION_JWT.md", 
        "SOLUCION_FORMATO_FECHA.md",
        "SISTEMA_LOGIN_DASHBOARD.md",
        "ERROR_500_SWAGGER_RESUELTO.md",
        "ERROR_SWAGGER_OPENAPI_RESUELTO.md",
    ]
    
    for doc in docs:
        if os.path.exists(f"../{doc}"):
            print(f"  ✅ {doc}")
        else:
            print(f"  ⚠️  {doc} - No encontrado")
    
    # 5. FUNCIONALIDADES PRINCIPALES
    print("\n" + "=" * 50)
    print("⚙️  FUNCIONALIDADES PRINCIPALES")
    print("=" * 50)
    
    features = [
        ("Sistema de Autenticación JWT", auth_check.get("login_working", False)),
        ("Gestión de Equipos", db_data["teams"] > 0),
        ("Gestión de Jugadores", db_data["players"] > 0),
        ("Gestión de Partidos", db_data["matches"] > 0),
        ("Panel de Administración Django", db_data["superusers"] > 0),
        ("API REST Documentada (Swagger)", endpoints.get("/swagger/", {}).get("working", False)),
        ("Dashboard de Estadísticas", endpoints.get("/api/dashboard/stats/", {}).get("working", False)),
    ]
    
    working_features = 0
    for feature, working in features:
        if working:
            print(f"  ✅ {feature}")
            working_features += 1
        else:
            print(f"  ❌ {feature}")
    
    # 6. RESUMEN FINAL
    print("\n" + "=" * 80)
    print("📊 RESUMEN DE COMPLETITUD")
    print("=" * 80)
    
    api_percentage = (working_endpoints / total_endpoints) * 100
    features_percentage = (working_features / len(features)) * 100
    data_percentage = (sum(1 for v in db_data.values() if v > 0) / len(db_data)) * 100
    
    print(f"  🌐 APIs funcionando: {working_endpoints}/{total_endpoints} ({api_percentage:.1f}%)")
    print(f"  ⚙️  Funcionalidades: {working_features}/{len(features)} ({features_percentage:.1f}%)")
    print(f"  🗄️  Datos en BD: {sum(1 for v in db_data.values() if v > 0)}/{len(db_data)} ({data_percentage:.1f}%)")
    
    overall_percentage = (api_percentage + features_percentage + data_percentage) / 3
    
    print(f"\n🎯 COMPLETITUD GENERAL: {overall_percentage:.1f}%")
    
    if overall_percentage >= 90:
        print("🎉 ¡PROYECTO COMPLETO Y FUNCIONANDO!")
        status = "COMPLETO"
    elif overall_percentage >= 70:
        print("✅ Proyecto casi completo, faltan detalles menores")
        status = "CASI COMPLETO"
    elif overall_percentage >= 50:
        print("⚠️  Proyecto funcional básico, faltan funcionalidades importantes")
        status = "FUNCIONAL BÁSICO"
    else:
        print("❌ Proyecto incompleto, faltan funcionalidades críticas")
        status = "INCOMPLETO"
    
    # 7. SIGUIENTE PASOS (si es necesario)
    if overall_percentage < 90:
        print("\n" + "=" * 50)
        print("🔧 RECOMENDACIONES PARA COMPLETAR")
        print("=" * 50)
        
        if not auth_check.get("login_working"):
            print("  🔐 Solucionar problemas de autenticación")
        
        if db_data["players"] == 0:
            print("  👤 Agregar jugadores a los equipos")
            
        if db_data["matches"] == 0:
            print("  ⚽ Crear partidos del campeonato")
            
        if not endpoints.get("/swagger/", {}).get("working", False):
            print("  📋 Solucionar documentación API (Swagger)")
    
    print("\n" + "=" * 80)
    print(f"🏁 EVALUACIÓN COMPLETADA - ESTADO: {status}")
    print("=" * 80)

if __name__ == '__main__':
    main()
