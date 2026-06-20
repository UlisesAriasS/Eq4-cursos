-- ─────────────────────────────────────────────────────────────────────────────
-- Script de inicialización de la base de datos — Eq4-Cursos
-- Ejecutar antes de arrancar el backend por primera vez.
-- Compatible con MySQL 8+
-- ─────────────────────────────────────────────────────────────────────────────

CREATE DATABASE IF NOT EXISTS eq4cursos
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE eq4cursos;

-- ── Tablas ────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS usuarios (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    correo        VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id        INT NOT NULL,
    activo        BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS docentes (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id       INT UNIQUE NOT NULL,
    numero_empleado  VARCHAR(20) UNIQUE NOT NULL,
    nombre           VARCHAR(100) NOT NULL,
    apellidos        VARCHAR(100) NOT NULL,
    categoria        VARCHAR(100),
    adscripcion      VARCHAR(150),
    grado_academico  VARCHAR(50),
    es_ptc           BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historial_capacitacion (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id      INT NOT NULL,
    curso_id        INT NOT NULL,
    estatus         ENUM('Inscrito', 'Aprobado', 'Reprobado') DEFAULT 'Inscrito',
    fecha_conclusion DATE NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- ── Datos de prueba ───────────────────────────────────────────────────────────

-- Usuario docente 1 — perfil COMPLETO  (password: profesor123)
-- Hash bcrypt generado con: python -c "import bcrypt; print(bcrypt.hashpw(b'profesor123', bcrypt.gensalt()).decode())"
INSERT INTO usuarios (correo, password_hash, rol_id, activo)
VALUES ('juan.ramirez@universidad.edu.mx',
        '$2b$12$2mSK3enu1XVE6oKUQpLi9OZpPbOjuqV6gB9W4i5ZknUGc3Q0lGLcm',
        2, TRUE);

INSERT INTO docentes (usuario_id, numero_empleado, nombre, apellidos, categoria, adscripcion, grado_academico, es_ptc)
VALUES (
    LAST_INSERT_ID(),
    'EMP-2024-001',
    'Juan Carlos',
    'Ramírez Torres',
    'Profesor Titular A',
    'Departamento de Sistemas y Computación',
    'Maestría',
    TRUE
);

-- Usuario docente 2 — perfil INCOMPLETO para probar el modal CompletarPerfil
INSERT INTO usuarios (correo, password_hash, rol_id, activo)
VALUES ('maria.lopez@universidad.edu.mx',
        '$2b$12$2mSK3enu1XVE6oKUQpLi9OZpPbOjuqV6gB9W4i5ZknUGc3Q0lGLcm',
        2, TRUE);

INSERT INTO docentes (usuario_id, numero_empleado, nombre, apellidos, categoria, adscripcion, grado_academico, es_ptc)
VALUES (
    LAST_INSERT_ID(),
    'EMP-2024-002',
    'María Elena',
    'López Sánchez',
    NULL,
    NULL,
    NULL,
    FALSE
);

-- Historial de capacitación para el primer docente (usuario_id = 1)
INSERT INTO historial_capacitacion (usuario_id, curso_id, estatus, fecha_conclusion)
VALUES
    (1, 101, 'Aprobado', '2025-06-30'),
    (1, 102, 'Aprobado', '2025-11-15'),
    (1, 103, 'Inscrito', NULL),
    (1, 104, 'Reprobado', '2024-12-20');
