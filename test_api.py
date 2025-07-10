#!/usr/bin/env python3
"""
Script de prueba para verificar que todos los endpoints del API están funcionando correctamente
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(url, description):
    """Probar un endpoint y mostrar resultado"""
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {description}: OK")
            print(f"   📊 Datos recibidos: {len(data) if isinstance(data, list) else len(data.keys()) if isinstance(data, dict) else 'N/A'} elementos")
            return True
        else:
            print(f"❌ {description}: ERROR {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {description}: ERROR de conexión - {e}")
        return False

def main():
    print("🔧 Probando endpoints de la API del campeonato de fulbito...")
    print("=" * 60)
    
    # Lista de endpoints a probar
    endpoints = [
        (f"{BASE_URL}/api/public/standings/1/", "Tabla de posiciones"),
        (f"{BASE_URL}/api/public/schedule/1/", "Calendario de partidos"),
        (f"{BASE_URL}/api/tournaments/", "Lista de torneos"),
        (f"{BASE_URL}/api/teams/", "Lista de equipos"),
        (f"{BASE_URL}/api/matches/", "Lista de partidos"),
    ]
    
    success_count = 0
    total_count = len(endpoints)
    
    for url, description in endpoints:
        if test_endpoint(url, description):
            success_count += 1
        print()
    
    print("=" * 60)
    print(f"📈 Resultado: {success_count}/{total_count} endpoints funcionando correctamente")
    
    if success_count == total_count:
        print("🎉 ¡Todos los endpoints están funcionando perfectamente!")
    else:
        print("⚠️  Algunos endpoints necesitan corrección.")

if __name__ == "__main__":
    main()
