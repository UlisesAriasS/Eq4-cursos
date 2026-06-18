# Plan: Nuevas Vistas y Componentes del Dashboard Académico

## Context

El proyecto es un dashboard de gestión académica universitaria (React + Tailwind CSS v4, Vite). Ya existen vistas para `TeacherDashboard`, `StudentProject`, `DocumentValidation`, `Sidebar` y `Header`, con navegación state-based en `App.tsx`.

Se requieren tres nuevas funcionalidades:
1. Vista multi-proyecto del alumno (reemplaza `StudentProject` en la ruta `proyectos`)
2. Componente de stepper/timeline embebido en cada tarjeta de proyecto
3. Modal de previsualización de constancia/diploma institucional

**Design tokens a respetar:**
- Fondo app: `#f5f6f8`
- Primary blue: `#1e3a5f`, hover: `#2d5280`
- Cards: `bg-white rounded-xl border border-gray-200`
- Sin clases de font-size/font-weight/line-height de Tailwind a menos que el usuario lo pida

---

## Approach

### Nuevos archivos

#### 1. `src/app/components/ProjectStatusStepper.tsx`
Componente reutilizable de línea de tiempo horizontal con 4 pasos:
`Entregado → En revisión → Revisado → Aprobado / Rechazado`

Props:
```ts
interface Props {
  currentStep: number;       // 0-3 (índice del paso activo)
  finalStatus?: 'approved' | 'rejected' | null;
  dictamen?: string;         // texto del dictamen final
}
```

Visual:
- Pasos completados: círculo verde con `CheckCircle2`
- Paso activo: círculo `#1e3a5f` con `Clock` (o `CheckCircle2`/`XCircle` si es estado final)
- Pasos pendientes: círculo gris con número
- Líneas conectoras: verde para completadas, gris para pendientes
- Área final debajo del timeline (cuando `currentStep === 3`): cuadro de dictamen y observaciones con fondo verde-50 o rojo-50 según `finalStatus`

#### 2. `src/app/components/CertificatePreviewModal.tsx`
Modal full-screen overlay con diploma institucional.

Props:
```ts
interface Props {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  matricula: string;
  courseName: string;
  period: string;
}
```

Diseño del diploma:
- Overlay: `fixed inset-0 bg-black/60 z-50 flex items-center justify-center`
- Contenedor: tarjeta blanca centrada (`max-w-3xl w-full rounded-2xl shadow-2xl`)
- Header del modal: barra azul `#1e3a5f` con nombre de institución y escudo (ícono `GraduationCap`)
- Cuerpo: fondo blanco con bordes decorativos dobles, texto serif-style usando clases CSS directas
- Campos obligatorios: Nombre institución, nombre alumno, matrícula, nombre curso, periodo/fecha, horas acreditadas, tipo de participación, firma secretaría académica
- Footer del diploma: espacio para folio (texto) + QR code (generado con cuadrado SVG placeholder visual)
- Botones: `Descargar PDF` (primary, `bg-[#1e3a5f]`) y `Cerrar previsualización` (secondary, border)
- Botón cerrar (X) en esquina superior derecha del modal

#### 3. `src/app/components/StudentProjects.tsx`
Vista principal de "Mis Proyectos Integradores" — reemplaza `StudentProject` en la ruta `proyectos`.

Estructura:
- Header: "Mis Proyectos Integradores" + contador "2 proyectos activos"
- Grid de 2 columnas (`grid grid-cols-1 xl:grid-cols-2 gap-6`)
- Estado del modal de constancia manejado aquí con `useState`

**Tarjeta 1 — Proyecto Aprobado:**
- Badge: `Aprobado` (verde: `bg-green-100 text-green-700`)
- Border accent: `border-l-4 border-green-500`
- Título: "Sistema de Gestión Hospitalaria", Semestre: 2026-I, Grupo: Alpha
- Sección "Materiales Asignados": lista de 2-3 archivos con ícono `FileText`
- `ProjectStatusStepper` con `currentStep={3}` y `finalStatus="approved"` y dictamen positivo
- Sección "Observaciones del Docente": cuadro `bg-green-50 border-green-200` con comentarios positivos
- Botón "Ver Constancia" (`bg-[#1e3a5f]` → abre `CertificatePreviewModal`)

**Tarjeta 2 — Proyecto Rechazado:**
- Badge: `Rechazado` (rojo: `bg-red-100 text-red-700`)
- Border accent: `border-l-4 border-red-500`
- Título: "Plataforma E-Commerce Educativo", Semestre: 2026-I, Grupo: Beta
- Sección "Materiales Asignados": misma estructura
- `ProjectStatusStepper` con `currentStep={3}` y `finalStatus="rejected"` y dictamen con correcciones
- Sección "Observaciones": cuadro `bg-red-50 border-red-200` detallando qué secciones del manual deben corregirse
- Botón "Volver a Entregar" (outline style, `border-red-300 text-red-600`)

### Modificación de archivos existentes

#### `src/app/App.tsx`
- Cambiar import `StudentProject` → `StudentProjects`
- Cambiar el case `'proyectos'` para renderizar `<StudentProjects />`

---

## Datos Mock

**Proyecto 1 (Aprobado):**
- Materiales: "Manual_Tecnico_v3.pdf", "Presentacion_Final.pptx", "Codigo_Fuente.zip"
- Dictamen: "El proyecto cumple con todos los requerimientos establecidos..."
- Observación docente: "Excelente trabajo en equipo. La documentación técnica supera las expectativas..."

**Proyecto 2 (Rechazado):**
- Materiales: "Manual_Usuario_v1.pdf", "Propuesta_Tecnica.docx"
- Dictamen: "El proyecto presenta deficiencias en el capítulo 3 y 5..."
- Observación: "Sección 3 (Arquitectura del sistema) requiere diagrama de componentes. Sección 5 (Pruebas) debe incluir casos de prueba unitarios..."

**Constancia (modal):**
- Institución: "Universidad Tecnológica Nacional"
- Alumno: "María García López"
- Matrícula: "2023-10045"
- Curso: "Sistema de Gestión Hospitalaria"
- Periodo: "Enero – Junio 2026"
- Horas: 120
- Tipo: "Proyecto Integrador"
- Secretaría: "Dr. Roberto Sánchez Flores"
- Folio: "UTN-2026-PI-00847"

---

## File Paths to Modify

| Acción | Archivo |
|--------|---------|
| Crear | `src/app/components/ProjectStatusStepper.tsx` |
| Crear | `src/app/components/CertificatePreviewModal.tsx` |
| Crear | `src/app/components/StudentProjects.tsx` |
| Modificar | `src/app/App.tsx` (cambiar import y route `proyectos`) |

`StudentProject.tsx` original se conserva sin cambios.

---

## Verification

1. Navegar al sidebar → "Proyectos Integradores" → debe mostrar 2 tarjetas en grid
2. Verificar que el stepper de la tarjeta verde muestra los 4 pasos con el último en verde "Aprobado"
3. Verificar que el stepper de la tarjeta roja muestra el último paso en rojo "Rechazado"
4. Click en "Ver Constancia" → debe abrir el modal de diploma
5. Verificar que el diploma muestra todos los campos requeridos (nombre, matrícula, curso, periodo, horas, firma, folio, QR)
6. Click en "Cerrar previsualización" o X → cierra el modal
7. Verificar responsividad: en pantallas pequeñas, el grid colapsa a 1 columna
