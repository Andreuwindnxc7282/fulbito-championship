import requests
import json

# Probar el endpoint de jugadores específicamente
token_response = requests.post('http://localhost:8000/api/auth/login/', 
                               json={'username': 'admin', 'password': 'admin123'})

if token_response.status_code == 200:
    token = token_response.json()['access']
    headers = {'Authorization': f'Bearer {token}'}
    
    print("🔍 PROBANDO ENDPOINT DE JUGADORES")
    print("=" * 40)
    
    response = requests.get('http://localhost:8000/api/players/', headers=headers)
    print(f"Status: {response.status_code}")
    
    if response.status_code != 200:
        print(f"Error: {response.text}")
    else:
        data = response.json()
        print(f"Jugadores encontrados: {data.get('count', 0)}")
        
else:
    print("Error en login")
