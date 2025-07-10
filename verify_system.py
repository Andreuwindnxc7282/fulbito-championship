#!/usr/bin/env python
"""
Script de verificación para el sistema Fulbito Championship
"""
import requests
import sys

def check_backend():
    """Verificar que el backend esté funcionando"""
    try:
        # Probar endpoints públicos
        standings_url = "http://localhost:8000/api/public/standings/1/"
        schedule_url = "http://localhost:8000/api/public/schedule/1/"
        
        print("🔍 Verificando backend Django...")
        
        # Test standings
        response = requests.get(standings_url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Standings: {len(data.get('standings', []))} equipos")
        else:
            print(f"❌ Standings error: {response.status_code}")
            return False
            
        # Test schedule  
        response = requests.get(schedule_url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Schedule: {len(data.get('matches', []))} partidos")
        else:
            print(f"❌ Schedule error: {response.status_code}")
            return False
            
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Backend no está corriendo en localhost:8000")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def check_frontend():
    """Verificar que el frontend esté accesible"""
    try:
        print("🔍 Verificando frontend Next.js...")
        response = requests.get("http://localhost:3002", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend accesible en localhost:3002")
            return True
        else:
            print(f"❌ Frontend error: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Frontend no está corriendo en localhost:3002")
        return False
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == "__main__":
    print("🏆 VERIFICACIÓN SISTEMA FULBITO CHAMPIONSHIP")
    print("=" * 50)
    
    backend_ok = check_backend()
    frontend_ok = check_frontend()
    
    print("\n📊 RESUMEN:")
    print(f"Backend Django: {'✅ OK' if backend_ok else '❌ ERROR'}")
    print(f"Frontend Next.js: {'✅ OK' if frontend_ok else '❌ ERROR'}")
    
    if backend_ok and frontend_ok:
        print("\n🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!")
        print("Backend: http://localhost:8000")
        print("Frontend: http://localhost:3002")
        sys.exit(0)
    else:
        print("\n⚠️  Hay problemas que necesitan resolución")
        if not backend_ok:
            print("- Inicia el backend: cd backend && python manage.py runserver")
        if not frontend_ok:
            print("- Inicia el frontend: npm run dev")
        sys.exit(1)
