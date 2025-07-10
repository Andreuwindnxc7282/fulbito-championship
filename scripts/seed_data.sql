-- Script para poblar la base de datos con datos reales 2025
-- Ejecutar después de las migraciones

-- Insertar Torneo
INSERT INTO competition_tournament (name, season_year, description, start_date, end_date, created_at, updated_at, is_active) 
VALUES ('Campeonato de Fulbito 2025', 2025, 'Torneo oficial de fulbito temporada 2025', '2025-02-01', '2025-07-30', NOW(), NOW(), true);

-- Insertar Fases
INSERT INTO competition_stage (name, stage_type, "order", tournament_id, start_date, end_date, is_completed) 
VALUES 
('Fase de Grupos', 'group', 1, 1, '2025-02-01', '2025-04-15', false),
('Cuartos de Final', 'quarter', 2, 1, '2025-04-20', '2025-05-05', false),
('Semifinales', 'semi', 3, 1, '2025-05-10', '2025-05-20', false),
('Final', 'final', 4, 1, '2025-05-25', '2025-05-25', false);

-- Insertar Grupos
INSERT INTO competition_group (name, stage_id, max_teams) 
VALUES 
('Grupo A', 1, 4),
('Grupo B', 1, 4);

-- Insertar Canchas
INSERT INTO infrastructure_venue (name, address, city, capacity, field_type, has_lighting, has_changing_rooms, created_at, updated_at, is_active) 
VALUES 
('Estadio Nacional', 'Av. José Díaz s/n, Cercado de Lima', 'Lima', 300, 'artificial', true, true, NOW(), NOW(), true),
('Campo de Marte', 'Av. La Peruanidad, Jesús María', 'Lima', 250, 'artificial', true, true, NOW(), NOW(), true),
('Complejo Deportivo Villa El Salvador', 'Villa El Salvador', 'Lima', 200, 'grass', true, true, NOW(), NOW(), true),
('Polideportivo San Marcos', 'Ciudad Universitaria, Lima', 'Lima', 180, 'artificial', true, false, NOW(), NOW(), true);

-- Insertar Árbitros Peruanos
INSERT INTO officials_referee (first_name, last_name, category, license_number, phone, email, created_at, updated_at, is_active) 
VALUES 
('Diego', 'Haro', 'FIFA', 'REF001', '+51999111222', 'diego.haro@fpf.org.pe', NOW(), NOW(), true),
('Kevin', 'Ortega', 'nacional', 'REF002', '+51999111333', 'kevin.ortega@fpf.org.pe', NOW(), NOW(), true),
('Augusto', 'Menéndez', 'nacional', 'REF003', '+51999111444', 'augusto.menendez@fpf.org.pe', NOW(), NOW(), true),
('Michael', 'Espinoza', 'regional', 'REF004', '+51999111555', 'michael.espinoza@fpf.org.pe', NOW(), NOW(), true);

-- Insertar Equipos Reales 2025
INSERT INTO clubs_team (name, coach_name, founded, description, group_id, created_at, updated_at, is_active) 
VALUES 
('Real Madrid', 'Carlo Ancelotti', 1902, 'Club Merengue - Los Blancos', 1, NOW(), NOW(), true),
('Manchester City', 'Pep Guardiola', 1880, 'The Citizens - Sky Blues', 1, NOW(), NOW(), true),
('Arsenal', 'Mikel Arteta', 1886, 'The Gunners - North London', 1, NOW(), NOW(), true),
('Inter Miami', 'Gerardo Martino', 2018, 'Las Garzas - MLS', 1, NOW(), NOW(), true),
('PSG', 'Luis Enrique', 1970, 'Les Parisiens', 2, NOW(), NOW(), true),
('Liverpool', 'Arne Slot', 1892, 'The Reds - Anfield', 2, NOW(), NOW(), true),
('Napoli', 'Antonio Conte', 1926, 'Gli Azzurri - Serie A', 2, NOW(), NOW(), true),
('Atletico Madrid', 'Diego Simeone', 1903, 'Los Colchoneros', 2, NOW(), NOW(), true);

