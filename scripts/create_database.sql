-- Script para crear la base de datos inicial
-- Ejecutar como superusuario de PostgreSQL

CREATE DATABASE fulbito_db;
CREATE USER fulbito_user WITH PASSWORD 'fulbito_password_2024';
GRANT ALL PRIVILEGES ON DATABASE fulbito_db TO fulbito_user;

-- Conectar a la base de datos fulbito_db
\c fulbito_db;

-- Otorgar permisos adicionales
GRANT ALL ON SCHEMA public TO fulbito_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fulbito_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fulbito_user;

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
