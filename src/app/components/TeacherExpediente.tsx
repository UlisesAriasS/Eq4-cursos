import { useState, useRef } from 'react';
import { DocumentoDetallePanel, mockDocumento } from './DocumentoDetallePanel';
import {
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  ClipboardList,
  Award,
  BookOpen,
  MoreVertical,
  Eye,
  Trash2,
  AlertTriangle,
  ArrowRight,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  Lock,
  CalendarDays,
  FileBadge,
} from 'lucide-react';

/* ─────────────────────────────── Types ──────────────────────────────── */

type FileStatus = 'validado' | 'en_revision' | 'rechazado';
type TabId = 'actual' | 'historial';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  date: string;
  status: FileStatus;
}

interface CardConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  accentLight: string;
  accept: string;
  files: UploadedFile[];
}

interface HistorialPeriodo {
  id: string;
  label: string;
  year: string;
  docs: { name: string; status: FileStatus }[];
}

/* ────────────────────────────── Data ───────────────────────────────── */

const statusConfig: Record<FileStatus, { label: string; classes: string; dot: string }> = {
  validado:    { label: 'Validado',    classes: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  en_revision: { label: 'En revisión', classes: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  rechazado:   { label: 'Rechazado',   classes: 'bg-red-100 text-red-700',     dot: 'bg-red-500'   },
};

const initialCards: CardConfig[] = [
  {
    id: 'asignacion',
    title: 'Asignación y Seguimiento',
    description: 'Documentos de asignación de materias y reportes de seguimiento.',
    icon: <ClipboardList className="w-5 h-5" />,
    accentLight: 'bg-blue-50 text-[#1e3a5f]',
    accept: '.pdf,.docx',
    files: [
      { id: 'a1', name: 'Asignacion_2026-I.pdf',        size: '1.2 MB', date: '04 jun 2026', status: 'validado'    },
      { id: 'a2', name: 'Reporte_Seguimiento_Mayo.pdf', size: '0.8 MB', date: '02 jun 2026', status: 'en_revision' },
    ],
  },
  {
    id: 'certificados',
    title: 'Certificados Docentes',
    description: 'Certificaciones, diplomas y constancias de formación.',
    icon: <Award className="w-5 h-5" />,
    accentLight: 'bg-purple-50 text-purple-700',
    accept: '.pdf,.jpg,.png',
    files: [
      { id: 'c1', name: 'Cert_AWS_CloudPractitioner.pdf',       size: '2.1 MB', date: '03 jun 2026', status: 'rechazado'   },
      { id: 'c2', name: 'Diplomado_Competencias_Docentes.pdf',  size: '3.5 MB', date: '01 jun 2026', status: 'validado'    },
    ],
  },
  {
    id: 'apuntes',
    title: 'Apuntes de Clase',
    description: 'Materiales didácticos, presentaciones y guías por materia.',
    icon: <BookOpen className="w-5 h-5" />,
    accentLight: 'bg-sky-50 text-sky-700',
    accept: '.pdf,.pptx,.docx',
    files: [
      { id: 'ap1', name: 'Apuntes_RedesII_U1.pdf',        size: '4.7 MB', date: '05 jun 2026', status: 'validado'    },
      { id: 'ap2', name: 'Presentacion_FastAPI_M3.pptx',  size: '9.2 MB', date: '04 jun 2026', status: 'en_revision' },
    ],
  },
];

const historialData: HistorialPeriodo[] = [
  {
    id: '2025b',
    label: 'Periodo 2025-B',
    year: 'Ago – Dic 2025',
    docs: [
      { name: 'Asignacion_2025-B.pdf',       status: 'validado' },
      { name: 'Cert_Cisco_CCNA.pdf',          status: 'validado' },
      { name: 'Apuntes_Ciberseguridad.pdf',   status: 'validado' },
      { name: 'Antologia_BaseDatos_2025.pdf', status: 'validado' },
    ],
  },
  {
    id: '2025a',
    label: 'Periodo 2025-A',
    year: 'Ene – Jun 2025',
    docs: [
      { name: 'Asignacion_2025-A.pdf',          status: 'validado' },
      { name: 'Cert_Google_Cloud.pdf',           status: 'validado' },
      { name: 'Apuntes_RedesI_2025.pdf',         status: 'validado' },
      { name: 'Antologia_ProgramacionWeb.pdf',   status: 'validado' },
    ],
  },
  {
    id: '2024b',
    label: 'Periodo 2024-B',
    year: 'Ago – Dic 2024',
    docs: [
      { name: 'Asignacion_2024-B.pdf',   status: 'validado' },
      { name: 'Cert_Azure_Fundamentals.pdf', status: 'validado' },
      { name: 'Apuntes_Docker_2024.pdf', status: 'validado' },
    ],
  },
  {
    id: '2024a',
    label: 'Periodo 2024-A',
    year: 'Ene – Jun 2024',
    docs: [
      { name: 'Asignacion_2024-A.pdf',  status: 'validado' },
      { name: 'Cert_AWS_2024.pdf',       status: 'validado' },
      { name: 'Guia_Practicas_2024.pdf', status: 'validado' },
    ],
  },
];

/* ────────────────────────────── Upload Card ─────────────────────────── */

function UploadCard({ card }: { card: CardConfig }) {
  const [isDragging, setIsDragging]   = useState(false);
  const [files, setFiles]             = useState<UploadedFile[]>(card.files);
  const [menuOpen, setMenuOpen]       = useState<string | null>(null);
  const inputRef                      = useRef<HTMLInputElement>(null);

  const addFile = (name: string, size: number) => {
    const kb = size / 1024;
    const displaySize = kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
    setFiles((prev) => [
      { id: Date.now().toString(), name, size: displaySize,
        date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'en_revision' },
      ...prev,
    ]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    Array.from(e.dataTransfer.files).forEach((f) => addFile(f.name, f.size));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) Array.from(e.target.files).forEach((f) => addFile(f.name, f.size));
    e.target.value = '';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100 flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${card.accentLight}`}>
          {card.icon}
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold" style={{ fontSize: '14px' }}>{card.title}</h3>
          <p className="text-gray-400 mt-0.5" style={{ fontSize: '11px' }}>{card.description}</p>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl py-6 px-4 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[#1e3a5f] bg-blue-50'
              : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/60'
          }`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors ${
            isDragging ? 'bg-[#1e3a5f]/10' : 'bg-white border border-gray-200'
          }`}>
            <Upload className={`w-5 h-5 ${isDragging ? 'text-[#1e3a5f]' : 'text-gray-400'}`} />
          </div>
          <p className="text-gray-600 mb-0.5" style={{ fontSize: '12px', fontWeight: 500 }}>
            {isDragging ? 'Suelta aquí' : 'Arrastra tu archivo'}
          </p>
          <p className="text-gray-400" style={{ fontSize: '11px' }}>
            {card.accept.split(',').join(', ').toUpperCase()}
          </p>
        </div>

        <input ref={inputRef} type="file" accept={card.accept} multiple onChange={handleInput} className="hidden" />

        {/* CTA button */}
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full py-2 rounded-xl border border-[#1e3a5f] text-[#1e3a5f] hover:bg-[#1e3a5f] hover:text-white transition-colors flex items-center justify-center gap-1.5"
          style={{ fontSize: '13px', fontWeight: 500 }}
        >
          <Upload className="w-3.5 h-3.5" />
          Seleccionar Archivo
        </button>

        {/* Recent files */}
        {files.length > 0 && (
          <div>
            <p className="text-gray-400 uppercase tracking-widest mb-2" style={{ fontSize: '10px', fontWeight: 600 }}>
              Archivos recientes
            </p>
            <div className="space-y-1">
              {files.map((file) => {
                const s = statusConfig[file.status];
                return (
                  <div key={file.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 group transition-colors">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 truncate" style={{ fontSize: '11px', fontWeight: 500 }}>{file.name}</p>
                      <p className="text-gray-400" style={{ fontSize: '10px' }}>{file.size} · {file.date}</p>
                    </div>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full shrink-0 ${s.classes}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                      {s.label}
                    </span>
                    <div className="relative shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === file.id ? null : file.id); }}
                        className="p-1 rounded-md text-gray-300 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreVertical className="w-3 h-3" />
                      </button>
                      {menuOpen === file.id && (
                        <div className="absolute right-0 top-6 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                          <button className="w-full flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-50" style={{ fontSize: '12px' }}>
                            <Eye className="w-3.5 h-3.5" /> Vista previa
                          </button>
                          <button
                            onClick={() => { setFiles((p) => p.filter((f) => f.id !== file.id)); setMenuOpen(null); }}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50" style={{ fontSize: '12px' }}
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Historial Sidebar ──────────────────────── */

function HistorialSidebar() {
  const [openId, setOpenId] = useState<string | null>('2025b');

  return (
    <aside className="w-72 shrink-0 flex flex-col gap-3">
      {/* Sidebar header */}
      <div className="bg-white rounded-2xl border border-gray-200 px-4 py-4">
        <div className="flex items-center gap-2 mb-1">
          <FolderOpen className="w-4 h-4 text-[#1e3a5f]" />
          <h2 className="text-gray-900 font-semibold" style={{ fontSize: '13px' }}>
            Historial de Expedientes
          </h2>
        </div>
        <p className="text-gray-400" style={{ fontSize: '11px' }}>
          Archivos de periodos anteriores · Solo lectura
        </p>
      </div>

      {/* Accordion list */}
      <div className="flex flex-col gap-2">
        {historialData.map((periodo) => {
          const isOpen = openId === periodo.id;
          return (
            <div
              key={periodo.id}
              className={`bg-white rounded-2xl border overflow-hidden transition-all ${
                isOpen ? 'border-[#1e3a5f]/30 shadow-sm' : 'border-gray-200'
              }`}
            >
              {/* Accordion trigger */}
              <button
                onClick={() => setOpenId(isOpen ? null : periodo.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                  isOpen ? 'bg-[#1e3a5f]/5' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isOpen ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold leading-none ${isOpen ? 'text-[#1e3a5f]' : 'text-gray-800'}`} style={{ fontSize: '13px' }}>
                    {periodo.label}
                  </p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: '10px' }}>{periodo.year}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="bg-gray-100 text-gray-500 rounded-full px-1.5 py-0.5" style={{ fontSize: '10px', fontWeight: 600 }}>
                    {periodo.docs.length}
                  </span>
                  {isOpen
                    ? <ChevronDown className="w-3.5 h-3.5 text-[#1e3a5f]" />
                    : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  }
                </div>
              </button>

              {/* Docs list */}
              {isOpen && (
                <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                  <div className="space-y-1">
                    {periodo.docs.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-gray-50 group transition-colors cursor-pointer"
                      >
                        <FileBadge className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="text-gray-700 flex-1 truncate" style={{ fontSize: '11px' }}>{doc.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <Lock className="w-2.5 h-2.5 text-gray-300" />
                          <Eye className="w-3 h-3 text-gray-300 group-hover:text-[#1e3a5f] transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-gray-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors" style={{ fontSize: '11px', fontWeight: 500 }}>
                    Ver expediente completo
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Read-only notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex items-start gap-2">
        <Lock className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
        <p className="text-gray-400" style={{ fontSize: '10px', lineHeight: 1.5 }}>
          Los expedientes anteriores son de solo lectura. Para correcciones contacta a Dirección Académica.
        </p>
      </div>
    </aside>
  );
}

/* ──────────────────────────── Main View ─────────────────────────────── */

export function TeacherExpediente() {
  const [activeTab, setActiveTab] = useState<TabId>('actual');
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [showDocDetail, setShowDocDetail] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-[1400px] mx-auto">

        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Expediente Docente</h1>
          <p className="text-sm text-gray-500">
            Gestiona y carga los documentos requeridos para tu expediente institucional
          </p>
        </div>

        {/* ── Tab navigation ── */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-6">
          {([
            { id: 'actual',   label: 'Periodo Actual',       icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'historial', label: 'Historial Anteriores', icon: <FolderOpen className="w-3.5 h-3.5" /> },
          ] as { id: TabId; label: string; icon: React.ReactNode }[]).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1e3a5f] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ fontSize: '13px', fontWeight: activeTab === tab.id ? 600 : 400 }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'actual' ? (
          /* ── Periodo Actual layout: main + sidebar ── */
          <div className="flex gap-6 items-start">
            {/* Left: alerts + cards */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">

              {/* ── Alert / Observación de Dirección ── */}
              {!alertDismissed && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 rounded-full" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Observación de Dirección
                      </span>
                      <span className="text-gray-400" style={{ fontSize: '11px' }}>03 jun 2026 · Secretaría Académica</span>
                    </div>
                    <p className="text-red-800" style={{ fontSize: '13px', fontWeight: 500 }}>
                      Certificado rechazado.{' '}
                      <span className="text-red-700">Faltó incluir el folio y la firma digital</span>
                      {' '}en el documento enviado el 01 jun 2026.
                    </p>
                    <p className="text-red-600 mt-1" style={{ fontSize: '11px' }}>
                      Por favor, vuelve a subir el archivo corregido en la tarjeta de <strong>Certificados Docentes</strong>.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setShowDocDetail(true)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors whitespace-nowrap" style={{ fontSize: '12px', fontWeight: 500 }}>
                      <Upload className="w-3.5 h-3.5" />
                      Corregir documento
                    </button>
                    <button
                      onClick={() => setAlertDismissed(true)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ── Period badge ── */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full" style={{ fontSize: '12px', fontWeight: 600 }}>
                    <CalendarDays className="w-3.5 h-3.5" />
                    Semestre 2026-I · Ene – Jun 2026
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full" style={{ fontSize: '11px', fontWeight: 600 }}>
                    <Clock className="w-3 h-3" />
                    En captura
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {[
                    { label: 'Validados',    count: 3, color: 'text-green-700' },
                    { label: 'En revisión',  count: 2, color: 'text-amber-700' },
                    { label: 'Rechazados',   count: 1, color: 'text-red-700'   },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <p className={s.color} style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1 }}>{s.count}</p>
                      <p className="text-gray-400" style={{ fontSize: '10px' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Upload cards grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {initialCards.map((card) => (
                  <UploadCard key={card.id} card={card} />
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <HistorialSidebar />
          </div>
        ) : (
          /* ── Historial tab: full-width expanded view ── */
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <FolderOpen className="w-5 h-5 text-[#1e3a5f]" />
              <div>
                <h2 className="text-gray-900 font-semibold" style={{ fontSize: '15px' }}>Historial de Expedientes</h2>
                <p className="text-gray-400" style={{ fontSize: '12px' }}>Expedientes cerrados de semestres anteriores · Solo lectura</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {historialData.map((periodo) => (
                <div key={periodo.id} className="border border-gray-200 rounded-2xl overflow-hidden hover:border-[#1e3a5f]/30 hover:shadow-sm transition-all">
                  <div className="bg-[#1e3a5f]/5 px-4 py-3 flex items-center gap-2 border-b border-gray-100">
                    <CalendarDays className="w-4 h-4 text-[#1e3a5f] shrink-0" />
                    <div>
                      <p className="text-[#1e3a5f] font-semibold" style={{ fontSize: '13px' }}>{periodo.label}</p>
                      <p className="text-gray-500" style={{ fontSize: '10px' }}>{periodo.year}</p>
                    </div>
                    <Lock className="w-3 h-3 text-gray-300 ml-auto" />
                  </div>
                  <div className="p-3 space-y-1">
                    {periodo.docs.map((doc, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors">
                        <FileBadge className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        <span className="text-gray-700 flex-1 truncate" style={{ fontSize: '11px' }}>{doc.name}</span>
                        <CheckCircle2 className="w-3 h-3 text-green-500 shrink-0" />
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pb-3">
                    <button className="w-full py-1.5 rounded-xl border border-gray-200 text-gray-500 hover:border-[#1e3a5f] hover:text-[#1e3a5f] transition-colors flex items-center justify-center gap-1" style={{ fontSize: '11px', fontWeight: 500 }}>
                      Ver expediente <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

    {showDocDetail && (
      <DocumentoDetallePanel
        documento={mockDocumento}
        onClose={() => setShowDocDetail(false)}
      />
    )}
  );
}
