import { useState, useRef } from 'react';
import {
  X,
  FileText,
  XCircle,
  CheckCircle2,
  Clock,
  Upload,
  Download,
  Eye,
  User,
  CalendarDays,
  Hash,
  BookOpen,
  Building2,
  AlertTriangle,
  MessageSquare,
  RefreshCw,
  Send,
  Paperclip,
  ChevronDown,
  FileCheck,
  Info,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────────── */

type DocStatus = 'rechazado' | 'en_revision' | 'validado' | 'pendiente';

interface RevisionEntry {
  id: string;
  date: string;
  time: string;
  author: string;
  role: string;
  status: DocStatus;
  comment: string;
  tags?: string[];
  attachments?: string[];
}

export interface DocumentoDetalle {
  id: string;
  title: string;
  status: DocStatus;
  author: string;
  submittedDate: string;
  category: string;
  activityType: string;
  isbn?: string;
  issn?: string;
  doi?: string;
  editorial?: string;
  pages?: number;
  fileSize: string;
  fileName: string;
  revisions: RevisionEntry[];
}

/* ─────────────────────────── Config ────────────────────────────── */

const statusCfg: Record<DocStatus, {
  label: string;
  pill: string;
  pillSolid: string;
  icon: React.ReactNode;
  timelineDot: string;
  timelineRing: string;
}> = {
  rechazado:   {
    label: 'Rechazado',
    pill: 'bg-red-100 text-red-700',
    pillSolid: 'bg-red-600 text-white',
    icon: <XCircle className="w-4 h-4" />,
    timelineDot: 'bg-red-500',
    timelineRing: 'ring-red-200',
  },
  en_revision: {
    label: 'En revisión',
    pill: 'bg-blue-100 text-blue-700',
    pillSolid: 'bg-blue-600 text-white',
    icon: <RefreshCw className="w-4 h-4" />,
    timelineDot: 'bg-blue-500',
    timelineRing: 'ring-blue-200',
  },
  validado:    {
    label: 'Validado',
    pill: 'bg-emerald-100 text-emerald-700',
    pillSolid: 'bg-emerald-600 text-white',
    icon: <CheckCircle2 className="w-4 h-4" />,
    timelineDot: 'bg-emerald-500',
    timelineRing: 'ring-emerald-200',
  },
  pendiente:   {
    label: 'Pendiente',
    pill: 'bg-amber-100 text-amber-700',
    pillSolid: 'bg-amber-500 text-white',
    icon: <Clock className="w-4 h-4" />,
    timelineDot: 'bg-amber-400',
    timelineRing: 'ring-amber-200',
  },
};

/* ─────────────────────────── Mock data ─────────────────────────── */

export const mockDocumento: DocumentoDetalle = {
  id: 'doc-001',
  title: 'Cert_AWS_CloudPractitioner.pdf',
  status: 'rechazado',
  author: 'Dr. Carlos Ruiz Mendoza',
  submittedDate: '03 jun 2026',
  category: 'Certificados Docentes',
  activityType: 'Certificación Profesional',
  isbn: undefined,
  issn: undefined,
  doi: undefined,
  editorial: 'Amazon Web Services',
  pages: 2,
  fileSize: '2.1 MB',
  fileName: 'Cert_AWS_CloudPractitioner.pdf',
  revisions: [
    {
      id: 'r3',
      date: '05 jun 2026',
      time: '10:42',
      author: 'Mtra. Patricia Lozano',
      role: 'Secretaría Académica',
      status: 'rechazado',
      comment:
        'El documento fue rechazado por las siguientes razones: (1) No incluye el número de folio institucional requerido en la carátula. (2) La firma digital del organismo emisor no es visible o está incompleta. Se solicita al profesor subir la versión corregida del certificado con ambos elementos.',
      tags: ['Folio faltante', 'Firma incompleta'],
    },
    {
      id: 'r2',
      date: '04 jun 2026',
      time: '15:10',
      author: 'Mtra. Patricia Lozano',
      role: 'Secretaría Académica',
      status: 'en_revision',
      comment:
        'Documento recibido y en proceso de validación. Se verificarán los datos con la plataforma oficial de Amazon Web Services. Tiempo estimado de respuesta: 24 horas hábiles.',
      tags: ['En verificación'],
    },
    {
      id: 'r1',
      date: '03 jun 2026',
      time: '09:05',
      author: 'Sistema',
      role: 'Plataforma Docente',
      status: 'pendiente',
      comment:
        'El documento Cert_AWS_CloudPractitioner.pdf fue recibido correctamente. Tamaño: 2.1 MB. La solicitud fue enviada a Secretaría Académica para su revisión.',
      attachments: ['Cert_AWS_CloudPractitioner.pdf'],
    },
  ],
};

/* ─────────────────── Upload update zone ────────────────────────── */

function UpdateUploadArea({ onSubmit }: { onSubmit: () => void }) {
  const [file, setFile]     = useState<File | null>(null);
  const [isDrag, setIsDrag] = useState(false);
  const [note, setNote]     = useState('');
  const ref                 = useRef<HTMLInputElement>(null);

  const pick = (f: File) => setFile(f);
  const submit = () => { if (!file) return; onSubmit(); };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) pick(f); }}
        onClick={() => !file && ref.current?.click()}
        className={`border-2 border-dashed rounded-xl py-5 px-4 text-center transition-all cursor-pointer ${
          isDrag ? 'border-[#1e3a5f] bg-blue-50' :
          file    ? 'border-emerald-300 bg-emerald-50' :
          'border-gray-200 bg-gray-50 hover:border-gray-300'
        }`}
      >
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-emerald-800 truncate max-w-[200px]" style={{ fontSize: '12px', fontWeight: 500 }}>{file.name}</span>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="p-0.5 hover:bg-emerald-100 rounded transition-colors">
              <X className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>
        ) : (
          <>
            <Upload className={`w-6 h-6 mx-auto mb-1.5 ${isDrag ? 'text-[#1e3a5f]' : 'text-gray-300'}`} />
            <p className="text-gray-600" style={{ fontSize: '12px', fontWeight: 500 }}>Arrastra el documento corregido</p>
            <p className="text-gray-400" style={{ fontSize: '10px' }}>PDF · Máx. 25 MB</p>
          </>
        )}
      </div>
      <input ref={ref} type="file" accept=".pdf" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) pick(f); e.target.value = ''; }} />

      {/* Note */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Comentario sobre las correcciones realizadas (opcional)…"
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
        style={{ fontSize: '12px' }}
      />

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!file}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#1e3a5f] text-white hover:bg-[#2d5280]"
        style={{ fontSize: '13px', fontWeight: 600 }}
      >
        <Send className="w-4 h-4" />
        Enviar documento corregido
      </button>
    </div>
  );
}

