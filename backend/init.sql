-- ─────────────────────────────────────────────────────────────────────────────
-- Script de inicialización de la base de datos — sistema_etda_pro
-- Ejecutar antes de arrancar el backend por primera vez.
-- Compatible con MySQL 8+
-- ─────────────────────────────────────────────────────────────────────────────

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS sistema_etda_pro
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sistema_etda_pro;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    correo VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

CREATE TABLE periodos_academicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    activo BOOLEAN DEFAULT FALSE
);

CREATE TABLE alumnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    programa_educativo VARCHAR(150),
    semestre INT NOT NULL,
    grupo VARCHAR(10) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE docentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    numero_empleado VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    adscripcion VARCHAR(150),
    grado_academico VARCHAR(50),
    es_ptc BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE supervisores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT UNIQUE NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    cargo_area VARCHAR(150) NOT NULL, 
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE rubros_pedped (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT
);

CREATE TABLE expedientes_docentes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    docente_id INT NOT NULL,
    periodo_id INT NOT NULL,
    estatus_general ENUM('Abierto', 'Enviado a Revisión', 'Cerrado') DEFAULT 'Abierto',
    FOREIGN KEY (docente_id) REFERENCES docentes(id),
    FOREIGN KEY (periodo_id) REFERENCES periodos_academicos(id),
    UNIQUE(docente_id, periodo_id)
);

CREATE TABLE evidencias_pedped (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expediente_id INT NOT NULL,
    rubro_id INT NOT NULL,
    archivo_pdf_url VARCHAR(255) NOT NULL,
    estatus ENUM('Borrador', 'Enviado', 'En revisión', 'Observado', 'Corregido', 'Validado', 'Rechazado') DEFAULT 'Borrador',
    validador_id INT NULL,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (expediente_id) REFERENCES expedientes_docentes(id) ON DELETE CASCADE,
    FOREIGN KEY (rubro_id) REFERENCES rubros_pedped(id),
    FOREIGN KEY (validador_id) REFERENCES supervisores(id)
);

-- NUEVA TABLA: Historial de revisiones de evidencias PEDPED
CREATE TABLE revisiones_evidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evidencia_id INT NOT NULL,
    validador_id INT NOT NULL,
    estatus_asignado VARCHAR(50) NOT NULL,
    observaciones TEXT NOT NULL,
    fecha_revision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (evidencia_id) REFERENCES evidencias_pedped(id) ON DELETE CASCADE,
    FOREIGN KEY (validador_id) REFERENCES supervisores(id)
);

CREATE TABLE proyectos_integradores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    docente_director_id INT NOT NULL,
    periodo_id INT NOT NULL,
    nombre_proyecto VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    linea_trabajo VARCHAR(150),
    estatus_general ENUM('Propuesta', 'Aprobado', 'En Desarrollo', 'Finalizado', 'Cancelado') DEFAULT 'Propuesta',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (docente_director_id) REFERENCES docentes(id),
    FOREIGN KEY (periodo_id) REFERENCES periodos_academicos(id)
);

-- MODIFICADA: Sistema de doble calificación
CREATE TABLE proyecto_alumnos (
    proyecto_id INT NOT NULL,
    alumno_id INT NOT NULL,
    docente_curso_id INT NULL,
    rol_equipo VARCHAR(100),
    calificacion_parcial_curso DECIMAL(5,2) NULL,
    calificacion_general_proyecto DECIMAL(5,2) NULL,
    PRIMARY KEY (proyecto_id, alumno_id),
    FOREIGN KEY (proyecto_id) REFERENCES proyectos_integradores(id) ON DELETE CASCADE,
    FOREIGN KEY (alumno_id) REFERENCES alumnos(id) ON DELETE CASCADE,
    FOREIGN KEY (docente_curso_id) REFERENCES docentes(id) ON DELETE SET NULL
);

CREATE TABLE materiales_didacticos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    docente_id INT NOT NULL,
    proyecto_id INT NULL,
    tipo ENUM('Manual', 'Apuntes', 'Material Audiovisual', 'Antología', 'Rúbrica', 'Software') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    archivo_url VARCHAR(255) NOT NULL,
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (docente_id) REFERENCES docentes(id),
    FOREIGN KEY (proyecto_id) REFERENCES proyectos_integradores(id) ON DELETE SET NULL
);

