import { useState, useRef } from 'react';
import { EvidenciaModal } from './EvidenciaModal';
import {
  BookOpenCheck,
  GraduationCap,
  FlaskConical,
  ClipboardList,
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Plus,
  Search,
  Filter,
  Users,
  CalendarDays,
  FileUp,
  X,
} from 'lucide-react';

/* ─────────────────── Types ──────────────────────────────────────── */

type EvidenceStatus = 'validado' | 'en_revision' | 'rechazado';
type TabId = 'ensenanza' | 'cursos' | 'investigacion' | 'gestion';

interface Evidence {
  id: string;
  name: string;
  type: string;
  author: string;
  date: string;
  size: string;
  status: EvidenceStatus;
  description: string;
}

interface TabData {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
  uploadLabel: string;
  evidences: Evidence[];
}

/* ─────────────────── Config ─────────────────────────────────────── */

const statusCfg: Record<EvidenceStatus, { label: string; icon: React.ReactNode; pill: string; row: string }> = {
  validado:    { label: 'Validado',    icon: <CheckCircle2 className="w-3 h-3" />, pill: 'bg-emerald-100 text-emerald-700', row: '' },
  en_revision: { label: 'En revisión', icon: <Clock className="w-3 h-3" />,        pill: 'bg-amber-100 text-amber-700',    row: '' },
  rechazado:   { label: 'Rechazado',   icon: <XCircle className="w-3 h-3" />,      pill: 'bg-red-100 text-red-700',        row: '' },
};

const typeColor: Record<string, string> = {
  'Artículo':         'bg-violet-100 text-violet-700',
  'Material Didáctico':'bg-sky-100 text-sky-700',
  'Planeación':       'bg-blue-100 text-blue-700',
  'Reporte':          'bg-teal-100 text-teal-700',
  'Ponencia':         'bg-indigo-100 text-indigo-700',
  'Protocolo':        'bg-purple-100 text-purple-700',
  'Guía':             'bg-cyan-100 text-cyan-700',
  'Acta':             'bg-gray-100 text-gray-600',
  'Minuta':           'bg-slate-100 text-slate-700',
  'Plan':             'bg-orange-100 text-orange-700',
};

/* ─────────────────── Mock data ──────────────────────────────────── */

