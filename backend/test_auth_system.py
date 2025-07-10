#!/usr/bin/env python3
"""
Script para verificar que el sistema de autenticación funciona correctamente
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def test_auth_system():
    """Prueba el sistema de autenticación completo"""
    print("🔧 Probando sistema de autenticación...")
    
    # 1. Probar login
    print("\n1. Probando login...")
    login_data = {
        'username': 'admin',
        'password': 'admin123'
    }
    
    try:
        login_response = requests.post(f"{BASE_URL}/auth/login/", json=login_data, timeout=10)
        print(f"   ✅ Login Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            data = login_response.json()
            print(f"   ✅ Usuario: {data['user']['username']}")
            print(f"   ✅ Email: {data['user']['email']}")
            print(f"   ✅ Es staff: {data['user'].get('is_staff', 'N/A')}")
            print(f"   ✅ Es superuser: {data['user'].get('is_superuser', 'N/A')}")
            
            token = data['access']
            
            # 2. Probar endpoint /api/auth/me/
            print("\n2. Probando endpoint /api/auth/me/...")
            headers = {'Authorization': f'Bearer {token}'}
            me_response = requests.get(f"{BASE_URL}/auth/me/", headers=headers, timeout=10)
            print(f"   ✅ Me Status: {me_response.status_code}")
            
            if me_response.status_code == 200:
                me_data = me_response.json()
                print(f"   ✅ ID: {me_data['id']}")
                print(f"   ✅ Username: {me_data['username']}")
                print(f"   ✅ Email: {me_data['email']}")
                print(f"   ✅ First Name: {me_data['first_name']}")
                print(f"   ✅ Last Name: {me_data['last_name']}")
                print(f"   ✅ Is Staff: {me_data['is_staff']}")
                print(f"   ✅ Is Superuser: {me_data['is_superuser']}")
                print(f"   ✅ Date Joined: {me_data['date_joined']}")
                print(f"   ✅ Last Login: {me_data['last_login']}")
                
                # 3. Probar endpoint de dashboard
                print("\n3. Probando endpoint de dashboard...")
                dashboard_response = requests.get(f"{BASE_URL}/dashboard/stats/", headers=headers, timeout=10)
                print(f"   ✅ Dashboard Status: {dashboard_response.status_code}")
                
                if dashboard_response.status_code == 200:
                    dashboard_data = dashboard_response.json()
                    print(f"   ✅ Total Players: {dashboard_data['total_players']}")
                    print(f"   ✅ Total Teams: {dashboard_data['total_teams']}")
                    print(f"   ✅ Total Matches: {dashboard_data['total_matches']}")
                    print(f"   ✅ Matches Played: {dashboard_data['matches_played']}")
                    print(f"   ✅ Matches Scheduled: {dashboard_data['matches_scheduled']}")
                    print(f"   ✅ Total Goals: {dashboard_data['total_goals']}")
                    print(f"   ✅ Recent Matches: {len(dashboard_data['recent_matches'])}")
                    print(f"   ✅ Upcoming Matches: {len(dashboard_data['upcoming_matches'])}")
                    
                print("\n✅ SISTEMA DE AUTENTICACIÓN FUNCIONA CORRECTAMENTE!")
                return True
                
            else:
                print(f"   ❌ Error en /api/auth/me/: {me_response.status_code}")
                return False
                
        else:
            print(f"   ❌ Login failed: {login_response.status_code}")
            print(f"   ❌ Response: {login_response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error de conexión: {e}")
        return False

def test_invalid_token():
    """Prueba el comportamiento con token inválido"""
    print("\n🔧 Probando comportamiento con token inválido...")
    
    headers = {'Authorization': 'Bearer token_invalido'}
    try:
        me_response = requests.get(f"{BASE_URL}/auth/me/", headers=headers, timeout=10)
        print(f"   ✅ Status con token inválido: {me_response.status_code}")
        
        if me_response.status_code == 401:
            print("   ✅ Token inválido correctamente rechazado")
            return True
        else:
            print(f"   ❌ Comportamiento inesperado: {me_response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"   ❌ Error de conexión: {e}")
        return False

if __name__ == "__main__":
    print("🚀 VERIFICACIÓN DEL SISTEMA DE AUTENTICACIÓN")
    print("=" * 50)
    
    success = True
    
    success &= test_auth_system()
    success &= test_invalid_token()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 TODAS LAS PRUEBAS PASARON - SISTEMA COMPLETO Y FUNCIONAL!")
    else:
        print("❌ ALGUNAS PRUEBAS FALLARON - REVISAR CONFIGURACIÓN")
