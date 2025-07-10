import requests
import json

# Probar el endpoint de standings
response = requests.get('http://localhost:8000/api/standings/')
print(f'Status: {response.status_code}')
if response.status_code == 200:
    data = response.json()
    print(f'Count: {data.get("count", "N/A")}')
    print(f'Results: {len(data.get("results", []))}')
    if data.get('results'):
        for result in data['results'][:3]:
            print(f'- {result.get("team", {}).get("name", "N/A")}: {result.get("points", 0)} pts')
else:
    print(f'Error: {response.text}')
