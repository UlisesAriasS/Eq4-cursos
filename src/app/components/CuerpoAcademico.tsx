import { useState } from 'react';
import {
  ShieldCheck,
  CalendarDays,
  Download,
  Eye,
  Search,
  ChevronDown,
  FileText,
  Award,
  BookOpen,
  FlaskConical,
  Users,
  BadgeCheck,
  Clock,
  ArrowUpRight,
  Building2,
  MapPin,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────────── */

type AppointmentStatus = 'activo' | 'por_vencer' | 'vencido';
type DocCategory       = 'Acta' | 'Nombramiento' | 'Constancia' | 'Convenio' | 'Resolución' | 'Oficio';

interface Appointment {
  id: string;
  academy: string;
  campus: string;
  role: string;
  area: string;
  level: string;
  startDate: string;
  endDate: string;
  status: AppointmentStatus;
  members: number;
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
}

interface HistoricalDoc {
  id: string;
  title: string;
  date: string;
  role: string;
  category: DocCategory;
  academy: string;
  folio: string;
}

/* ─────────────────────────── Config ────────────────────────────── */

const statusCfg: Record<AppointmentStatus, { label: string; pill: string; dot: string; badge: React.ReactNode }> = {
  activo:     { label: 'Vigente',     pill: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', badge: <BadgeCheck className="w-3.5 h-3.5" /> },
  por_vencer: { label: 'Por vencer',  pill: 'bg-amber-100 text-amber-700',    dot: 'bg-amber-400',   badge: <Clock className="w-3.5 h-3.5" />     },
  vencido:    { label: 'Vencido',     pill: 'bg-gray-100 text-gray-500',      dot: 'bg-gray-400',    badge: <Clock className="w-3.5 h-3.5" />     },
};

const catCfg: Record<DocCategory, string> = {
  Acta:        'bg-blue-100 text-blue-700',
  Nombramiento:'bg-violet-100 text-violet-700',
  Constancia:  'bg-emerald-100 text-emerald-700',
  Convenio:    'bg-teal-100 text-teal-700',
  Resolución:  'bg-orange-100 text-orange-700',
  Oficio:      'bg-gray-100 text-gray-600',
};

const categories: DocCategory[] = ['Acta', 'Nombramiento', 'Constancia', 'Convenio', 'Resolución', 'Oficio'];

/* ─────────────────────────── Mock data ─────────────────────────── */

const appointments: Appointment[] = [
  {
    id: '1',
    academy:   'Cuerpo Académico de Tecnologías de la Información',
    campus:    'Universidad Tecnológica Nacional',
    role:      'Responsable del Cuerpo Académico',
    area:      'Ingeniería en Sistemas Computacionales',
    level:     'PROMEP – Consolidado',
    startDate: '15 enero 2024',
    endDate:   '14 enero 2027',
    status:    'activo',
    members:   6,
    icon:      <ShieldCheck className="w-6 h-6" />,
    accentBg:  'bg-[#1e3a5f]',
    accentText:'text-white',
  },
  {
    id: '2',
    academy:   'Red Temática de Ciberseguridad – CONACYT',
    campus:    'Centro de Investigación en Cómputo',
    role:      'Integrante Investigador',
    area:      'Seguridad en Redes y Sistemas Distribuidos',
    level:     'Red Nacional de Investigación',
    startDate: '01 marzo 2025',
    endDate:   '28 febrero 2026',
    status:    'por_vencer',
    members:   14,
    icon:      <FlaskConical className="w-6 h-6" />,
    accentBg:  'bg-amber-500',
    accentText:'text-white',
  },
  {
    id: '3',
    academy:   'Colegio de Profesores de Ingeniería',
    campus:    'Universidad Tecnológica Nacional',
    role:      'Secretario Académico',
    area:      'Desarrollo Curricular y Evaluación',
    level:     'Comité Institucional',
    startDate: '10 agosto 2022',
    endDate:   '09 agosto 2024',
    status:    'vencido',
    members:   9,
    icon:      <BookOpen className="w-6 h-6" />,
    accentBg:  'bg-gray-400',
    accentText:'text-white',
  },
];

const historicalDocs: HistoricalDoc[] = [
  { id: 'h1',  title: 'Acta de Constitución – Cuerpo Académico TI',            date: '15 ene 2024', role: 'Responsable',          category: 'Acta',         academy: 'CA Tecnologías de la Información', folio: 'UTN-CA-2024-001' },
  { id: 'h2',  title: 'Nombramiento como Responsable de CA',                   date: '15 ene 2024', role: 'Responsable',          category: 'Nombramiento', academy: 'CA Tecnologías de la Información', folio: 'UTN-NOM-2024-018' },
  { id: 'h3',  title: 'Constancia de Adscripción – Red CONACYT',               date: '01 mar 2025', role: 'Integrante',           category: 'Constancia',   academy: 'Red Ciberseguridad CONACYT',       folio: 'CONACYT-2025-4421' },
  { id: 'h4',  title: 'Convenio de Colaboración – CINVESTAV',                  date: '20 may 2024', role: 'Responsable',          category: 'Convenio',     academy: 'CA Tecnologías de la Información', folio: 'UTN-CON-2024-007' },
  { id: 'h5',  title: 'Resolución de Reconocimiento PROMEP Consolidado',       date: '10 feb 2024', role: 'Responsable',          category: 'Resolución',   academy: 'CA Tecnologías de la Información', folio: 'SEP-PROMEP-2024-3310' },
  { id: 'h6',  title: 'Acta de Sesión Ordinaria – Noviembre 2024',             date: '28 nov 2024', role: 'Responsable',          category: 'Acta',         academy: 'CA Tecnologías de la Información', folio: 'UTN-CA-2024-011' },
  { id: 'h7',  title: 'Oficio de Comisión – Congreso Nacional de Cómputo',     date: '05 oct 2024', role: 'Integrante',           category: 'Oficio',       academy: 'CA Tecnologías de la Información', folio: 'UTN-OF-2024-0234' },
  { id: 'h8',  title: 'Nombramiento Secretario Académico – Colegio Profesores', date: '10 ago 2022', role: 'Secretario Académico', category: 'Nombramiento', academy: 'Colegio de Profesores',            folio: 'UTN-NOM-2022-004' },
  { id: 'h9',  title: 'Acta de Renovación de Membresía – Red CONACYT',         date: '15 mar 2024', role: 'Integrante',           category: 'Acta',         academy: 'Red Ciberseguridad CONACYT',       folio: 'CONACYT-2024-8812' },
  { id: 'h10', title: 'Constancia de Participación – Coloquio Investigación',  date: '18 jun 2024', role: 'Ponente',              category: 'Constancia',   academy: 'CA Tecnologías de la Información', folio: 'UTN-CON-2024-029' },
];

/* ─────────────────── Appointment Card ──────────────────────────── */

function AppointmentCard({ appt }: { appt: Appointment }) {
  const s = statusCfg[appt.status];
  return (
    <div className={`bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
      appt.status === 'activo' ? 'border-[#1e3a5f]/25' : appt.status === 'por_vencer' ? 'border-amber-200' : 'border-gray-200 opacity-70'
    }`}>
      {/* Top accent strip */}
      <div className={`h-1.5 w-full ${appt.status === 'activo' ? 'bg-[#1e3a5f]' : appt.status === 'por_vencer' ? 'bg-amber-400' : 'bg-gray-300'}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${appt.accentBg} ${appt.accentText}`}>
              {appt.icon}
            </div>
            <div>
              <h3 className="text-gray-900 leading-snug pr-2" style={{ fontSize: '14px', fontWeight: 600 }}>
                {appt.academy}
              </h3>
              <p className="text-gray-500 flex items-center gap-1 mt-0.5" style={{ fontSize: '11px' }}>
                <Building2 className="w-3 h-3" />{appt.campus}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${s.pill}`} style={{ fontSize: '11px', fontWeight: 600 }}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 uppercase tracking-widest mb-1" style={{ fontSize: '9px', fontWeight: 600 }}>Rol / Cargo</p>
            <p className="text-gray-900" style={{ fontSize: '12px', fontWeight: 600 }}>{appt.role}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 uppercase tracking-widest mb-1" style={{ fontSize: '9px', fontWeight: 600 }}>Nivel</p>
            <p className="text-gray-900" style={{ fontSize: '12px', fontWeight: 600 }}>{appt.level}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 uppercase tracking-widest mb-1" style={{ fontSize: '9px', fontWeight: 600 }}>Área de conocimiento</p>
            <p className="text-gray-700" style={{ fontSize: '11px' }}>{appt.area}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-gray-400 uppercase tracking-widest mb-1" style={{ fontSize: '9px', fontWeight: 600 }}>Integrantes</p>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#1e3a5f]" />
              <p className="text-gray-900" style={{ fontSize: '12px', fontWeight: 600 }}>{appt.members} profesores</p>
            </div>
          </div>
        </div>

        {/* Validity dates */}
        <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${
          appt.status === 'activo' ? 'bg-[#1e3a5f]/5 border-[#1e3a5f]/15'
          : appt.status === 'por_vencer' ? 'bg-amber-50 border-amber-200'
          : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <CalendarDays className={`w-3.5 h-3.5 ${appt.status === 'activo' ? 'text-[#1e3a5f]' : appt.status === 'por_vencer' ? 'text-amber-600' : 'text-gray-400'}`} />
            <div>
              <p className="text-gray-400 uppercase tracking-widest" style={{ fontSize: '9px', fontWeight: 600 }}>Vigencia</p>
              <p className="text-gray-800" style={{ fontSize: '11px', fontWeight: 500 }}>
                {appt.startDate} — {appt.endDate}
              </p>
            </div>
          </div>
          {appt.status !== 'vencido' && (
            <button className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
              appt.status === 'activo'
                ? 'text-[#1e3a5f] hover:bg-[#1e3a5f]/10'
                : 'text-amber-700 hover:bg-amber-100'
            }`} style={{ fontSize: '11px', fontWeight: 500 }}>
              Ver nombramiento <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── Historical Documents Table ─────────────────── */

function HistoricalTable() {
  const [search, setSearch]       = useState('');
  const [catFilter, setCatFilter] = useState<DocCategory | 'Todos'>('Todos');
  const [sortDesc, setSortDesc]   = useState(true);
  const [catOpen, setCatOpen]     = useState(false);

  const visible = historicalDocs
    .filter((d) => {
      const ms = d.title.toLowerCase().includes(search.toLowerCase()) ||
                 d.folio.toLowerCase().includes(search.toLowerCase()) ||
                 d.role.toLowerCase().includes(search.toLowerCase());
      const mc = catFilter === 'Todos' || d.category === catFilter;
      return ms && mc;
    })
    .sort((a, b) => {
      const da = new Date(a.date.split(' ').reverse().join('-'));
      const db = new Date(b.date.split(' ').reverse().join('-'));
      return sortDesc ? +db - +da : +da - +db;
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Table toolbar */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-gray-900 font-semibold" style={{ fontSize: '15px' }}>
            Actas y Documentos Históricos
          </h2>
          <p className="text-gray-400 mt-0.5" style={{ fontSize: '11px' }}>
            {historicalDocs.length} documentos registrados
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar documento o folio…"
              className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              style={{ fontSize: '12px', width: '210px' }}
            />
          </div>

          {/* Category dropdown */}
          <div className="relative">
            <button
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              style={{ fontSize: '12px' }}
            >
              {catFilter !== 'Todos' ? (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${catCfg[catFilter]}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                  {catFilter}
                </span>
              ) : (
                <span className="text-gray-600">Categoría</span>
              )}
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1 w-44">
                <button
                  onClick={() => { setCatFilter('Todos'); setCatOpen(false); }}
                  className="w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ fontSize: '12px' }}
                >
                  Todas las categorías
                </button>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCatFilter(c); setCatOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${catCfg[c]}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                      {c}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-3 text-left text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>Título del documento</th>
              <th className="px-4 py-3 text-left text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>Categoría</th>
              <th className="px-4 py-3 text-left text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>
                <button className="flex items-center gap-1 hover:text-gray-600 transition-colors" onClick={() => setSortDesc(!sortDesc)}>
                  Fecha
                  <ChevronDown className={`w-3 h-3 transition-transform ${sortDesc ? '' : 'rotate-180'}`} />
                </button>
              </th>
              <th className="px-4 py-3 text-left text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>Rol</th>
              <th className="px-4 py-3 text-left text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>Folio</th>
              <th className="px-4 py-3 text-center text-gray-400 uppercase tracking-widest" style={{ fontSize: '10px', fontWeight: 600 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-gray-400" style={{ fontSize: '13px' }}>
                  No se encontraron documentos.
                </td>
              </tr>
            ) : (
              visible.map((doc, idx) => {
                const cc = catCfg[doc.category];
                const isLast = idx === visible.length - 1;
                return (
                  <tr
                    key={doc.id}
                    className={`hover:bg-gray-50/80 transition-colors group ${!isLast ? 'border-b border-gray-50' : ''}`}
                  >
                    {/* Title */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <div>
                          <p className="text-gray-900 leading-snug" style={{ fontSize: '13px', fontWeight: 500 }}>{doc.title}</p>
                          <p className="text-gray-400 mt-0.5 flex items-center gap-1" style={{ fontSize: '10px' }}>
                            <MapPin className="w-2.5 h-2.5" />{doc.academy}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full ${cc}`} style={{ fontSize: '11px', fontWeight: 600 }}>
                        {doc.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span style={{ fontSize: '12px' }}>{doc.date}</span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#1e3a5f]/50 shrink-0" />
                        <span className="text-gray-700" style={{ fontSize: '12px' }}>{doc.role}</span>
                      </div>
                    </td>

                    {/* Folio */}
                    <td className="px-4 py-4">
                      <span className="font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg" style={{ fontSize: '10px' }}>
                        {doc.folio}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-2 rounded-xl text-gray-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 transition-colors" title="Vista previa">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-xl text-gray-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 transition-colors" title="Descargar">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table footer */}
      {visible.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p className="text-gray-400" style={{ fontSize: '11px' }}>
            Mostrando <span className="font-medium text-gray-600">{visible.length}</span> de <span className="font-medium text-gray-600">{historicalDocs.length}</span> documentos
          </p>
          <div className="flex items-center gap-3">
            {(['Acta', 'Nombramiento', 'Constancia'] as DocCategory[]).map((c) => {
              const count = historicalDocs.filter((d) => d.category === c).length;
              return (
                <span key={c} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${catCfg[c]}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                  {c} · {count}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Main view ─────────────────────────── */

export function CuerpoAcademico() {
  const activeCount  = appointments.filter((a) => a.status === 'activo').length;
  const expiringCount = appointments.filter((a) => a.status === 'por_vencer').length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Page header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cuerpo Académico</h1>
            <p className="text-sm text-gray-500">
              Nombramientos activos, adscrpciones y documentos históricos del colegiado
            </p>
          </div>
          {/* Summary chips */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>
              <BadgeCheck className="w-3.5 h-3.5" />
              {activeCount} vigente{activeCount !== 1 ? 's' : ''}
            </span>
            {expiringCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>
                <Clock className="w-3.5 h-3.5" />
                {expiringCount} por vencer
              </span>
            )}
          </div>
        </div>

        {/* ── Section 1: Active Appointments ── */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-gray-900 font-semibold" style={{ fontSize: '15px' }}>
                Nombramientos Activos
              </h2>
              <p className="text-gray-400" style={{ fontSize: '11px' }}>
                Adscrpciones y cargos vigentes en cuerpos y redes académicas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {appointments.map((appt) => (
              <AppointmentCard key={appt.id} appt={appt} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 shrink-0" style={{ fontSize: '11px', fontWeight: 500 }}>
            DOCUMENTACIÓN HISTÓRICA
          </span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── Section 2: Historical Documents Table ── */}
        <section className="pb-6">
          <HistoricalTable />
        </section>

      </div>
    </div>
  );
}
