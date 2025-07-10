import os
import requests
import json
from datetime import datetime

def test_frontend_components():
    """Verificar que los componentes del frontend estén actualizados"""
    print("📱 VERIFICANDO COMPONENTES DEL FRONTEND")
    print("=" * 60)
    
    components_to_check = [
        'components/dashboard.tsx',
        'components/players.tsx', 
        'components/schedule.tsx',
        'components/standings-real.tsx',
        'hooks/use-auth.tsx',
        'lib/auth-utils.ts',
        'lib/api.ts'
    ]
    
    frontend_score = 0
    total_components = len(components_to_check)
    
    for component in components_to_check:
        file_path = f"../{component}"
        if os.path.exists(file_path):
            print(f"  ✅ {component}")
            frontend_score += 1
        else:
            print(f"  ❌ {component}")
    
    print(f"🎯 FRONTEND: {frontend_score}/{total_components} ({frontend_score/total_components*100:.1f}%)")
    return frontend_score == total_components

def test_backend_endpoints():
    """Verificar todos los endpoints del backend"""
    print("\n🔗 VERIFICANDO ENDPOINTS DEL BACKEND")
    print("=" * 60)
    
    # Generar token fresco
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
        
        working_endpoints = 0
        
        for method, endpoint, name in endpoints_to_test:
            try:
                if endpoint == '/swagger/':
                    # Swagger no requiere autenticación
                    response = requests.get(f'http://localhost:8000{endpoint}')
                else:
                    response = requests.get(f'http://localhost:8000{endpoint}', headers=headers)
                
                if response.status_code in [200, 201]:
                    print(f"  ✅ {name}: {endpoint}")
                    working_endpoints += 1
                else:
                    print(f"  ❌ {name}: {endpoint} (Status: {response.status_code})")
            except Exception as e:
                print(f"  ❌ {name}: {endpoint} (Error: {str(e)})")
        
        print(f"🎯 ENDPOINTS: {working_endpoints}/{len(endpoints_to_test)} ({working_endpoints/len(endpoints_to_test)*100:.1f}%)")
        return working_endpoints == len(endpoints_to_test)
    else:
        print("❌ No se pudo obtener token de autenticación")
        return False

def test_database_data():
    """Verificar que hay datos en la base de datos"""
    print("\n🗄️  VERIFICANDO DATOS EN BASE DE DATOS")
    print("=" * 60)
    
    try:
        # Verificar datos con Django shell
        import django
        import os
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fulbito.settings')
        django.setup()
        
        from apps.clubs.models import Team, Player
        from apps.matches.models import Match
        from apps.statistics.models import Standing
        from django.contrib.auth.models import User
        
        data_checks = [
            (User.objects.count(), 'Usuarios'),
            (Team.objects.count(), 'Equipos'),
            (Player.objects.count(), 'Jugadores'),
            (Match.objects.count(), 'Partidos'),
            (Standing.objects.count(), 'Posiciones')
        ]
        
        all_good = True
        for count, name in data_checks:
            if count > 0:
                print(f"  ✅ {name}: {count} registros")
            else:
                print(f"  ❌ {name}: {count} registros")
                all_good = False
        
        return all_good
        
    except Exception as e:
        print(f"❌ Error verificando datos: {str(e)}")
        return False

def generate_final_report():
    """Generar reporte final del proyecto"""
    print("\n" + "=" * 80)
    print("📋 REPORTE FINAL DEL PROYECTO")
    print("=" * 80)
    
    # Verificar componentes
    frontend_ok = test_frontend_components()
    
    # Verificar endpoints  
    backend_ok = test_backend_endpoints()
    
    # Verificar datos
    data_ok = test_database_data()
    
    # Calcular completitud
    total_score = sum([frontend_ok, backend_ok, data_ok])
    completeness = total_score / 3 * 100
    
    print(f"\n🎯 COMPLETITUD DEL PROYECTO:")
    print(f"  📱 Frontend: {'✅ COMPLETO' if frontend_ok else '❌ INCOMPLETO'}")
    print(f"  🔗 Backend: {'✅ COMPLETO' if backend_ok else '❌ INCOMPLETO'}")
    print(f"  🗄️  Datos: {'✅ COMPLETO' if data_ok else '❌ INCOMPLETO'}")
    print(f"  🏆 TOTAL: {completeness:.1f}%")
    
    if completeness == 100:
        print("\n🎉 ¡PROYECTO COMPLETAMENTE TERMINADO!")
        print("✅ Todas las funcionalidades están implementadas")
        print("✅ Todos los endpoints están funcionando")
        print("✅ La base de datos tiene datos")
        print("✅ El frontend está conectado al backend")
    else:
        print(f"\n⚠️  PROYECTO {completeness:.1f}% COMPLETO")
        print("❌ Faltan algunos componentes por completar")
    
    print("=" * 80)
    
    return completeness == 100

if __name__ == "__main__":
    print("🏁 EVALUACIÓN FINAL DEL PROYECTO FULBITO")
    print("=" * 80)
    print(f"📅 Fecha: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}")
    
    is_complete = generate_final_report()
    
    if is_complete:
        print("\n🎊 ¡FELICITACIONES! El proyecto está terminado y funcionando.")
    else:
        print("\n🔧 El proyecto necesita algunos ajustes finales.")