-- Insertar Jugadores Reales 2025

-- REAL MADRID
INSERT INTO clubs_player (first_name, last_name, birth_date, position, jersey_number, team_id, created_at, updated_at, is_active) 
VALUES 
('Thibaut', 'Courtois', '1992-05-11', 'GK', 1, 1, NOW(), NOW(), true),
('Dani', 'Carvajal', '1992-01-11', 'DEF', 2, 1, NOW(), NOW(), true),
('Eder', 'Militão', '1998-01-18', 'DEF', 3, 1, NOW(), NOW(), true),
('David', 'Alaba', '1992-06-24', 'DEF', 4, 1, NOW(), NOW(), true),
('Jude', 'Bellingham', '2003-06-29', 'MID', 5, 1, NOW(), NOW(), true),
('Luka', 'Modrić', '1985-09-09', 'MID', 10, 1, NOW(), NOW(), true),
('Vinícius Jr.', 'Santos', '2000-07-12', 'FWD', 7, 1, NOW(), NOW(), true),
('Kylian', 'Mbappé', '1998-12-20', 'FWD', 9, 1, NOW(), NOW(), true),

-- MANCHESTER CITY
('Ederson', 'Moraes', '1993-08-17', 'GK', 31, 2, NOW(), NOW(), true),
('Kyle', 'Walker', '1990-05-28', 'DEF', 2, 2, NOW(), NOW(), true),
('Ruben', 'Dias', '1997-05-14', 'DEF', 3, 2, NOW(), NOW(), true),
('Josko', 'Gvardiol', '2002-01-23', 'DEF', 24, 2, NOW(), NOW(), true),
('Rodri', 'Hernández', '1996-06-22', 'MID', 16, 2, NOW(), NOW(), true),
('Kevin', 'De Bruyne', '1991-06-28', 'MID', 17, 2, NOW(), NOW(), true),
('Phil', 'Foden', '2000-05-28', 'MID', 47, 2, NOW(), NOW(), true),
('Erling', 'Haaland', '2000-07-21', 'FWD', 9, 2, NOW(), NOW(), true),

-- ARSENAL
('David', 'Raya', '1995-09-15', 'GK', 22, 3, NOW(), NOW(), true),
('Ben', 'White', '1997-10-08', 'DEF', 4, 3, NOW(), NOW(), true),
('William', 'Saliba', '2001-03-24', 'DEF', 2, 3, NOW(), NOW(), true),
('Gabriel', 'Magalhães', '1997-12-19', 'DEF', 6, 3, NOW(), NOW(), true),
('Declan', 'Rice', '1999-01-14', 'MID', 41, 3, NOW(), NOW(), true),
('Martin', 'Ødegaard', '1998-12-17', 'MID', 8, 3, NOW(), NOW(), true),
('Bukayo', 'Saka', '2001-09-05', 'FWD', 7, 3, NOW(), NOW(), true),
('Gabriel', 'Jesus', '1997-04-03', 'FWD', 9, 3, NOW(), NOW(), true),

-- INTER MIAMI
('Drake', 'Callender', '1997-10-07', 'GK', 1, 4, NOW(), NOW(), true),
('Jordi', 'Alba', '1989-03-21', 'DEF', 18, 4, NOW(), NOW(), true),
('Sergio', 'Busquets', '1988-07-16', 'MID', 5, 4, NOW(), NOW(), true),
('Lionel', 'Messi', '1987-06-24', 'FWD', 10, 4, NOW(), NOW(), true),
('Luis', 'Suárez', '1987-01-24', 'FWD', 9, 4, NOW(), NOW(), true),
('Leonardo', 'Campana', '2000-07-24', 'FWD', 19, 4, NOW(), NOW(), true),

