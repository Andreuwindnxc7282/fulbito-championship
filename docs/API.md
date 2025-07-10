# API Documentation - Fulbito Championship

## Autenticación

La API utiliza autenticación JWT (JSON Web Token).

### Obtener Token

\`\`\`
POST /api/auth/login/
\`\`\`

**Parámetros:**

\`\`\`json
{
  "username": "usuario",
  "password": "contraseña"
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
\`\`\`

### Refrescar Token

\`\`\`
POST /api/auth/refresh/
\`\`\`

**Parámetros:**

\`\`\`json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
\`\`\`

**Respuesta:**

\`\`\`json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
\`\`\`

## Endpoints Públicos

### Tabla de Posiciones

\`\`\`
GET /api/public/standings/{tournament_id}/
\`\`\`

**Respuesta:**

\`\`\`json
[
  {
    "team_name": "Real Madrid",
    "team_logo": "http://example.com/media/team_logos/real_madrid.png",
    "played": 11,
    "won": 8,
    "drawn": 2,
    "lost": 1,
    "goals_for": 24,
    "goals_against": 8,
    "goal_difference": 16,
    "points": 26
  },
  ...
]
\`\`\`

### Calendario de Partidos

\`\`\`
GET /api/public/schedule/{stage_id}/
\`\`\`

**Respuesta:**

\`\`\`json
[
  {
    "id": 1,
    "datetime": "2024-01-15T18:00:00Z",
    "team_home": {
      "id": 1,
      "name": "Real Madrid",
      "logo": "http://example.com/media/team_logos/real_madrid.png"
    },
    "team_away": {
      "id": 2,
      "name": "Barcelona",
      "logo": "http://example.com/media/team_logos/barcelona.png"
    },
    "venue": {
      "id": 1,
      "name": "Cancha Central",
      "address": "Av. Principal 123",
      "city": "Lima"
    },
    "referee": {
      "id": 1,
      "first_name": "Pierluigi",
      "last_name": "Collina"
    },
    "home_score": 3,
    "away_score": 2,
    "status": "finished",
    "events": [
      {
        "id": 1,
        "player_name": "Cristiano Ronaldo",
        "team_name": "Real Madrid",
        "minute": 23,
        "event_type": "Gol",
        "description": ""
      },
      ...
    ]
  },
  ...
]
\`\`\`

## Endpoints Protegidos

### Torneos

\`\`\`
GET /api/tournaments/
POST /api/tournaments/
GET /api/tournaments/{id}/
PUT /api/tournaments/{id}/
DELETE /api/tournaments/{id}/
\`\`\`

### Equipos

\`\`\`
GET /api/teams/
POST /api/teams/
GET /api/teams/{id}/
PUT /api/teams/{id}/
DELETE /api/teams/{id}/
GET /api/teams/{id}/players/
GET /api/teams/{id}/statistics/
\`\`\`

### Jugadores

\`\`\`
GET /api/players/
POST /api/players/
GET /api/players/{id}/
PUT /api/players/{id}/
DELETE /api/players/{id}/
GET /api/players/{id}/statistics/
\`\`\`

### Partidos

\`\`\`
GET /api/matches/
POST /api/matches/
GET /api/matches/{id}/
PUT /api/matches/{id}/
DELETE /api/matches/{id}/
POST /api/matches/{id}/start_match/
POST /api/matches/{id}/finish_match/
\`\`\`

### Eventos de Partido

\`\`\`
GET /api/match-events/
POST /api/match-events/
GET /api/match-events/{id}/
PUT /api/match-events/{id}/
DELETE /api/match-events/{id}/
\`\`\`

### Estadísticas

\`\`\`
GET /api/standings/
POST /api/standings/update_all/
\`\`\`

## WebSockets

La API también proporciona WebSockets para actualizaciones en tiempo real de partidos.

### Conexión

\`\`\`
ws://example.com/ws/matches/{match_id}/
\`\`\`

### Mensajes Recibidos

\`\`\`json
{
  "id": 1,
  "home_team": "Real Madrid",
  "away_team": "Barcelona",
  "home_score": 2,
  "away_score": 1,
  "status": "live",
  "venue": "Cancha Central",
  "datetime": "2024-01-15T18:00:00Z",
  "referee": "Pierluigi Collina",
  "events": [
    {
      "id": 1,
      "player_name": "Cristiano Ronaldo",
      "team_name": "Real Madrid",
      "minute": 23,
      "event_type": "Gol",
      "description": ""
    }
  ],
  "last_updated": "2024-01-15T18:23:45Z"
}
\`\`\`

### Mensajes Enviados (Solo Administradores)

\`\`\`json
{
  "action": "update_score",
  "home_score": 2,
  "away_score": 1
}
\`\`\`

\`\`\`json
{
  "action": "add_event",
  "event_type": "goal",
  "player_id": 1,
  "minute": 23,
  "description": ""
}
\`\`\`

\`\`\`json
{
  "action": "change_status",
  "status": "finished"
}
\`\`\`

## Códigos de Estado

- 200: OK
- 201: Creado
- 204: Sin contenido
- 400: Solicitud incorrecta
- 401: No autorizado
- 403: Prohibido
- 404: No encontrado
- 500: Error interno del servidor
