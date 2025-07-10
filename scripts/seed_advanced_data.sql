-- Script adicional con estadísticas de jugadores 2025
-- Ejecutar después del script principal seed_data.sql

-- Insertar estadísticas individuales de jugadores
INSERT INTO statistics_playerstats (player_id, tournament_id, goals, assists, yellow_cards, red_cards, minutes_played, matches_played, updated_at)
VALUES 
-- Real Madrid
(7, 1, 1, 1, 0, 0, 90, 1, NOW()),  -- Vinícius Jr.
(8, 1, 1, 0, 0, 0, 90, 1, NOW()),  -- Mbappé
(5, 1, 0, 1, 0, 0, 90, 1, NOW()),  -- Bellingham
(6, 1, 0, 0, 0, 0, 90, 1, NOW()),  -- Modrić

-- Manchester City  
(16, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Haaland
(14, 1, 0, 0, 0, 0, 90, 1, NOW()), -- De Bruyne
(15, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Foden
(11, 1, 0, 0, 1, 0, 90, 1, NOW()), -- Walker

-- Arsenal
(23, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Saka
(24, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Jesus
(22, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Ødegaard
(21, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Rice

-- Inter Miami
(28, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Messi
(29, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Suárez
(27, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Busquets
(26, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Alba

-- PSG
(39, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Barcola
(38, 1, 0, 1, 0, 0, 90, 1, NOW()), -- Dembélé
(37, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Vitinha
(32, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Hakimi

-- Liverpool
(45, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Salah
(46, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Núñez
(44, 1, 0, 1, 0, 0, 90, 1, NOW()), -- Mac Allister
(42, 1, 0, 0, 0, 0, 90, 1, NOW()), -- van Dijk

-- Napoli
(51, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Kvaratskhelia
(52, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Osimhen
(50, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Lobotka
(49, 1, 0, 0, 1, 0, 90, 1, NOW()), -- Meret

-- Atletico Madrid
(56, 1, 1, 0, 0, 0, 90, 1, NOW()), -- Álvarez
(55, 1, 0, 1, 0, 0, 90, 1, NOW()), -- Griezmann
(54, 1, 0, 0, 0, 0, 90, 1, NOW()), -- Koke
(53, 1, 0, 0, 0, 0, 90, 1, NOW()); -- De Paul

-- Actualizar información adicional de equipos
UPDATE clubs_team SET 
    website = CASE id
        WHEN 1 THEN 'https://www.realmadrid.com'
        WHEN 2 THEN 'https://www.mancity.com'
        WHEN 3 THEN 'https://www.arsenal.com'
        WHEN 4 THEN 'https://www.intermiamicf.com'
        WHEN 5 THEN 'https://www.psg.fr'
        WHEN 6 THEN 'https://www.liverpoolfc.com'
        WHEN 7 THEN 'https://www.sscnapoli.it'
        WHEN 8 THEN 'https://www.atleticodemadrid.com'
    END,
    city = CASE id
        WHEN 1 THEN 'Madrid'
        WHEN 2 THEN 'Manchester'
        WHEN 3 THEN 'London'
        WHEN 4 THEN 'Miami'
        WHEN 5 THEN 'Paris'
        WHEN 6 THEN 'Liverpool'
        WHEN 7 THEN 'Naples'
        WHEN 8 THEN 'Madrid'
    END,
    country = CASE id
        WHEN 1 THEN 'España'
        WHEN 2 THEN 'Inglaterra'
        WHEN 3 THEN 'Inglaterra'
        WHEN 4 THEN 'Estados Unidos'
        WHEN 5 THEN 'Francia'
        WHEN 6 THEN 'Inglaterra'
        WHEN 7 THEN 'Italia'
        WHEN 8 THEN 'España'
    END
WHERE id BETWEEN 1 AND 8;

-- Insertar información de lesiones/suspensiones actuales
INSERT INTO clubs_playerinjury (player_id, injury_type, start_date, expected_return_date, description, is_active, created_at, updated_at)
VALUES 
(1, 'injury', '2025-01-15', '2025-02-28', 'Lesión en la rodilla izquierda', true, NOW(), NOW()), -- Courtois
(52, 'injury', '2025-01-20', '2025-03-01', 'Desgarro muscular', true, NOW(), NOW()); -- Osimhen

-- Insertar transferencias recientes 2025
INSERT INTO clubs_transfer (player_id, from_team_id, to_team_id, transfer_date, transfer_fee, transfer_type, created_at, updated_at)
VALUES 
(8, NULL, 1, '2024-07-01', 180000000, 'permanent', NOW(), NOW()), -- Mbappé al Real Madrid
(51, NULL, 2, '2024-08-15', 75000000, 'permanent', NOW(), NOW()), -- McTominay al Napoli
(56, 2, 8, '2024-07-30', 95000000, 'permanent', NOW(), NOW()); -- Álvarez al Atlético

-- Insertar datos históricos del torneo
INSERT INTO competition_tournamenthistory (tournament_id, season, champion_team_id, runner_up_team_id, top_scorer_player_id, total_goals, total_matches, created_at)
VALUES 
(1, '2024', 1, 6, 45, 89, 32, NOW()), -- Real Madrid campeón 2024
(1, '2023', 2, 1, 16, 92, 32, NOW()), -- City campeón 2023
(1, '2022', 6, 3, 28, 87, 32, NOW()); -- Liverpool campeón 2022