-- PSG
('Gianluigi', 'Donnarumma', '1999-02-25', 'GK', 99, 5, NOW(), NOW(), true),
('Achraf', 'Hakimi', '1998-11-04', 'DEF', 2, 5, NOW(), NOW(), true),
('Marquinhos', 'Corrêa', '1994-05-14', 'DEF', 5, 5, NOW(), NOW(), true),
('Warren', 'Zaïre-Emery', '2006-03-08', 'MID', 33, 5, NOW(), NOW(), true),
('Vitinha', 'Ferreira', '2000-02-13', 'MID', 17, 5, NOW(), NOW(), true),
('Ousmane', 'Dembélé', '1997-05-15', 'FWD', 10, 5, NOW(), NOW(), true),
('Bradley', 'Barcola', '2002-09-02', 'FWD', 29, 5, NOW(), NOW(), true),

-- LIVERPOOL
('Alisson', 'Becker', '1993-10-02', 'GK', 1, 6, NOW(), NOW(), true),
('Trent', 'Alexander-Arnold', '1998-10-07', 'DEF', 66, 6, NOW(), NOW(), true),
('Virgil', 'van Dijk', '1991-07-08', 'DEF', 4, 6, NOW(), NOW(), true),
('Ibrahima', 'Konaté', '1999-05-25', 'DEF', 5, 6, NOW(), NOW(), true),
('Alexis', 'Mac Allister', '1998-12-24', 'MID', 10, 6, NOW(), NOW(), true),
('Ryan', 'Gravenberch', '2002-05-16', 'MID', 38, 6, NOW(), NOW(), true),
('Mohamed', 'Salah', '1992-06-15', 'FWD', 11, 6, NOW(), NOW(), true),
('Darwin', 'Núñez', '1999-06-24', 'FWD', 9, 6, NOW(), NOW(), true),

-- NAPOLI
('Alex', 'Meret', '1997-03-22', 'GK', 1, 7, NOW(), NOW(), true),
('Giovanni', 'Di Lorenzo', '1993-08-04', 'DEF', 22, 7, NOW(), NOW(), true),
('Amir', 'Rrahmani', '1994-02-24', 'DEF', 13, 7, NOW(), NOW(), true),
('Alessandro', 'Buongiorno', '1999-06-06', 'DEF', 4, 7, NOW(), NOW(), true),
('Stanislav', 'Lobotka', '1994-11-25', 'MID', 68, 7, NOW(), NOW(), true),
('Scott', 'McTominay', '1996-12-08', 'MID', 8, 7, NOW(), NOW(), true),
('Khvicha', 'Kvaratskhelia', '2001-02-12', 'FWD', 77, 7, NOW(), NOW(), true),
('Victor', 'Osimhen', '1998-12-29', 'FWD', 9, 7, NOW(), NOW(), true),

-- ATLETICO MADRID
('Jan', 'Oblak', '1993-01-07', 'GK', 13, 8, NOW(), NOW(), true),
('Nahuel', 'Molina', '1998-04-06', 'DEF', 16, 8, NOW(), NOW(), true),
('José María', 'Giménez', '1995-01-20', 'DEF', 2, 8, NOW(), NOW(), true),
('Robin', 'Le Normand', '1996-11-11', 'DEF', 3, 8, NOW(), NOW(), true),
('Rodrigo', 'De Paul', '1994-05-24', 'MID', 5, 8, NOW(), NOW(), true),
('Koke', 'Resurrección', '1992-01-08', 'MID', 6, 8, NOW(), NOW(), true),
('Antoine', 'Griezmann', '1991-03-21', 'FWD', 7, 8, NOW(), NOW(), true),
('Julián', 'Álvarez', '2000-01-31', 'FWD', 19, 8, NOW(), NOW(), true);

