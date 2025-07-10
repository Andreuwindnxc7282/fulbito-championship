import requests
import json

def test_all_endpoints():
    """Probar todos los endpoints individualmente"""
    print("🔍 DIAGNÓSTICO DE ENDPOINTS")
    print("=" * 50)
    
    # Probar login primero
    try:
        login_response = requests.post('http://localhost:8000/api/auth/login/', 
                                     json={'username': 'admin', 'password': 'admin123'})
        
        if login_response.status_code == 200:
            token = login_response.json()['access']
            headers = {'Authorization': f'Bearer {token}'}
            print("✅ Login exitoso")
            
            # Lista de endpoints a probar
            endpoints = [
                ('/api/teams/', 'Equipos'),
                ('/api/players/', 'Jugadores'),
                ('/api/matches/', 'Partidos'),
                ('/api/standings/', 'Posiciones'),
                ('/api/dashboard/stats/', 'Stats Dashboard'),
                ('/api/dashboard/top-scorers/', 'Goleadores'),
                ('/api/auth/me/', 'Perfil Usuario'),
                ('/swagger/', 'Swagger (sin auth)')
            ]
            
            failed_endpoints = []
            
            for endpoint, name in endpoints:
                try:
                    if endpoint == '/swagger/':
                        response = requests.get(f'http://localhost:8000{endpoint}', timeout=5)
                    else:
                        response = requests.get(f'http://localhost:8000{endpoint}', 
                                              headers=headers, timeout=5)
                    
                    if response.status_code == 200:
                        print(f"✅ {name}: {endpoint}")
                    else:
                        print(f"❌ {name}: {endpoint} - Status: {response.status_code}")
                        failed_endpoints.append((endpoint, name, response.status_code))
                        
                except Exception as e:
                    print(f"❌ {name}: {endpoint} - Error: {str(e)}")
                    failed_endpoints.append((endpoint, name, str(e)))
            
            print(f"\n📊 RESUMEN:")
            print(f"✅ Endpoints funcionando: {len(endpoints) - len(failed_endpoints)}/{len(endpoints)}")
            print(f"❌ Endpoints con problemas: {len(failed_endpoints)}")
            
            if failed_endpoints:
                print("\n🔧 ENDPOINTS A CORREGIR:")
                for endpoint, name, error in failed_endpoints:
                    print(f"  - {name}: {endpoint} ({error})")
                    
            return len(failed_endpoints) == 0
            
        else:
            print(f"❌ Login falló: {login_response.status_code}")
            print(f"Error: {login_response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error de conexión: {str(e)}")
        return False

if __name__ == "__main__":
    success = test_all_endpoints()
    if success:
        print("\n🎉 ¡TODOS LOS ENDPOINTS ESTÁN FUNCIONANDO!")
    else:
        print("\n⚠️  HAY ENDPOINTS QUE NECESITAN CORRECCIÓN")