CREATE TABLE entregables_proyecto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    etapa VARCHAR(100) NOT NULL,
    archivo_url VARCHAR(255) NOT NULL,
    estatus ENUM('Enviado', 'En revisión', 'Observado', 'Validado') DEFAULT 'Enviado',
    fecha_entrega TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos_integradores(id) ON DELETE CASCADE
);

-- NUEVA TABLA: Historial de revisiones de entregables de alumnos
CREATE TABLE revisiones_entregables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entregable_id INT NOT NULL,
    docente_revisor_id INT NOT NULL,
    estatus_asignado VARCHAR(50) NOT NULL,
    comentarios TEXT NOT NULL,
    fecha_revision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entregable_id) REFERENCES entregables_proyecto(id) ON DELETE CASCADE,
    FOREIGN KEY (docente_revisor_id) REFERENCES docentes(id)
);

CREATE TABLE vinculacion_uvd (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    programa_institucional VARCHAR(200) NOT NULL,
    beneficiario VARCHAR(200) NOT NULL,
    reporte_impacto_url VARCHAR(255),
    validador_id INT NULL,
    estatus ENUM('Registrado', 'En Revisión', 'Validado') DEFAULT 'Registrado',
    FOREIGN KEY (proyecto_id) REFERENCES proyectos_integradores(id) ON DELETE CASCADE,
    FOREIGN KEY (validador_id) REFERENCES supervisores(id)
);

-- NUEVA TABLA: Competencias y Olimpiadas
CREATE TABLE competencias_academicas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proyecto_id INT NOT NULL,
    nombre_evento VARCHAR(255) NOT NULL,
    nivel VARCHAR(100) NOT NULL,
    plan_preparacion TEXT,
    resultado_obtenido VARCHAR(255),
    evidencia_url VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proyecto_id) REFERENCES proyectos_integradores(id) ON DELETE CASCADE
);

CREATE TABLE cursos_certificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    tipo ENUM('Curso Alumno', 'Curso Docente', 'Certificación Oficial') NOT NULL,
    horas INT NOT NULL,
    responsable_id INT NULL,
    FOREIGN KEY (responsable_id) REFERENCES docentes(id) ON DELETE SET NULL
);

-- NUEVA TABLA: Requisitos de Cursos por Proyecto
CREATE TABLE proyecto_requisitos_cursos (
    proyecto_id INT NOT NULL,
    curso_id INT NOT NULL,
    PRIMARY KEY (proyecto_id, curso_id),
    FOREIGN KEY (proyecto_id) REFERENCES proyectos_integradores(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos_certificaciones(id) ON DELETE CASCADE
);

CREATE TABLE historial_capacitacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    estatus ENUM('Inscrito', 'Aprobado', 'Reprobado') DEFAULT 'Inscrito',
    archivo_evidencia_url VARCHAR(255) NULL,
    fecha_conclusion DATE NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES cursos_certificaciones(id)
);

CREATE TABLE constancias_emitidas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    tipo_documento VARCHAR(150) NOT NULL,
    folio_unico VARCHAR(100) UNIQUE NOT NULL,
    qr_verificacion VARCHAR(255) NOT NULL,
    pdf_generado_url VARCHAR(255) NOT NULL,
    emisor_supervisor_id INT NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (emisor_supervisor_id) REFERENCES supervisores(id)
);

CREATE TABLE bitacora_sistema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    accion VARCHAR(255) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_origen VARCHAR(45),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ── Datos de prueba iniciales ───────────────────────────────────────────────────────────

-- Roles básicos
INSERT INTO roles (nombre) VALUES ('Administrador'), ('Docente'), ('Alumno'), ('Supervisor');

-- Cursos de prueba
INSERT INTO cursos_certificaciones (nombre, tipo, horas) VALUES
('Diplomado en Competencias Docentes', 'Curso Docente', 120),
('Taller de Evaluación por Rúbricas', 'Curso Docente', 40),
('Taller de Moodle Avanzado', 'Curso Docente', 40),
('Curso de Ética Profesional', 'Curso Docente', 20);

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

-- Historial de capacitación para Juan
INSERT INTO historial_capacitacion (usuario_id, curso_id, estatus, fecha_conclusion)
VALUES
    (1, 1, 'Aprobado', '2025-06-30'),
    (1, 2, 'Aprobado', '2025-11-15'),
    (1, 3, 'Inscrito', NULL),
    (1, 4, 'Reprobado', '2024-12-20');

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