-- Insertar partidos programados para 2025
INSERT INTO matches_match (datetime, team_home_id, team_away_id, venue_id, referee_id, stage_id, home_score, away_score, status, match_duration, created_at, updated_at) 
VALUES 
-- Jornada 1 - Fase de Grupos
('2025-02-08 15:00:00', 1, 2, 1, 1, 1, 2, 1, 'finished', 90, NOW(), NOW()),
('2025-02-08 17:00:00', 3, 4, 2, 2, 1, 3, 1, 'finished', 90, NOW(), NOW()),
('2025-02-09 15:00:00', 5, 6, 3, 3, 1, 1, 2, 'finished', 90, NOW(), NOW()),
('2025-02-09 17:00:00', 7, 8, 4, 4, 1, 0, 1, 'finished', 90, NOW(), NOW()),

-- Jornada 2 - Fase de Grupos
('2025-02-15 15:00:00', 2, 3, 1, 1, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW()),
('2025-02-15 17:00:00', 4, 1, 2, 2, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW()),
('2025-02-16 15:00:00', 6, 7, 3, 3, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW()),
('2025-02-16 17:00:00', 8, 5, 4, 4, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW()),

-- Jornada 3 - Fase de Grupos
('2025-02-22 15:00:00', 1, 3, 1, 2, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW()),
('2025-02-22 17:00:00', 2, 4, 2, 3, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW()),
('2025-02-23 15:00:00', 5, 7, 3, 4, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW()),
('2025-02-23 17:00:00', 6, 8, 4, 1, 1, NULL, NULL, 'scheduled', 90, NOW(), NOW());

-- Crear tabla de posiciones actualizada 2025
INSERT INTO statistics_standing (team_id, tournament_id, played, won, drawn, lost, goals_for, goals_against, points, updated_at) 
VALUES 
(1, 1, 1, 1, 0, 0, 2, 1, 3, NOW()),  -- Real Madrid
(2, 1, 1, 0, 0, 1, 1, 2, 0, NOW()),  -- Manchester City
(3, 1, 1, 1, 0, 0, 3, 1, 3, NOW()),  -- Arsenal  
(4, 1, 1, 0, 0, 1, 1, 3, 0, NOW()),  -- Inter Miami
(5, 1, 1, 0, 0, 1, 1, 2, 0, NOW()),  -- PSG
(6, 1, 1, 1, 0, 0, 2, 1, 3, NOW()),  -- Liverpool
(7, 1, 1, 0, 0, 1, 0, 1, 0, NOW()),  -- Napoli
(8, 1, 1, 1, 0, 0, 1, 0, 3, NOW());  -- Atletico Madrid

-- Insertar eventos de los partidos jugados
INSERT INTO matches_matchevent (match_id, player_id, event_type, minute, description, created_at, updated_at) 
VALUES 
-- Real Madrid vs Manchester City (2-1)
(1, 7, 'goal', 23, 'Gol de Vinícius Jr. asistencia de Bellingham', NOW(), NOW()),
(1, 14, 'goal', 67, 'Gol de Haaland', NOW(), NOW()),
(1, 8, 'goal', 89, 'Gol de Mbappé de penal', NOW(), NOW()),
(1, 11, 'yellow_card', 45, 'Tarjeta amarilla a Kyle Walker', NOW(), NOW()),

-- Arsenal vs Inter Miami (3-1)  
(2, 23, 'goal', 15, 'Gol de Bukayo Saka', NOW(), NOW()),
(2, 24, 'goal', 34, 'Gol de Gabriel Jesus', NOW(), NOW()),
(2, 28, 'goal', 56, 'Gol de Messi', NOW(), NOW()),
(2, 22, 'goal', 78, 'Gol de Martin Ødegaard', NOW(), NOW()),

-- PSG vs Liverpool (1-2)
(3, 39, 'goal', 12, 'Gol de Bradley Barcola', NOW(), NOW()),
(3, 45, 'goal', 67, 'Gol de Mohamed Salah', NOW(), NOW()),
(3, 46, 'goal', 85, 'Gol de Darwin Núñez', NOW(), NOW()),

-- Napoli vs Atletico Madrid (0-1)
(4, 56, 'goal', 73, 'Gol de Julián Álvarez', NOW(), NOW()),
(4, 49, 'yellow_card', 34, 'Tarjeta amarilla a Alex Meret', NOW(), NOW());
