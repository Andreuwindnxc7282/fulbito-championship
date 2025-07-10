#!/usr/bin/env python3
"""
Script para generar datos de fulbito con información real 2025
Ejecutar: python scripts/generate_real_data.py
"""

import json
from datetime import datetime, timedelta
import random

# Datos reales de equipos 2025
TEAMS_DATA = {
    "Real Madrid": {
        "coach": "Carlo Ancelotti",
        "founded": 1902,
        "country": "España",
        "city": "Madrid",
        "stadium": "Santiago Bernabéu",
        "colors": ["Blanco", "Azul"],
        "players": [
            {"name": "Thibaut Courtois", "position": "GK", "number": 1, "age": 32},
            {"name": "Dani Carvajal", "position": "DEF", "number": 2, "age": 32},
            {"name": "Eder Militão", "position": "DEF", "number": 3, "age": 27},
            {"name": "David Alaba", "position": "DEF", "number": 4, "age": 32},
            {"name": "Jude Bellingham", "position": "MID", "number": 5, "age": 21},
            {"name": "Luka Modrić", "position": "MID", "number": 10, "age": 39},
            {"name": "Vinícius Jr.", "position": "FWD", "number": 7, "age": 24},
            {"name": "Kylian Mbappé", "position": "FWD", "number": 9, "age": 26}
        ]
    },
    "Manchester City": {
        "coach": "Pep Guardiola",
        "founded": 1880,
        "country": "Inglaterra",
        "city": "Manchester",
        "stadium": "Etihad Stadium",
        "colors": ["Azul claro", "Blanco"],
        "players": [
            {"name": "Ederson", "position": "GK", "number": 31, "age": 31},
            {"name": "Kyle Walker", "position": "DEF", "number": 2, "age": 34},
            {"name": "Ruben Dias", "position": "DEF", "number": 3, "age": 27},
            {"name": "Josko Gvardiol", "position": "DEF", "number": 24, "age": 23},
            {"name": "Rodri", "position": "MID", "number": 16, "age": 28},
            {"name": "Kevin De Bruyne", "position": "MID", "number": 17, "age": 33},
            {"name": "Phil Foden", "position": "MID", "number": 47, "age": 24},
            {"name": "Erling Haaland", "position": "FWD", "number": 9, "age": 24}
        ]
    },
    "Arsenal": {
        "coach": "Mikel Arteta",
        "founded": 1886,
        "country": "Inglaterra",
        "city": "London",
        "stadium": "Emirates Stadium",
        "colors": ["Rojo", "Blanco"],
        "players": [
            {"name": "David Raya", "position": "GK", "number": 22, "age": 29},
            {"name": "Ben White", "position": "DEF", "number": 4, "age": 27},
            {"name": "William Saliba", "position": "DEF", "number": 2, "age": 23},
            {"name": "Gabriel Magalhães", "position": "DEF", "number": 6, "age": 27},
            {"name": "Declan Rice", "position": "MID", "number": 41, "age": 26},
            {"name": "Martin Ødegaard", "position": "MID", "number": 8, "age": 26},
            {"name": "Bukayo Saka", "position": "FWD", "number": 7, "age": 23},
            {"name": "Gabriel Jesus", "position": "FWD", "number": 9, "age": 27}
        ]
    },
    "Inter Miami": {
        "coach": "Gerardo Martino",
        "founded": 2018,
        "country": "Estados Unidos",
        "city": "Miami",
        "stadium": "DRV PNK Stadium",
        "colors": ["Rosa", "Negro"],
        "players": [
            {"name": "Drake Callender", "position": "GK", "number": 1, "age": 27},
            {"name": "Jordi Alba", "position": "DEF", "number": 18, "age": 35},
            {"name": "Sergio Busquets", "position": "MID", "number": 5, "age": 36},
            {"name": "Lionel Messi", "position": "FWD", "number": 10, "age": 37},
            {"name": "Luis Suárez", "position": "FWD", "number": 9, "age": 38},
            {"name": "Leonardo Campana", "position": "FWD", "number": 19, "age": 24}
        ]
    }
}

