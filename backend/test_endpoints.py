import requests
import json

# Generar token fresco
try:
    token_response = requests.post('http://localhost:8000/api/auth/login/', 
                                   json={'username': 'admin', 'password': 'admin123'})
    
    if token_response.status_code == 200:
        token = token_response.json()['access']
        headers = {'Authorization': f'Bearer {token}'}
        
        endpoints_to_test = [
            ('GET', '/api/teams/', 'Equipos'),
            ('GET', '/api/players/', 'Jugadores'),
            ('GET', '/api/matches/', 'Partidos'),
            ('GET', '/api/standings/', 'Posiciones'),
            ('GET', '/api/dashboard/stats/', 'Stats Dashboard'),
            ('GET', '/api/dashboard/top-scorers/', 'Goleadores'),
            ('GET', '/api/auth/me/', 'Perfil Usuario'),
            ('GET', '/swagger/', 'Documentación Swagger')
        ]
        
        for method, endpoint, name in endpoints_to_test:
            try:
                if endpoint == '/swagger/':
                    response = requests.get(f'http://localhost:8000{endpoint}')
                else:
                    response = requests.get(f'http://localhost:8000{endpoint}', headers=headers)
                
                if response.status_code in [200, 201]:
                    print(f'✅ {name}: {endpoint} - OK')
                else:
                    print(f'❌ {name}: {endpoint} - Status: {response.status_code}')
                    if response.status_code == 404:
                        print(f'   Error: Endpoint no encontrado')
                    elif response.status_code == 401:
                        print(f'   Error: No autorizado')
                    else:
                        print(f'   Error: {response.text[:100]}')
            except Exception as e:
                print(f'❌ {name}: {endpoint} - Error: {str(e)}')
    else:
        print('❌ No se pudo obtener token de autenticación')
        print(f'Status: {token_response.status_code}')
        print(f'Error: {token_response.text}')
except Exception as e:
    print(f'❌ Error de conexión: {str(e)}')
