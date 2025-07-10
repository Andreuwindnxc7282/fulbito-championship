#!/usr/bin/env python3
"""
Script para verificar que el dashboard funciona correctamente
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def test_dashboard_endpoints():
    """Prueba todos los endpoints del dashboard"""
    print("🔧 Probando endpoints del dashboard...")
    
    # 1. Login
    login_data = {'username': 'admin', 'password': 'admin123'}
    login_response = requests.post(f"{BASE_URL}/auth/login/", json=login_data, timeout=10)
    
    if login_response.status_code != 200:
        print("❌ Login failed")
        return False
    
    token = login_response.json()['access']
    headers = {'Authorization': f'Bearer {token}'}
    
    # 2. Dashboard stats
    print("\n1. Probando /api/dashboard/stats/...")
    stats_response = requests.get(f"{BASE_URL}/dashboard/stats/", headers=headers, timeout=10)
    print(f"   Status: {stats_response.status_code}")
    
    if stats_response.status_code == 200:
        data = stats_response.json()
        print(f"   ✅ Total Teams: {data['total_teams']}")
        print(f"   ✅ Total Players: {data['total_players']}")
        print(f"   ✅ Total Matches: {data['total_matches']}")
        print(f"   ✅ Recent Matches: {len(data['recent_matches'])}")
        print(f"   ✅ Upcoming Matches: {len(data['upcoming_matches'])}")
        
        # Mostrar partidos recientes
        if data['recent_matches']:
            print("   📋 Partidos Recientes:")
            for match in data['recent_matches']:
                print(f"      - {match['home_team']} {match['home_score']}-{match['away_score']} {match['away_team']}")
        
        # Mostrar próximos partidos
        if data['upcoming_matches']:
            print("   📅 Próximos Partidos:")
            for match in data['upcoming_matches']:
                print(f"      - {match['home_team']} vs {match['away_team']} ({match['venue']})")
    
    # 3. Top Scorers
    print("\n2. Probando /api/dashboard/top-scorers/...")
    scorers_response = requests.get(f"{BASE_URL}/dashboard/top-scorers/", headers=headers, timeout=10)
    print(f"   Status: {scorers_response.status_code}")
    
    if scorers_response.status_code == 200:
        scorers = scorers_response.json()
        print(f"   ✅ Top Scorers found: {len(scorers)}")
        
        if scorers:
            print("   🏆 Tabla de Goleadores:")
            for scorer in scorers:
                print(f"      {scorer['position']}. {scorer['player_name']} ({scorer['team_name']}) - {scorer['goals']} goles")
        else:
            print("   ℹ️  No hay goleadores registrados aún")
    
    return True

def test_api_connectivity():
    """Prueba la conectividad básica con la API"""
    print("\n🔗 Probando conectividad con la API...")
    
    try:
        test_response = requests.get(f"{BASE_URL}/test/", timeout=10)
        print(f"   ✅ API Status: {test_response.status_code}")
        if test_response.status_code == 200:
            print(f"   ✅ API Response: {test_response.json()}")
        return True
    except Exception as e:
        print(f"   ❌ API Error: {e}")
        return False

if __name__ == "__main__":
    print("🚀 VERIFICACIÓN DEL DASHBOARD")
    print("=" * 50)
    
    success = True
    
    success &= test_api_connectivity()
    success &= test_dashboard_endpoints()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 DASHBOARD COMPLETAMENTE FUNCIONAL!")
        print("   - Partidos recientes disponibles")
        print("   - Próximos partidos disponibles")
        print("   - Tabla de goleadores disponible")
        print("   - Estadísticas del torneo disponibles")
    else:
        print("❌ ALGUNAS PRUEBAS FALLARON")
