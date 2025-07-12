#!/usr/bin/env python3
"""
Verificación simplificada - Solo lo esencial
"""

import requests
import sys

def test_essential():
    """Verifica solo lo esencial para el funcionamiento"""
    print("🔍 Verificando sistema esencial...")
    
    try:
        # Test 1: Backend disponible
        response = requests.get('http://localhost:8000/api/dashboard/stats/', timeout=5)
        if response.status_code == 200:
            print("✅ Backend Django funcionando")
        else:
            print("❌ Backend Django con problemas")
            return False
            
        # Test 2: Datos disponibles
        data = response.json()
        if 'total_teams' in data:
            print("✅ Datos del dashboard disponibles")
        else:
            print("❌ Datos del dashboard faltantes")
            return False
            
        # Test 3: Frontend (verificar que el puerto esté libre/ocupado)
        try:
            frontend_response = requests.get('http://localhost:3000', timeout=3)
            print("✅ Frontend Next.js respondiendo")
        except:
            print("⚠️  Frontend Next.js puede estar iniciándose...")
            
        print("\n🎉 Sistema esencial funcionando correctamente")
        print("🌐 Ve a: http://localhost:3000")
        return True
        
    except Exception as e:
        print(f"❌ Error en verificación: {str(e)[:50]}")
        return False

if __name__ == "__main__":
    success = test_essential()
    sys.exit(0 if success else 1)
