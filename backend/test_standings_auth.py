import requests
import json

# Token de desarrollo (superuser) - actualizado
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyMTc2MzIxLCJpYXQiOjE3NTIxNzI3MjEsImp0aSI6Ijg2ZDY5ZjJiNDgyMTRmMDM5ZjNhNzgyNGM2NjdiMTlkIiwidXNlcl9pZCI6MX0.ns6PKtG2po6mkW35yLgKKDKYizMJ0yF-RWpwmLa_Z3k"

# Probar el endpoint de standings
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8000/api/standings/', headers=headers)
print(f'Status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print(f'Count: {data.get("count", "N/A")}')
    print(f'Results: {len(data.get("results", []))}')
    if data.get('results'):
        print('\\n🏆 TABLA DE POSICIONES:')
        print('=' * 60)
        print(f'{"Pos":<3} {"Equipo":<15} {"PJ":<3} {"G":<3} {"E":<3} {"P":<3} {"GF":<3} {"GC":<3} {"DG":<4} {"PTS":<3}')
        print('-' * 60)
        for i, result in enumerate(data['results'], 1):
            team_name = result.get("team_name", "N/A")
            played = result.get("played", 0)
            won = result.get("won", 0)
            drawn = result.get("drawn", 0)
            lost = result.get("lost", 0)
            goals_for = result.get("goals_for", 0)
            goals_against = result.get("goals_against", 0)
            goal_diff = result.get("goal_difference", 0)
            points = result.get("points", 0)
            
            print(f'{i:<3} {team_name:<15} {played:<3} {won:<3} {drawn:<3} {lost:<3} {goals_for:<3} {goals_against:<3} {goal_diff:<4} {points:<3}')
else:
    print(f'Error: {response.text}')