def generate_match_results():
    """Genera resultados realistas de partidos"""
    results = []
    match_date = datetime(2025, 2, 8)
    
    teams = list(TEAMS_DATA.keys())
    
    for i in range(0, len(teams), 2):
        if i + 1 < len(teams):
            home_team = teams[i]
            away_team = teams[i + 1]
            
            # Generar resultado realista
            home_score = random.randint(0, 4)
            away_score = random.randint(0, 3)
            
            results.append({
                "date": match_date.strftime("%Y-%m-%d %H:%M:%S"),
                "home_team": home_team,
                "away_team": away_team,
                "home_score": home_score,
                "away_score": away_score,
                "status": "finished"
            })
            
            match_date += timedelta(hours=2)
    
    return results

def generate_standings():
    """Genera tabla de posiciones basada en resultados"""
    standings = []
    
    for team_name, team_data in TEAMS_DATA.items():
        # Datos simulados pero realistas
        played = random.randint(8, 12)
        wins = random.randint(3, played)
        draws = random.randint(0, played - wins)
        losses = played - wins - draws
        
        goals_for = random.randint(wins * 1, wins * 3 + draws + 5)
        goals_against = random.randint(losses, losses * 2 + 8)
        
        points = wins * 3 + draws
        
        standings.append({
            "team": team_name,
            "played": played,
            "wins": wins,
            "draws": draws,
            "losses": losses,
            "goals_for": goals_for,
            "goals_against": goals_against,
            "goal_difference": goals_for - goals_against,
            "points": points
        })
    
    # Ordenar por puntos y diferencia de goles
    standings.sort(key=lambda x: (x["points"], x["goal_difference"]), reverse=True)
    
    return standings

def generate_top_scorers():
    """Genera tabla de goleadores"""
    scorers = []
    
    for team_name, team_data in TEAMS_DATA.items():
        for player in team_data["players"]:
            if player["position"] in ["FWD", "MID"]:
                goals = random.randint(0, 15) if player["position"] == "FWD" else random.randint(0, 8)
                if goals > 0:
                    scorers.append({
                        "player": player["name"],
                        "team": team_name,
                        "goals": goals,
                        "position": player["position"]
                    })
    
    scorers.sort(key=lambda x: x["goals"], reverse=True)
    return scorers[:10]

def main():
    """Función principal"""
    print("🏆 Generando datos del Campeonato de Fulbito 2025...")
    
    # Generar datos
    matches = generate_match_results()
    standings = generate_standings()
    top_scorers = generate_top_scorers()
    
    # Crear estructura de datos
    championship_data = {
        "tournament": {
            "name": "Campeonato de Fulbito 2025",
            "season": 2025,
            "start_date": "2025-02-01",
            "end_date": "2025-07-30",
            "current_phase": "Fase de Grupos"
        },
        "teams": TEAMS_DATA,
        "matches": matches,
        "standings": standings,
        "top_scorers": top_scorers,
        "statistics": {
            "total_teams": len(TEAMS_DATA),
            "total_players": sum(len(team["players"]) for team in TEAMS_DATA.values()),
            "matches_played": len([m for m in matches if m["status"] == "finished"]),
            "total_goals": sum(s["goals_for"] for s in standings)
        }
    }
    
    # Guardar en archivo JSON
    with open("scripts/championship_data_2025.json", "w", encoding="utf-8") as f:
        json.dump(championship_data, f, indent=2, ensure_ascii=False)
    
    print("✅ Datos generados exitosamente!")
    print(f"📊 Total de equipos: {championship_data['statistics']['total_teams']}")
    print(f"👥 Total de jugadores: {championship_data['statistics']['total_players']}")
    print(f"⚽ Partidos jugados: {championship_data['statistics']['matches_played']}")
    print(f"🥅 Total de goles: {championship_data['statistics']['total_goals']}")
    
    print("\n🏆 Top 5 Goleadores:")
    for i, scorer in enumerate(top_scorers[:5], 1):
        print(f"{i}. {scorer['player']} ({scorer['team']}) - {scorer['goals']} goles")
    
    print("\n📈 Tabla de Posiciones (Top 4):")
    for i, team in enumerate(standings[:4], 1):
        print(f"{i}. {team['team']} - {team['points']} pts ({team['wins']}W-{team['draws']}D-{team['losses']}L)")

if __name__ == "__main__":
    main()