const tabsData: TabData[] = [
  {
    id: 'ensenanza',
    label: 'Enseñanza-Aprendizaje',
    shortLabel: 'Enseñanza',
    icon: <BookOpenCheck className="w-4 h-4" />,
    description: 'Materiales didácticos, planeaciones de clase y estrategias pedagógicas del colegiado.',
    uploadLabel: 'material didáctico',
    evidences: [
      { id: 'e1', name: 'Planeación Didáctica – Redes II U1',     type: 'Planeación',        author: 'Dr. Carlos Ruiz',    date: '05 jun 2026', size: '1.4 MB', status: 'validado',    description: 'Planeación de la Unidad 1 del curso Redes de Computadoras II.' },
      { id: 'e2', name: 'Guía de Laboratorio – Configuración BGP', type: 'Guía',              author: 'Dra. Ana Morales',   date: '04 jun 2026', size: '2.1 MB', status: 'en_revision', description: 'Práctica de laboratorio para configuración de protocolo BGP.' },
      { id: 'e3', name: 'Instrumento de Evaluación Parcial',       type: 'Material Didáctico', author: 'Dr. Carlos Ruiz',   date: '02 jun 2026', size: '0.6 MB', status: 'validado',    description: 'Rúbrica y criterios de evaluación del primer parcial.' },
      { id: 'e4', name: 'Estrategia ABP – Proyecto de Semestre',   type: 'Planeación',        author: 'Prof. Luis Hdz.',    date: '30 may 2026', size: '1.8 MB', status: 'validado',    description: 'Estrategia de Aprendizaje Basado en Proyectos para el semestre.' },
      { id: 'e5', name: 'Material de Apoyo – Ciberseguridad',      type: 'Material Didáctico', author: 'Dr. Carlos Ruiz',   date: '28 may 2026', size: '5.2 MB', status: 'rechazado',   description: 'Presentaciones y notas del módulo de seguridad informática.' },
    ],
  },
  {
    id: 'cursos',
    label: 'Cursos',
    shortLabel: 'Cursos',
    icon: <GraduationCap className="w-4 h-4" />,
    description: 'Programas de estudio, silabi y contenidos temáticos actualizados por el colegiado.',
    uploadLabel: 'programa de estudio',
    evidences: [
      { id: 'c1', name: 'Programa Analítico – Redes de Computadoras II',  type: 'Planeación',  author: 'Colegiado Redes',       date: '01 jun 2026', size: '0.9 MB', status: 'validado',    description: 'Programa analítico actualizado para el semestre 2026-I.' },
      { id: 'c2', name: 'Silabo – Seguridad en Redes',                    type: 'Planeación',  author: 'Dr. Carlos Ruiz',        date: '31 may 2026', size: '0.7 MB', status: 'en_revision', description: 'Silabo y cronograma de actividades del curso.' },
      { id: 'c3', name: 'Banco de Reactivos – Evaluación Formativa',      type: 'Material Didáctico', author: 'Dra. Ana Morales', date: '29 may 2026', size: '3.4 MB', status: 'validado', description: 'Banco de 120 reactivos de opción múltiple para evaluaciones.' },
      { id: 'c4', name: 'Guía de Prácticas – FastAPI y REST',             type: 'Guía',        author: 'Prof. Luis Hdz.',        date: '25 may 2026', size: '4.1 MB', status: 'validado',    description: 'Manual de prácticas para el módulo de desarrollo de APIs.' },
    ],
  },
  {
    id: 'investigacion',
    label: 'Investigación',
    shortLabel: 'Investigación',
    icon: <FlaskConical className="w-4 h-4" />,
    description: 'Artículos académicos, protocolos de investigación y ponencias del colegiado.',
    uploadLabel: 'artículo o protocolo',
    evidences: [
      { id: 'i1', name: 'Artículo: Machine Learning en Redes SDN',        type: 'Artículo',   author: 'Dr. Carlos Ruiz',    date: '03 jun 2026', size: '2.8 MB', status: 'validado',    description: 'Artículo publicado en IEEE Transactions on Network Systems.' },
      { id: 'i2', name: 'Protocolo de Investigación – Ciberseguridad IoT', type: 'Protocolo', author: 'Dra. Ana Morales',   date: '28 may 2026', size: '1.6 MB', status: 'en_revision', description: 'Protocolo para la línea de investigación en seguridad de dispositivos IoT.' },
      { id: 'i3', name: 'Ponencia: Redes Neuronales para IDS',            type: 'Ponencia',   author: 'Prof. Luis Hdz.',    date: '20 may 2026', size: '3.5 MB', status: 'validado',    description: 'Presentación aceptada en el Congreso Nacional de Cómputo 2026.' },
      { id: 'i4', name: 'Reporte Técnico – Análisis de Vulnerabilidades', type: 'Reporte',    author: 'Dr. Carlos Ruiz',    date: '15 may 2026', size: '4.2 MB', status: 'en_revision', description: 'Reporte del análisis de vulnerabilidades en infraestructura universitaria.' },
      { id: 'i5', name: 'Artículo: Blockchain en Sistemas Académicos',    type: 'Artículo',   author: 'Colegiado TIC',       date: '10 may 2026', size: '2.1 MB', status: 'rechazado',   description: 'Artículo enviado a revisión en revista indexada Scopus.' },
    ],
  },
  {
    id: 'gestion',
    label: 'Gestión Académica',
    shortLabel: 'Gestión',
    icon: <ClipboardList className="w-4 h-4" />,
    description: 'Actas de reunión, minutas, planes de mejora y documentos administrativos del colegiado.',
    uploadLabel: 'acta o minuta',
    evidences: [
      { id: 'g1', name: 'Acta de Reunión Colegiada – Mayo 2026',          type: 'Acta',    author: 'Secretario Técnico', date: '05 jun 2026', size: '0.5 MB', status: 'validado',    description: 'Acta de la sesión ordinaria del colegiado correspondiente a mayo 2026.' },
      { id: 'g2', name: 'Plan de Mejora Continua 2026-I',                 type: 'Plan',    author: 'Dr. Carlos Ruiz',    date: '01 jun 2026', size: '1.2 MB', status: 'validado',    description: 'Acciones de mejora derivadas de la autoevaluación del colegiado.' },
      { id: 'g3', name: 'Minuta – Revisión de Programas de Estudio',      type: 'Minuta',  author: 'Dra. Ana Morales',   date: '25 may 2026', size: '0.4 MB', status: 'en_revision', description: 'Minuta de la revisión y actualización de los programas analíticos.' },
      { id: 'g4', name: 'Reporte de Indicadores de Desempeño',            type: 'Reporte', author: 'Secretario Técnico', date: '20 may 2026', size: '2.3 MB', status: 'validado',    description: 'Indicadores de eficiencia terminal, reprobación y cobertura.' },
    ],
  },
];