/* ─────────────────────────── Main panel ────────────────────────── */

interface DocumentoDetallePanelProps {
  documento: DocumentoDetalle;
  onClose: () => void;
}

export function DocumentoDetallePanel({ documento: doc, onClose }: DocumentoDetallePanelProps) {
  const [showUpdate, setShowUpdate]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [expandedId, setExpandedId]     = useState<string | null>('r3');
  const status                          = statusCfg[doc.status];
  const isRejected                      = doc.status === 'rechazado';

  const handleUpdateSubmit = () => {
    setSubmitted(true);
    setShowUpdate(false);
  };

  const metaFields = [
    { icon: <User className="w-3.5 h-3.5" />,         label: 'Autor / Docente',  value: doc.author },
    { icon: <CalendarDays className="w-3.5 h-3.5" />,  label: 'Fecha de envío',  value: doc.submittedDate },
    { icon: <BookOpen className="w-3.5 h-3.5" />,      label: 'Categoría',       value: doc.category },
    { icon: <FileText className="w-3.5 h-3.5" />,      label: 'Tipo de actividad', value: doc.activityType },
    ...(doc.editorial ? [{ icon: <Building2 className="w-3.5 h-3.5" />, label: 'Organismo emisor', value: doc.editorial }] : []),
    ...(doc.isbn  ? [{ icon: <Hash className="w-3.5 h-3.5" />, label: 'ISBN',  value: doc.isbn  }] : []),
    ...(doc.issn  ? [{ icon: <Hash className="w-3.5 h-3.5" />, label: 'ISSN',  value: doc.issn  }] : []),
    ...(doc.doi   ? [{ icon: <Hash className="w-3.5 h-3.5" />, label: 'DOI',   value: doc.doi   }] : []),
    { icon: <FileText className="w-3.5 h-3.5" />,      label: 'Archivo',         value: `${doc.fileName} · ${doc.fileSize}` },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/45 z-40 transition-opacity" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full z-50 flex flex-col shadow-2xl" style={{ width: '440px', background: '#f8f9fb' }}>

        {/* ── Panel header ── */}
        <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2b4e7a 100%)' }} className="px-6 py-5 shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-blue-200 uppercase tracking-widest mb-1" style={{ fontSize: '10px', fontWeight: 600 }}>
                  Detalle del documento
                </p>
                <h2 className="text-white font-semibold leading-snug truncate" style={{ fontSize: '14px' }}>
                  {doc.title}
                </h2>
              </div>
            </div>
            <button onClick={onClose}
              className="p-2 rounded-xl text-blue-200 hover:bg-white/15 transition-colors shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Status + actions row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold ${status.pillSolid}`} style={{ fontSize: '12px' }}>
              {status.icon}
              {status.label}
            </span>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors" style={{ fontSize: '11px', fontWeight: 500 }}>
              <Eye className="w-3.5 h-3.5" /> Vista previa
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-full transition-colors" style={{ fontSize: '11px', fontWeight: 500 }}>
              <Download className="w-3.5 h-3.5" /> Descargar
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Alert banner for rejected */}
          {isRejected && !submitted && (
            <div className="mx-5 mt-4 flex items-start gap-3 px-4 py-3.5 bg-red-50 border border-red-200 rounded-2xl">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-semibold" style={{ fontSize: '12px' }}>Acción requerida</p>
                <p className="text-red-700 mt-0.5" style={{ fontSize: '11px', lineHeight: 1.5 }}>
                  Este documento fue rechazado. Revisa el historial de observaciones y sube la versión corregida.
                </p>
              </div>
            </div>
          )}

          {submitted && (
            <div className="mx-5 mt-4 flex items-start gap-3 px-4 py-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-800 font-semibold" style={{ fontSize: '12px' }}>Documento enviado</p>
                <p className="text-emerald-700 mt-0.5" style={{ fontSize: '11px' }}>
                  El documento corregido fue enviado a revisión. Recibirás una notificación con el dictamen.
                </p>
              </div>
            </div>
          )}

          {/* ── Section 1: Metadata ── */}
          <div className="px-5 pt-5 pb-4">
            <p className="text-gray-400 uppercase tracking-widest mb-3" style={{ fontSize: '10px', fontWeight: 700 }}>
              Metadatos del documento
            </p>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-50">
              {metaFields.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 group hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-gray-500 group-hover:bg-[#1e3a5f]/8 group-hover:text-[#1e3a5f] transition-colors">
                    {f.icon}
                  </div>
                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <p className="text-gray-400 shrink-0" style={{ fontSize: '11px' }}>{f.label}</p>
                    <p className="text-gray-900 text-right truncate" style={{ fontSize: '12px', fontWeight: 500 }}>{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="mx-5 flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 shrink-0 flex items-center gap-1.5" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              <MessageSquare className="w-3 h-3" /> Historial de Revisiones
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── Section 2: Revision timeline ── */}
          <div className="px-5 pb-5">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[22px] top-0 bottom-0 w-px bg-gray-200" />

              <div className="space-y-1">
                {doc.revisions.map((rev, idx) => {
                  const sc      = statusCfg[rev.status];
                  const isFirst = idx === 0;
                  const isOpen  = expandedId === rev.id;

                  return (
                    <div key={rev.id} className="relative flex gap-4">
                      {/* Timeline dot */}
                      <div className={`relative z-10 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ring-4 ring-white transition-all ${sc.timelineDot} ${isFirst ? 'ring-4' : ''}`}
                        style={{ boxShadow: isFirst ? '0 0 0 3px white, 0 0 0 5px ' + (doc.status === 'rechazado' ? '#fee2e2' : '#dbeafe') : undefined }}>
                        <div className="text-white">
                          {rev.status === 'rechazado'   ? <XCircle className="w-4 h-4" />    :
                           rev.status === 'en_revision' ? <RefreshCw className="w-4 h-4" />  :
                           rev.status === 'validado'    ? <CheckCircle2 className="w-4 h-4" /> :
                           <Clock className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Entry card */}
                      <div className={`flex-1 min-w-0 mb-4 bg-white rounded-2xl border overflow-hidden transition-all ${
                        isFirst && isRejected ? 'border-red-200' : 'border-gray-200'
                      }`}>
                        {/* Card header */}
                        <button
                          onClick={() => setExpandedId(isOpen ? null : rev.id)}
                          className="w-full flex items-start justify-between gap-3 px-4 pt-3.5 pb-3 text-left hover:bg-gray-50/60 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${sc.pill}`} style={{ fontSize: '10px', fontWeight: 700 }}>
                                {sc.icon}{sc.label}
                              </span>
                              {isFirst && (
                                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded" style={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' }}>
                                  Más reciente
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-semibold leading-none" style={{ fontSize: '12px' }}>{rev.author}</p>
                            <p className="text-gray-500 mt-0.5" style={{ fontSize: '10px' }}>{rev.role}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-gray-700 font-medium" style={{ fontSize: '11px' }}>{rev.date}</p>
                            <p className="text-gray-400" style={{ fontSize: '10px' }}>{rev.time} hrs</p>
                            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 mt-1 ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {/* Expanded comment */}
                        {isOpen && (
                          <div className={`px-4 pb-4 border-t ${isFirst && isRejected ? 'border-red-100 bg-red-50/40' : 'border-gray-100 bg-gray-50/40'}`}>
                            <p className="text-gray-700 leading-relaxed mt-3" style={{ fontSize: '12px', lineHeight: 1.7 }}>
                              {rev.comment}
                            </p>

                            {/* Tags */}
                            {rev.tags && rev.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-3">
                                {rev.tags.map((tag) => (
                                  <span key={tag} className={`px-2 py-0.5 rounded-full border ${
                                    isFirst && isRejected
                                      ? 'bg-red-100 text-red-700 border-red-200'
                                      : 'bg-blue-100 text-blue-700 border-blue-200'
                                  }`} style={{ fontSize: '10px', fontWeight: 600 }}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Attachments */}
                            {rev.attachments && rev.attachments.length > 0 && (
                              <div className="mt-3 space-y-1.5">
                                {rev.attachments.map((att) => (
                                  <div key={att} className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200">
                                    <Paperclip className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                    <span className="text-gray-700 flex-1 truncate" style={{ fontSize: '11px' }}>{att}</span>
                                    <Download className="w-3.5 h-3.5 text-gray-400 hover:text-[#1e3a5f] cursor-pointer transition-colors" />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 mt-1 px-4 py-3 bg-white border border-gray-200 rounded-xl">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-gray-500" style={{ fontSize: '11px', lineHeight: 1.5 }}>
                El historial de revisiones es inmutable. Cada acción queda registrada con fecha y hora para trazabilidad institucional.
              </p>
            </div>
          </div>

          {/* ── Update document section (only for rejected) ── */}
          {isRejected && !submitted && (
            <div className="px-5 pb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-gray-400 shrink-0" style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Enviar corrección
                </span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              {showUpdate ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-4">
                  <p className="text-gray-900 font-semibold mb-3" style={{ fontSize: '13px' }}>
                    Subir versión corregida
                  </p>
                  <UpdateUploadArea onSubmit={handleUpdateSubmit} />
                </div>
              ) : (
                <p className="text-gray-400 text-center" style={{ fontSize: '11px' }}>
                  Usa el botón inferior para subir el documento con las correcciones indicadas.
                </p>
              )}
            </div>
          )}
        </div>

        {/* ── Sticky footer ── */}
        <div className="shrink-0 px-5 py-4 border-t border-gray-200 bg-white">
          {isRejected && !submitted ? (
            <div className="flex gap-2">
              <button onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ fontSize: '13px', fontWeight: 500 }}>
                Cerrar
              </button>
              <button
                onClick={() => setShowUpdate(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors shadow-sm"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                <Upload className="w-4 h-4" />
                Actualizar Documento
              </button>
            </div>
          ) : (
            <button onClick={onClose}
              className="w-full py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              style={{ fontSize: '13px', fontWeight: 500 }}>
              Cerrar panel
            </button>
          )}
        </div>

      </div>
    </>
  );
}
