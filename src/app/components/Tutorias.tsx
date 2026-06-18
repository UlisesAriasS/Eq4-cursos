import { useState, useRef } from 'react';
import {
  ChevronDown,
  Search,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  Eye,
  Download,
  MessageSquare,
  BookOpen,
  Users,
  BarChart2,
  CalendarDays,
  GraduationCap,
  ClipboardCheck,
  Plus,
  FileBadge,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────────── */

type TutoriaStatus = 'al_corriente' | 'seguimiento' | 'en_riesgo' | 'sin_contacto';
type TutoriaType   = 'Individual' | 'Grupal' | 'Entre Pares';

interface Student {
  id: string;
  name: string;
  matricula: string;
  program: string;
  semester: number;
  email: string;
  type: TutoriaType;
  status: TutoriaStatus;
  sessions: number;
  lastSession: string;
  reportUploaded: boolean;
  rubricsCount: number;
}

interface RubricEntry {
  date: string;
  type: string;
  score: string;
  notes: string;
}

/* ─────────────────────────── Config ────────────────────────────── */

const statusCfg: Record<TutoriaStatus, { label: string; pill: string; dot: string; icon: React.ReactNode; rowBorder: string }> = {
  al_corriente: { label: 'Al corriente',  pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: <CheckCircle2 className="w-3.5 h-3.5" />, rowBorder: '' },
  seguimiento:  { label: 'En seguimiento', pill: 'bg-blue-100 text-blue-700',      dot: 'bg-blue-500',    icon: <Clock className="w-3.5 h-3.5" />,         rowBorder: '' },
  en_riesgo:    { label: 'En riesgo',      pill: 'bg-red-100 text-red-700',         dot: 'bg-red-500',     icon: <AlertTriangle className="w-3.5 h-3.5" />,  rowBorder: 'border-l-2 border-l-red-400' },
  sin_contacto: { label: 'Sin contacto',   pill: 'bg-gray-100 text-gray-500',       dot: 'bg-gray-400',    icon: <MessageSquare className="w-3.5 h-3.5" />,  rowBorder: 'border-l-2 border-l-gray-300' },
};

const typeCfg: Record<TutoriaType, string> = {
  Individual:    'bg-violet-100 text-violet-700',
  Grupal:        'bg-sky-100 text-sky-700',
  'Entre Pares': 'bg-teal-100 text-teal-700',
};

const periods = ['2026-I', '2025-II', '2025-I', '2024-II', '2024-I'];
const types: (TutoriaType | 'Todos')[] = ['Todos', 'Individual', 'Grupal', 'Entre Pares'];
const programs = [
  'Todos los programas',
  'Ing. en Sistemas Computacionales',
  'Ing. en Redes y Telecomunicaciones',
  'Ing. en Tecnologías de la Información',
  'Lic. en Administración de TI',
];

const rubricsMock: Record<string, RubricEntry[]> = {
  s1: [
    { date: '10 may 2026', type: 'Diagnóstico Inicial',     score: '8.5/10', notes: 'Buen desempeño académico. Necesita reforzar hábitos de estudio.' },
    { date: '20 abr 2026', type: 'Seguimiento Mensual',      score: '7.0/10', notes: 'Preocupaciones por materia de Cálculo. Se acordó asesoría.' },
    { date: '15 mar 2026', type: 'Entrevista de Ingreso',    score: '9.0/10', notes: 'Estudiante motivado. Expectativas claras sobre la carrera.' },
  ],
  s2: [
    { date: '08 may 2026', type: 'Seguimiento Mensual',      score: '6.0/10', notes: 'Riesgo de reprobación en 2 materias. Plan de acción establecido.' },
    { date: '15 abr 2026', type: 'Alerta de Bajo Desempeño', score: '5.5/10', notes: 'Ausentismo detectado. Se notificó a coordinación.' },
  ],
  s3: [
    { date: '05 jun 2026', type: 'Diagnóstico Inicial',     score: '9.5/10', notes: 'Estudiante destacado. Se recomienda para programa de verano.' },
  ],
};

/* ─────────────────────────── Mock students ─────────────────────── */

const allStudents: Student[] = [
  { id: 's1',  name: 'Ana Sofía Martínez López',   matricula: '2024-10045', program: 'Ing. en Sistemas Computacionales',         semester: 4,  email: 'a.martinez@est.utn.mx',  type: 'Individual',    status: 'al_corriente', sessions: 5,  lastSession: '10 may 2026', reportUploaded: true,  rubricsCount: 3 },
  { id: 's2',  name: 'Carlos Eduardo Pérez Ruiz',   matricula: '2023-20178', program: 'Ing. en Redes y Telecomunicaciones',        semester: 6,  email: 'c.perez@est.utn.mx',     type: 'Individual',    status: 'en_riesgo',    sessions: 3,  lastSession: '08 may 2026', reportUploaded: false, rubricsCount: 2 },
  { id: 's3',  name: 'Valentina Torres Herrera',    matricula: '2024-10089', program: 'Ing. en Sistemas Computacionales',         semester: 2,  email: 'v.torres@est.utn.mx',    type: 'Individual',    status: 'al_corriente', sessions: 4,  lastSession: '05 jun 2026', reportUploaded: true,  rubricsCount: 1 },
  { id: 's4',  name: 'Diego Alejandro Ramírez',     matricula: '2022-30344', program: 'Lic. en Administración de TI',             semester: 8,  email: 'd.ramirez@est.utn.mx',   type: 'Grupal',        status: 'seguimiento',  sessions: 6,  lastSession: '28 abr 2026', reportUploaded: false, rubricsCount: 0 },
  { id: 's5',  name: 'Fernanda Guzmán Soto',        matricula: '2023-21456', program: 'Ing. en Tecnologías de la Información',    semester: 5,  email: 'f.guzman@est.utn.mx',    type: 'Grupal',        status: 'seguimiento',  sessions: 2,  lastSession: '22 abr 2026', reportUploaded: true,  rubricsCount: 0 },
  { id: 's6',  name: 'Rodrigo Mendoza Fuentes',     matricula: '2024-10203', program: 'Ing. en Redes y Telecomunicaciones',        semester: 3,  email: 'r.mendoza@est.utn.mx',   type: 'Individual',    status: 'sin_contacto', sessions: 1,  lastSession: '10 mar 2026', reportUploaded: false, rubricsCount: 0 },
  { id: 's7',  name: 'Isabela Vega Castillo',       matricula: '2023-20890', program: 'Ing. en Sistemas Computacionales',         semester: 5,  email: 'i.vega@est.utn.mx',      type: 'Entre Pares',   status: 'al_corriente', sessions: 7,  lastSession: '01 jun 2026', reportUploaded: true,  rubricsCount: 0 },
  { id: 's8',  name: 'Emilio Sánchez Morales',      matricula: '2022-31102', program: 'Lic. en Administración de TI',             semester: 7,  email: 'e.sanchez@est.utn.mx',   type: 'Grupal',        status: 'en_riesgo',    sessions: 2,  lastSession: '15 abr 2026', reportUploaded: false, rubricsCount: 0 },
];

/* ─────────────────── Dropdown component ────────────────────────── */

function Dropdown<T extends string>({
  label, value, options, onChange, renderOption,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
  renderOption?: (v: T) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors min-w-[180px]"
        style={{ fontSize: '13px' }}
      >
        <span className="text-gray-500 shrink-0" style={{ fontSize: '11px', fontWeight: 600 }}>{label}:</span>
        {renderOption ? renderOption(value) : <span className="text-gray-800 flex-1 text-left">{value}</span>}
        <ChevronDown className={`w-4 h-4 text-gray-400 ml-auto transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 min-w-full">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors ${value === opt ? 'text-[#1e3a5f] bg-[#1e3a5f]/5' : 'text-gray-700'}`}
              style={{ fontSize: '12px', fontWeight: value === opt ? 600 : 400 }}
            >
              {renderOption ? renderOption(opt) : opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Rubrics slide-over ────────────────────────── */

function RubricsPanel({ student, onClose }: { student: Student; onClose: () => void }) {
  const rubrics = rubricsMock[student.id] ?? [];
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-[#1e3a5f] px-6 py-5 shrink-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-blue-200" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rúbricas de evaluación</p>
            <button onClick={onClose} className="p-1.5 text-blue-200 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-white font-semibold" style={{ fontSize: '15px' }}>{student.name}</p>
          <p className="text-blue-300 mt-0.5" style={{ fontSize: '12px' }}>Matrícula: {student.matricula} · {student.program}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {rubrics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
              <ClipboardCheck className="w-10 h-10 text-gray-200" />
              <p className="text-gray-400" style={{ fontSize: '13px' }}>No hay rúbricas registradas aún.</p>
            </div>
          ) : (
            rubrics.map((r, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl border border-gray-200 p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-gray-900 font-semibold" style={{ fontSize: '13px' }}>{r.type}</p>
                    <p className="text-gray-400 flex items-center gap-1 mt-0.5" style={{ fontSize: '11px' }}>
                      <CalendarDays className="w-3 h-3" />{r.date}
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full shrink-0" style={{ fontSize: '12px', fontWeight: 700 }}>
                    {r.score}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed" style={{ fontSize: '12px' }}>{r.notes}</p>
                <button className="flex items-center gap-1.5 text-[#1e3a5f] hover:underline" style={{ fontSize: '11px', fontWeight: 500 }}>
                  <Download className="w-3 h-3" /> Descargar rúbrica
                </button>
              </div>
            ))
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 shrink-0">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors" style={{ fontSize: '13px', fontWeight: 500 }}>
            <Plus className="w-4 h-4" /> Agregar nueva rúbrica
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────── Upload report modal ───────────────────────── */

function UploadModal({ student, onClose, onUploaded }: { student: Student; onClose: () => void; onUploaded: (id: string) => void }) {
  const [file, setFile]     = useState<string | null>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [notes, setNotes]   = useState('');
  const ref                 = useRef<HTMLInputElement>(null);

  const pick = (f: File) => setFile(f.name);

  const submit = () => {
    if (!file) return;
    onUploaded(student.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-gray-900 font-semibold" style={{ fontSize: '14px' }}>Subir Reporte de Tutoría</p>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: '11px' }}>{student.name} · {student.matricula}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
            onDragLeave={() => setIsDrag(false)}
            onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) pick(f); }}
            onClick={() => !file && ref.current?.click()}
            className={`border-2 border-dashed rounded-xl py-8 px-4 text-center transition-all cursor-pointer ${
              isDrag ? 'border-[#1e3a5f] bg-blue-50' : file ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-emerald-800 truncate max-w-xs" style={{ fontSize: '13px', fontWeight: 500 }}>{file}</span>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="p-1 hover:bg-emerald-100 rounded transition-colors">
                  <X className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              </div>
            ) : (
              <>
                <Upload className={`w-8 h-8 mx-auto mb-2 ${isDrag ? 'text-[#1e3a5f]' : 'text-gray-300'}`} />
                <p className="text-gray-600 mb-0.5" style={{ fontSize: '13px', fontWeight: 500 }}>Arrastra el reporte aquí</p>
                <p className="text-gray-400" style={{ fontSize: '11px' }}>PDF · Máx. 10 MB</p>
              </>
            )}
          </div>
          <input ref={ref} type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); }} />

          {/* Notes */}
          <div>
            <label className="text-gray-600 mb-1.5 block" style={{ fontSize: '12px', fontWeight: 500 }}>
              Observaciones del reporte (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Describe brevemente el contenido o acuerdos de la sesión de tutoría…"
              className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              style={{ fontSize: '12px' }}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontSize: '13px', fontWeight: 500 }}>
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={!file}
              className="flex-1 py-2.5 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              <Upload className="w-4 h-4" /> Subir reporte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Main view ──────────────────────────────────── */

export function Tutorias() {
  const [period, setPeriod]       = useState('2026-I');
  const [typeFilter, setTypeFilter] = useState<TutoriaType | 'Todos'>('Todos');
  const [program, setProgram]     = useState('Todos los programas');
  const [statusFilter, setStatusFilter] = useState<TutoriaStatus | 'todos'>('todos');
  const [search, setSearch]       = useState('');
  const [students, setStudents]   = useState<Student[]>(allStudents);
  const [uploadTarget, setUploadTarget]   = useState<Student | null>(null);
  const [rubricsTarget, setRubricsTarget] = useState<Student | null>(null);

  const markUploaded = (id: string) => setStudents((prev) => prev.map((s) => s.id === id ? { ...s, reportUploaded: true } : s));

  const visible = students.filter((s) => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) ||
               s.matricula.includes(search) ||
               s.program.toLowerCase().includes(search.toLowerCase());
    const mt = typeFilter === 'Todos' || s.type === typeFilter;
    const mp = program === 'Todos los programas' || s.program === program;
    const mst = statusFilter === 'todos' || s.status === statusFilter;
    return ms && mt && mp && mst;
  });

  const counts = {
    total:        students.length,
    al_corriente: students.filter((s) => s.status === 'al_corriente').length,
    en_riesgo:    students.filter((s) => s.status === 'en_riesgo').length,
    sin_reporte:  students.filter((s) => !s.reportUploaded).length,
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Tutorías</h1>
            <p className="text-sm text-gray-500">Gestión de estudiantes asignados y reportes de sesiones tutoriales</p>
          </div>
        </div>

        {/* ── Summary stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Tutorados asignados', value: counts.total,        icon: <Users className="w-5 h-5 text-[#1e3a5f]" />,     bg: 'bg-blue-50',    clickStatus: 'todos'        as const },
            { label: 'Al corriente',        value: counts.al_corriente, icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', clickStatus: 'al_corriente' as const },
            { label: 'En riesgo',           value: counts.en_riesgo,    icon: <AlertTriangle className="w-5 h-5 text-red-500" />, bg: 'bg-red-50',     clickStatus: 'en_riesgo'    as const },
            { label: 'Reportes pendientes', value: counts.sin_reporte,  icon: <FileBadge className="w-5 h-5 text-amber-600" />,  bg: 'bg-amber-50',   clickStatus: 'todos'        as const },
          ].map((s) => (
            <button
              key={s.label}
              onClick={() => setStatusFilter(statusFilter === s.clickStatus && s.clickStatus !== 'todos' ? 'todos' : s.clickStatus)}
              className={`bg-white rounded-2xl border flex items-center gap-3 p-4 text-left transition-all hover:shadow-sm ${
                statusFilter === s.clickStatus && s.clickStatus !== 'todos' ? 'border-[#1e3a5f]/30 ring-1 ring-[#1e3a5f]/20' : 'border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>{s.icon}</div>
              <div>
                <p className="text-gray-500" style={{ fontSize: '11px' }}>{s.label}</p>
                <p className="text-gray-900" style={{ fontSize: '24px', fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
              </div>
            </button>
          ))}
        </div>

        {/* ── Filter bar ── */}
        <div className="bg-white border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-3 flex-wrap">
          {/* Period dropdown */}
          <Dropdown
            label="Periodo"
            value={period}
            options={periods}
            onChange={setPeriod}
          />

          {/* Type dropdown */}
          <Dropdown
            label="Tipo de tutoría"
            value={typeFilter}
            options={types}
            onChange={setTypeFilter}
            renderOption={(v) =>
              v === 'Todos' ? <span className="text-gray-800 flex-1 text-left">Todos</span> : (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${typeCfg[v as TutoriaType]}`} style={{ fontSize: '11px', fontWeight: 600 }}>{v}</span>
              )
            }
          />

          {/* Program dropdown */}
          <Dropdown
            label="Programa"
            value={program}
            options={programs}
            onChange={setProgram}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar alumno, matrícula…"
              className="pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              style={{ fontSize: '13px', width: '220px' }}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Table header */}
          <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between">
            <p className="text-gray-700 font-semibold" style={{ fontSize: '14px' }}>
              Tutorados asignados
              <span className="ml-2 text-gray-400 font-normal" style={{ fontSize: '12px' }}>
                {visible.length} de {students.length}
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              {(['al_corriente', 'seguimiento', 'en_riesgo', 'sin_contacto'] as TutoriaStatus[]).map((st) => {
                const cfg = statusCfg[st];
                const c = students.filter((s) => s.status === st).length;
                return (
                  <button key={st} onClick={() => setStatusFilter(statusFilter === st ? 'todos' : st)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                      statusFilter === st ? cfg.pill + ' border-current' : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300'
                    }`} style={{ fontSize: '10px', fontWeight: 600 }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusFilter === st ? cfg.dot : 'bg-gray-300'}`} />
                    {cfg.label} · {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Col headers */}
          <div className="grid px-6 py-3 border-b border-gray-100 bg-gray-50/60"
            style={{ gridTemplateColumns: '2fr 1.2fr 2fr 1fr 1fr auto' }}>
            {['Estudiante', 'Matrícula', 'Programa', 'Tipo', 'Estado', 'Acciones'].map((h) => (
              <p key={h} className="text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>{h}</p>
            ))}
          </div>

          {/* Rows */}
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Users className="w-10 h-10 text-gray-200" />
              <p className="text-gray-400" style={{ fontSize: '13px' }}>No se encontraron tutorados con esos filtros.</p>
            </div>
          ) : (
            <div>
              {visible.map((student, idx) => {
                const sc  = statusCfg[student.status];
                const tc  = typeCfg[student.type];
                const isLast = idx === visible.length - 1;
                return (
                  <div
                    key={student.id}
                    className={`grid items-center px-6 py-4 hover:bg-gray-50/80 transition-colors ${sc.rowBorder} ${!isLast ? 'border-b border-gray-50' : ''}`}
                    style={{ gridTemplateColumns: '2fr 1.2fr 2fr 1fr 1fr auto' }}
                  >
                    {/* Student name */}
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className="w-9 h-9 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-[#1e3a5f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate" style={{ fontSize: '13px', fontWeight: 500 }}>{student.name}</p>
                        <p className="text-gray-400 mt-0.5" style={{ fontSize: '10px' }}>
                          Sem. {student.semester} · {student.sessions} sesiones · Último: {student.lastSession}
                        </p>
                      </div>
                    </div>

                    {/* Matricula */}
                    <p className="font-mono text-gray-600 pr-3" style={{ fontSize: '12px' }}>{student.matricula}</p>

                    {/* Program */}
                    <div className="flex items-center gap-1.5 min-w-0 pr-3">
                      <BookOpen className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <p className="text-gray-600 truncate" style={{ fontSize: '12px' }}>{student.program}</p>
                    </div>

                    {/* Type */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full w-fit ${tc}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                      {student.type}
                    </span>

                    {/* Status */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${sc.pill}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                      {sc.icon}{sc.label}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 justify-end">
                      {/* Rubrics link */}
                      <button
                        onClick={() => setRubricsTarget(student)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[#1e3a5f] hover:bg-[#1e3a5f]/8 transition-colors"
                        title="Ver rúbricas"
                        style={{ fontSize: '11px', fontWeight: 500 }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {student.rubricsCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-[#1e3a5f]/15 flex items-center justify-center" style={{ fontSize: '9px', fontWeight: 700 }}>
                            {student.rubricsCount}
                          </span>
                        )}
                      </button>

                      {/* Upload report */}
                      <button
                        onClick={() => setUploadTarget(student)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                          student.reportUploaded
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-[#1e3a5f] text-white hover:bg-[#2d5280]'
                        }`}
                        style={{ fontSize: '11px', fontWeight: 500 }}
                      >
                        {student.reportUploaded
                          ? <><CheckCircle2 className="w-3.5 h-3.5" /> Reporte enviado</>
                          : <><Upload className="w-3.5 h-3.5" /> Subir Reporte</>
                        }
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer */}
          {visible.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-gray-400" style={{ fontSize: '11px' }}>
                Periodo <span className="font-semibold text-gray-600">{period}</span> · {visible.length} tutorados mostrados
              </p>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-3.5 h-3.5 text-gray-400" />
                <p className="text-gray-400" style={{ fontSize: '11px' }}>
                  {students.filter((s) => s.reportUploaded).length}/{students.length} reportes entregados
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {uploadTarget  && <UploadModal  student={uploadTarget}  onClose={() => setUploadTarget(null)}  onUploaded={markUploaded} />}
      {rubricsTarget && <RubricsPanel student={rubricsTarget} onClose={() => setRubricsTarget(null)} />}
    </div>
  );
}