/* ─────────────────── Upload row component ───────────────────────── */

function UploadRow({ tabLabel, onAdd }: { tabLabel: string; onAdd: (e: Evidence) => void }) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [name, setName]         = useState('');
  const [isDrag, setIsDrag]     = useState(false);
  const ref                     = useRef<HTMLInputElement>(null);

  const pick = (f: File) => { setFileName(f.name); if (!name) setName(f.name.replace(/\.[^.]+$/, '')); };

  const submit = () => {
    if (!fileName || !name) return;
    onAdd({ id: Date.now().toString(), name, type: 'Material Didáctico', author: 'Dr. Carlos Ruiz',
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      size: '—', status: 'en_revision', description: '' });
    setFileName(null); setName('');
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed transition-all ${isDrag ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
      onDragLeave={() => setIsDrag(false)}
      onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) pick(f); }}
    >
      <input ref={ref} type="file" accept=".pdf,.docx,.pptx" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); e.target.value = ''; }} />

      {/* Drop / file indicator */}
      <button onClick={() => ref.current?.click()}
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${fileName ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-gray-200 text-gray-400 hover:border-[#1e3a5f] hover:text-[#1e3a5f]'}`}>
        {fileName ? <FileUp className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
      </button>

      {/* Name input */}
      <input value={name} onChange={(e) => setName(e.target.value)}
        placeholder={`Nombre del ${tabLabel}…`}
        className="flex-1 min-w-0 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none"
        style={{ fontSize: '13px' }} />

      {/* File chip */}
      {fileName && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg shrink-0" style={{ fontSize: '11px' }}>
          <FileText className="w-3 h-3" />
          <span className="max-w-[120px] truncate">{fileName}</span>
          <button onClick={() => { setFileName(null); setName(''); }}><X className="w-3 h-3 ml-0.5" /></button>
        </span>
      )}

      <button onClick={submit} disabled={!fileName || !name}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        style={{ fontSize: '12px', fontWeight: 500 }}>
        <Plus className="w-3.5 h-3.5" /> Agregar evidencia
      </button>
    </div>
  );
}

/* ─────────────────── Evidence list for one tab ──────────────────── */

