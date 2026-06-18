import { useState, useRef } from 'react';
import {
  Plus,
  Save,
  Briefcase,
  GraduationCap,
  Users,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  Search,
  X,
  BookOpen,
  User,
  Hash,
  BarChart2,
  Info,
  Check,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────────── */

interface Student {
  id: string;
  name: string;
  matricula: string;
  degree: string;
  group: string;
  partialGrade: string;
  generalGrade: string;
  saved: boolean;
}

interface ProjectInfo {
  name: string;
  period: string;
  area: string;
  director: string;
  maxStudents: number;
  deadline: string;
}

/* ─────────────────────────── Constants ─────────────────────────── */

const degrees = [
  'Ing. en Sistemas Computacionales',
  'Ing. en Redes y Telecomunicaciones',
  'Ing. en Tecnologías de la Información',
  'Lic. en Administración de TI',
];

const groups = ['Grupo A', 'Grupo B', 'Grupo C', 'Grupo D'];

const project: ProjectInfo = {
  name: 'Sistema de Gestión Hospitalaria con Módulo de IA',
  period: '2026-I · Ene – Jun 2026',
  area: 'Ingeniería de Software y Sistemas Inteligentes',
  director: 'Dr. Carlos Ruiz Mendoza',
  maxStudents: 12,
  deadline: '20 jun 2026',
};

const initialStudents: Student[] = [
  { id: 's1', name: 'Ana Sofía Martínez López',   matricula: '2024-10045', degree: 'Ing. en Sistemas Computacionales',      group: 'Grupo A', partialGrade: '9.2', generalGrade: '9.0', saved: true  },
  { id: 's2', name: 'Carlos Eduardo Pérez Ruiz',  matricula: '2023-20178', degree: 'Ing. en Redes y Telecomunicaciones',     group: 'Grupo A', partialGrade: '7.5', generalGrade: '7.8', saved: true  },
  { id: 's3', name: 'Valentina Torres Herrera',   matricula: '2024-10089', degree: 'Ing. en Sistemas Computacionales',      group: 'Grupo B', partialGrade: '9.8', generalGrade: '',    saved: false },
  { id: 's4', name: 'Diego Alejandro Ramírez',    matricula: '2022-30344', degree: 'Lic. en Administración de TI',          group: 'Grupo B', partialGrade: '8.0', generalGrade: '8.5', saved: true  },
  { id: 's5', name: 'Fernanda Guzmán Soto',       matricula: '2023-21456', degree: 'Ing. en Tecnologías de la Información', group: 'Grupo C', partialGrade: '',    generalGrade: '',    saved: false },
  { id: 's6', name: 'Rodrigo Mendoza Fuentes',    matricula: '2024-10203', degree: 'Ing. en Redes y Telecomunicaciones',     group: 'Grupo C', partialGrade: '6.5', generalGrade: '7.0', saved: true  },
  { id: 's7', name: 'Isabela Vega Castillo',      matricula: '2023-20890', degree: 'Ing. en Sistemas Computacionales',      group: 'Grupo A', partialGrade: '10',  generalGrade: '9.5', saved: true  },
  { id: 's8', name: 'Emilio Sánchez Morales',     matricula: '2022-31102', degree: 'Lic. en Administración de TI',          group: 'Grupo D', partialGrade: '',    generalGrade: '',    saved: false },
];

/* ─────────────────── Grade badge helper ────────────────────────── */

function gradeBadge(val: string) {
  const n = parseFloat(val);
  if (!val || isNaN(n)) return null;
  if (n >= 9)   return 'bg-emerald-100 text-emerald-700';
  if (n >= 7)   return 'bg-blue-100 text-blue-700';
  if (n >= 6)   return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

function isValidGrade(v: string) {
  if (v === '') return true;
  const n = parseFloat(v);
  return !isNaN(n) && n >= 0 && n <= 10;
}

/* ─────────────────── Grade input cell ──────────────────────────── */

function GradeInput({
  value,
  onChange,
  placeholder,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  const valid = isValidGrade(value);
  const badge = gradeBadge(value);

  return (
    <div className="relative flex items-center">
      <input
        type="number"
        min={0}
        max={10}
        step={0.1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-24 px-3 py-2 rounded-xl border text-center transition-all focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${
          !valid
            ? 'border-red-300 bg-red-50 text-red-700 focus:ring-red-200'
            : value
            ? `border-transparent focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] ${badge}`
            : 'border-gray-200 bg-white text-gray-800 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]'
        }`}
        style={{ fontSize: '13px', fontWeight: value ? 600 : 400, MozAppearance: 'textfield' } as React.CSSProperties}
      />
      {!valid && (
        <AlertTriangle className="absolute right-2 w-3.5 h-3.5 text-red-500 pointer-events-none" />
      )}
    </div>
  );
}

/* ─────────────────── Register student modal ────────────────────── */

function RegisterModal({ onClose, onAdd }: { onClose: () => void; onAdd: (s: Student) => void }) {
  const [name, setName]           = useState('');
  const [matricula, setMatricula] = useState('');
  const [degree, setDegree]       = useState(degrees[0]);
  const [group, setGroup]         = useState(groups[0]);
  const [degOpen, setDegOpen]     = useState(false);
  const [grpOpen, setGrpOpen]     = useState(false);

  const valid = name.trim() && matricula.trim();

  const submit = () => {
    if (!valid) return;
    onAdd({ id: Date.now().toString(), name: name.trim(), matricula: matricula.trim(), degree, group, partialGrade: '', generalGrade: '', saved: false });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-gray-900 font-semibold" style={{ fontSize: '15px' }}>Registrar Alumno</p>
            <p className="text-gray-400 mt-0.5" style={{ fontSize: '11px' }}>Agrega un estudiante al proyecto integrador</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-gray-600 mb-1.5 block" style={{ fontSize: '12px', fontWeight: 500 }}>Nombre completo *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ej. María García López"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                style={{ fontSize: '13px' }} />
            </div>
          </div>

          {/* Matricula */}
          <div>
            <label className="text-gray-600 mb-1.5 block" style={{ fontSize: '12px', fontWeight: 500 }}>Matrícula *</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={matricula} onChange={(e) => setMatricula(e.target.value)}
                placeholder="Ej. 2024-10045"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] font-mono"
                style={{ fontSize: '13px' }} />
            </div>
          </div>

          {/* Degree dropdown */}
          <div>
            <label className="text-gray-600 mb-1.5 block" style={{ fontSize: '12px', fontWeight: 500 }}>Carrera</label>
            <div className="relative">
              <button onClick={() => setDegOpen(!degOpen)}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-left"
                style={{ fontSize: '13px' }}>
                <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="flex-1 text-gray-800">{degree}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${degOpen ? 'rotate-180' : ''}`} />
              </button>
              {degOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                  {degrees.map((d) => (
                    <button key={d} onClick={() => { setDegree(d); setDegOpen(false); }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${degree === d ? 'text-[#1e3a5f] bg-[#1e3a5f]/5' : 'text-gray-700'}`}
                      style={{ fontSize: '12px', fontWeight: degree === d ? 600 : 400 }}>{d}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Group dropdown */}
          <div>
            <label className="text-gray-600 mb-1.5 block" style={{ fontSize: '12px', fontWeight: 500 }}>Grupo</label>
            <div className="relative">
              <button onClick={() => setGrpOpen(!grpOpen)}
                className="w-full flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors text-left"
                style={{ fontSize: '13px' }}>
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="flex-1 text-gray-800">{group}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${grpOpen ? 'rotate-180' : ''}`} />
              </button>
              {grpOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1">
                  {groups.map((g) => (
                    <button key={g} onClick={() => { setGroup(g); setGrpOpen(false); }}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors ${group === g ? 'text-[#1e3a5f] bg-[#1e3a5f]/5' : 'text-gray-700'}`}
                      style={{ fontSize: '12px', fontWeight: group === g ? 600 : 400 }}>{g}</button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ fontSize: '13px', fontWeight: 500 }}>Cancelar</button>
            <button onClick={submit} disabled={!valid}
              className="flex-1 py-2.5 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontSize: '13px', fontWeight: 500 }}>
              <Plus className="w-4 h-4" /> Registrar alumno
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main view ─────────────────────────── */

export function ProyectoIntegrador() {
  const [students, setStudents]     = useState<Student[]>(initialStudents);
  const [search, setSearch]         = useState('');
  const [groupFilter, setGroupFilter] = useState<string>('Todos');
  const [showModal, setShowModal]   = useState(false);
  const [saveFlash, setSaveFlash]   = useState(false);
  const [grpOpen, setGrpOpen]       = useState(false);

  const updateGrade = (id: string, field: 'partialGrade' | 'generalGrade', value: string) => {
    setStudents((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value, saved: false } : s));
  };

  const saveAll = () => {
    const allValid = students.every((s) =>
      (s.partialGrade === '' || isValidGrade(s.partialGrade)) &&
      (s.generalGrade === '' || isValidGrade(s.generalGrade))
    );
    if (!allValid) return;
    setStudents((prev) => prev.map((s) => ({ ...s, saved: true })));
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2500);
  };

  const addStudent = (s: Student) => setStudents((prev) => [...prev, s]);
  const removeStudent = (id: string) => setStudents((prev) => prev.filter((s) => s.id !== id));

  const visible = students.filter((s) => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) ||
               s.matricula.includes(search);
    const mg = groupFilter === 'Todos' || s.group === groupFilter;
    return ms && mg;
  });

  const pendingCount  = students.filter((s) => !s.saved).length;
  const gradedCount   = students.filter((s) => s.partialGrade && s.generalGrade).length;
  const allValidCheck = students.every((s) =>
    (s.partialGrade === '' || isValidGrade(s.partialGrade)) &&
    (s.generalGrade === '' || isValidGrade(s.generalGrade))
  );

  const groupCounts = groups.reduce((acc, g) => {
    acc[g] = students.filter((s) => s.group === g).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1300px] mx-auto space-y-5 pb-6">

        {/* ── Project info card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="h-1.5 bg-[#1e3a5f]" />
          <div className="px-6 py-5 flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1e3a5f] flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 font-semibold leading-snug" style={{ fontSize: '17px' }}>
                  {project.name}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '12px' }}>
                    <CalendarDays className="w-3.5 h-3.5" />{project.period}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '12px' }}>
                    <BookOpen className="w-3.5 h-3.5" />{project.area}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '12px' }}>
                    <GraduationCap className="w-3.5 h-3.5" />Director: {project.director}
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '12px' }}>
                    <CalendarDays className="w-3.5 h-3.5" />Fecha límite: {project.deadline}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors shrink-0"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              <Plus className="w-4 h-4" /> Registrar Alumno
            </button>
          </div>

          {/* Stats strip */}
          <div className="border-t border-gray-100 grid grid-cols-4 divide-x divide-gray-100">
            {[
              { label: 'Alumnos inscritos', value: students.length, sub: `de ${project.maxStudents} máx`, icon: <Users className="w-4 h-4 text-[#1e3a5f]" /> },
              { label: 'Calificaciones capturadas', value: `${gradedCount}/${students.length}`, sub: 'ambas notas ingresadas', icon: <BarChart2 className="w-4 h-4 text-emerald-600" /> },
              { label: 'Cambios sin guardar', value: pendingCount, sub: pendingCount > 0 ? 'pendientes de guardar' : 'todo actualizado', icon: pendingCount > 0 ? <Clock className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" /> },
              { label: 'Grupos activos', value: groups.length, sub: groups.join(' · '), icon: <GraduationCap className="w-4 h-4 text-[#1e3a5f]" /> },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">{s.icon}</div>
                <div>
                  <p className="text-gray-500" style={{ fontSize: '10px' }}>{s.label}</p>
                  <p className="text-gray-900 font-semibold" style={{ fontSize: '16px', lineHeight: 1.1 }}>{s.value}</p>
                  <p className="text-gray-400" style={{ fontSize: '10px' }}>{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Toolbar: search + group filter ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o matrícula…"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              style={{ fontSize: '13px' }} />
          </div>

          {/* Group filter tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
            {(['Todos', ...groups] as string[]).map((g) => (
              <button key={g} onClick={() => setGroupFilter(g)}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  groupFilter === g ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'
                }`} style={{ fontSize: '12px', fontWeight: groupFilter === g ? 600 : 400 }}>
                {g}
                {g !== 'Todos' && (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${groupFilter === g ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`} style={{ fontSize: '9px', fontWeight: 700 }}>
                    {groupCounts[g] ?? 0}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Grade legend */}
          <div className="flex items-center gap-2 ml-auto">
            {[
              { range: '9–10', cls: 'bg-emerald-100 text-emerald-700' },
              { range: '7–8.9', cls: 'bg-blue-100 text-blue-700' },
              { range: '6–6.9', cls: 'bg-amber-100 text-amber-700' },
              { range: '< 6', cls: 'bg-red-100 text-red-700' },
            ].map((l) => (
              <span key={l.range} className={`px-2 py-0.5 rounded-full ${l.cls}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                {l.range}
              </span>
            ))}
          </div>
        </div>

        {/* ── Grading table ── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

          {/* Column headers */}
          <div className="border-b border-gray-100">
            {/* Top sub-header for grade columns */}
            <div className="flex items-center px-6 pt-3.5 pb-0 gap-4">
              <div className="flex-1" />{/* spacer for left cols */}
              <div className="w-[440px] shrink-0 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#1e3a5f]" />
                  <p className="text-[#1e3a5f]" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Calificación Parcial
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <p className="text-violet-700" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Calificación General
                  </p>
                </div>
              </div>
              <div className="w-10 shrink-0" />
            </div>

            <div className="grid items-center px-6 py-3 gap-4 bg-gray-50/60"
              style={{ gridTemplateColumns: '2fr 1fr 2fr 0.8fr 220px 220px auto' }}>
              {['Alumno', 'Matrícula', 'Carrera', 'Grupo', 'Docente de Curso', 'Director', ''].map((h) => (
                <p key={h} className="text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>{h}</p>
              ))}
            </div>
          </div>

          {/* Rows */}
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Users className="w-10 h-10 text-gray-200" />
              <p className="text-gray-400" style={{ fontSize: '13px' }}>No se encontraron alumnos.</p>
            </div>
          ) : (
            <div>
              {visible.map((student, idx) => {
                const isLast    = idx === visible.length - 1;
                const hasChange = !student.saved;
                const partialOk = isValidGrade(student.partialGrade);
                const generalOk = isValidGrade(student.generalGrade);
                const hasError  = !partialOk || !generalOk;

                return (
                  <div
                    key={student.id}
                    className={`grid items-center px-6 py-3.5 gap-4 transition-colors group ${
                      hasError  ? 'bg-red-50/40' :
                      hasChange ? 'bg-amber-50/40' :
                      'hover:bg-gray-50/60'
                    } ${!isLast ? 'border-b border-gray-50' : ''}`}
                    style={{ gridTemplateColumns: '2fr 1fr 2fr 0.8fr 220px 220px auto' }}
                  >
                    {/* Student */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-[#1e3a5f]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate" style={{ fontSize: '13px', fontWeight: 500 }}>{student.name}</p>
                        {hasChange && !hasError && (
                          <p className="text-amber-600 flex items-center gap-1" style={{ fontSize: '10px' }}>
                            <Clock className="w-2.5 h-2.5" /> Sin guardar
                          </p>
                        )}
                        {hasError && (
                          <p className="text-red-600 flex items-center gap-1" style={{ fontSize: '10px' }}>
                            <AlertTriangle className="w-2.5 h-2.5" /> Calificación inválida
                          </p>
                        )}
                        {student.saved && !hasChange && (
                          <p className="text-emerald-600 flex items-center gap-1" style={{ fontSize: '10px' }}>
                            <CheckCircle2 className="w-2.5 h-2.5" /> Guardado
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Matricula */}
                    <p className="font-mono text-gray-500" style={{ fontSize: '11px' }}>{student.matricula}</p>

                    {/* Degree */}
                    <p className="text-gray-600 truncate pr-2" style={{ fontSize: '11px' }}>{student.degree}</p>

                    {/* Group */}
                    <span className="inline-flex items-center justify-center w-fit px-2.5 py-1 bg-[#1e3a5f]/8 text-[#1e3a5f] rounded-lg" style={{ fontSize: '11px', fontWeight: 600 }}>
                      {student.group}
                    </span>

                    {/* Partial grade (Docente) */}
                    <div className="flex items-center gap-2">
                      <GradeInput
                        value={student.partialGrade}
                        onChange={(v) => updateGrade(student.id, 'partialGrade', v)}
                        placeholder="0 – 10"
                      />
                      {student.partialGrade && isValidGrade(student.partialGrade) && (
                        <div className="flex items-center gap-1 text-gray-500" style={{ fontSize: '11px' }}>
                          <Info className="w-3 h-3" />
                          {parseFloat(student.partialGrade) >= 6 ? 'Aprobado' : 'No aprobado'}
                        </div>
                      )}
                    </div>

                    {/* General grade (Director) */}
                    <div className="flex items-center gap-2">
                      <GradeInput
                        value={student.generalGrade}
                        onChange={(v) => updateGrade(student.id, 'generalGrade', v)}
                        placeholder="0 – 10"
                      />
                      {student.partialGrade && student.generalGrade &&
                       isValidGrade(student.partialGrade) && isValidGrade(student.generalGrade) && (
                        <div className="flex items-center gap-1 text-gray-500" style={{ fontSize: '11px' }}>
                          <BarChart2 className="w-3 h-3" />
                          {((parseFloat(student.partialGrade) + parseFloat(student.generalGrade)) / 2).toFixed(1)}
                        </div>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeStudent(student.id)}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Table footer: save button ── */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {pendingCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>
                  <Clock className="w-3.5 h-3.5" />
                  {pendingCount} registro{pendingCount > 1 ? 's' : ''} sin guardar
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Todas las calificaciones guardadas
                </span>
              )}
              {!allValidCheck && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Corrige las calificaciones inválidas
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <p className="text-gray-400" style={{ fontSize: '11px' }}>
                {gradedCount}/{students.length} alumnos con ambas calificaciones
              </p>
              <button
                onClick={saveAll}
                disabled={!allValidCheck || pendingCount === 0}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                  saveFlash
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#1e3a5f] text-white hover:bg-[#2d5280] shadow-sm hover:shadow-md'
                }`}
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                {saveFlash
                  ? <><Check className="w-4 h-4" /> ¡Calificaciones guardadas!</>
                  : <><Save className="w-4 h-4" /> Guardar Calificaciones</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && <RegisterModal onClose={() => setShowModal(false)} onAdd={addStudent} />}
    </div>
  );
}