function EvidencePanel({ tab }: { tab: TabData }) {
  const [evidences, setEvidences] = useState<Evidence[]>(tab.evidences);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<EvidenceStatus | 'todos'>('todos');
  const [expanded, setExpanded]   = useState<string | null>(null);

  const visible = evidences.filter((e) => {
    const matchS = e.name.toLowerCase().includes(search.toLowerCase()) || e.author.toLowerCase().includes(search.toLowerCase());
    const matchF = statusFilter === 'todos' || e.status === statusFilter;
    return matchS && matchF;
  });

  const counts = {
    validado: evidences.filter((e) => e.status === 'validado').length,
    en_revision: evidences.filter((e) => e.status === 'en_revision').length,
    rechazado: evidences.filter((e) => e.status === 'rechazado').length,
  };

  const addEvidence = (e: Evidence) => setEvidences((prev) => [e, ...prev]);
  const removeEvidence = (id: string) => setEvidences((prev) => prev.filter((e) => e.id !== id));

  return (
    <div className="space-y-4">
      {/* Tab description + stats */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <p className="text-gray-500 max-w-xl" style={{ fontSize: '13px' }}>{tab.description}</p>
        <div className="flex items-center gap-3 shrink-0">
          {(Object.entries(counts) as [EvidenceStatus, number][]).map(([key, val]) => {
            const s = statusCfg[key];
            return (
              <button key={key} onClick={() => setStatusFilter(statusFilter === key ? 'todos' : key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all ${
                  statusFilter === key ? s.pill + ' border-current' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`} style={{ fontSize: '11px', fontWeight: 600 }}>
                {s.icon}
                <span>{s.label}</span>
                <span className={`w-4 h-4 rounded-full flex items-center justify-center ${statusFilter === key ? 'bg-white/50' : 'bg-gray-100'}`} style={{ fontSize: '10px' }}>{val}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre de evidencia o autor…"
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl placeholder-gray-400 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
          style={{ fontSize: '13px' }} />
      </div>

      {/* Upload row */}
      <UploadRow tabLabel={tab.uploadLabel} onAdd={addEvidence} />

      {/* Evidence list */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* List header */}
        <div className="grid px-5 py-3 border-b border-gray-100" style={{ gridTemplateColumns: '1fr auto auto auto auto' }}>
          {['Evidencia', 'Tipo', 'Autor', 'Fecha', ''].map((h) => (
            <p key={h} className="text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>{h}</p>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center gap-2">
            <Filter className="w-8 h-8 text-gray-200" />
            <p className="text-gray-400" style={{ fontSize: '13px' }}>No se encontraron evidencias.</p>
          </div>
        ) : (
          <div>
            {visible.map((ev, idx) => {
              const s = statusCfg[ev.status];
              const tc = typeColor[ev.type] ?? 'bg-gray-100 text-gray-600';
              const isExpanded = expanded === ev.id;
              const isLast = idx === visible.length - 1;
              return (
                <div key={ev.id} className={!isLast ? 'border-b border-gray-50' : ''}>
                  <div
                    className="grid items-center px-5 py-3.5 hover:bg-gray-50 transition-colors group cursor-pointer"
                    style={{ gridTemplateColumns: '1fr auto auto auto auto' }}
                    onClick={() => setExpanded(isExpanded ? null : ev.id)}
                  >
                    {/* Name + icon */}
                    <div className="flex items-center gap-3 min-w-0 pr-4">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-900 truncate" style={{ fontSize: '13px', fontWeight: 500 }}>{ev.name}</p>
                        <p className="text-gray-400" style={{ fontSize: '10px' }}>{ev.size}</p>
                      </div>
                    </div>

                    {/* Type badge */}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full mr-6 ${tc}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                      {ev.type}
                    </span>

                    {/* Author */}
                    <div className="flex items-center gap-1.5 mr-6">
                      <div className="w-5 h-5 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center shrink-0">
                        <Users className="w-2.5 h-2.5 text-[#1e3a5f]" />
                      </div>
                      <span className="text-gray-600 whitespace-nowrap" style={{ fontSize: '11px' }}>{ev.author}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 mr-6">
                      <CalendarDays className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-500 whitespace-nowrap" style={{ fontSize: '11px' }}>{ev.date}</span>
                    </div>

                    {/* Status + actions */}
                    <div className="flex items-center gap-2 justify-end">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.pill}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                        {s.icon}{s.label}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/10 transition-colors">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/10 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeEvidence(ev.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expandable description */}
                  {isExpanded && ev.description && (
                    <div className="px-5 pb-4 pt-1 bg-gray-50 border-t border-gray-100">
                      <p className="text-gray-600 pl-11" style={{ fontSize: '12px', lineHeight: 1.6 }}>{ev.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer count */}
        {visible.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-gray-400" style={{ fontSize: '11px' }}>
              Mostrando {visible.length} de {evidences.length} evidencias
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────── Main view ──────────────────────────────────── */

export function GruposColegiados() {
  const [activeTab, setActiveTab] = useState<TabId>('ensenanza');
  const [showEvidenciaModal, setShowEvidenciaModal] = useState(false);
  const tab = tabsData.find((t) => t.id === activeTab)!;

  const totalByTab = tabsData.map((t) => ({
    id: t.id,
    total: t.evidences.length,
    validated: t.evidences.filter((e) => e.status === 'validado').length,
  }));

  return (
    <>
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-5">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Grupos Colegiados</h1>
            <p className="text-sm text-gray-500">Gestión de evidencias por categoría académica del colegiado</p>
          </div>
          {/* Global summary chips + CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600" style={{ fontSize: '12px' }}>
              <FileText className="w-3.5 h-3.5 text-[#1e3a5f]" />
              {tabsData.reduce((a, t) => a + t.evidences.length, 0)} evidencias totales
            </span>
            <button
              onClick={() => setShowEvidenciaModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              <Plus className="w-4 h-4" /> Registrar Evidencia
            </button>
          </div>
        </div>

        {/* ── Horizontal tab navigation ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-1 flex gap-1 overflow-x-auto">
          {tabsData.map((t) => {
            const isActive = t.id === activeTab;
            const counts   = totalByTab.find((x) => x.id === t.id)!;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex-1 min-w-[130px] flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#1e3a5f] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`}>{t.icon}</span>
                <span className="leading-none" style={{ fontSize: '13px', fontWeight: isActive ? 600 : 400 }}>
                  {t.shortLabel}
                </span>
                {/* Pill count */}
                <span className={`ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
                  isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`} style={{ fontSize: '10px', fontWeight: 600 }}>
                  {counts.total}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Tab content ── */}
        <EvidencePanel key={activeTab} tab={tab} />

      </div>
    </div>

    {showEvidenciaModal && (
      <EvidenciaModal onClose={() => setShowEvidenciaModal(false)} />
    )}
    </>
  );
}
