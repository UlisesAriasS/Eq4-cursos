import { useState, useRef } from 'react';
import {
  ChevronDown,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Send,
  Info,
  Sparkles,
  CalendarDays,
  Hash,
  Eye,
  Download,
  AlertCircle,
  RefreshCw,
  FileCheck,
  BadgeCheck,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────────── */

type RequestStatus = 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';

interface CertType {
  id: string;
  label: string;
  description: string;
  requiresDoc: boolean;
  docHint?: string;
  processDays: number;
}

interface CertRequest {
  id: string;
  folio: string;
  type: string;
  submittedAt: string;
  updatedAt: string;
  status: RequestStatus;
  fileName?: string;
  notes?: string;
  syncedToProfile: boolean;
}

/* ─────────────────────────── Config ────────────────────────────── */

const certTypes: CertType[] = [
  { id: 'nombramiento',   label: 'Constancia de Nombramiento',        description: 'Acreditación de tu cargo actual en la institución.',          requiresDoc: false,  processDays: 3  },
  { id: 'adscripcion',    label: 'Constancia de Adscripción',          description: 'Comprobante del área o departamento de adscripción.',          requiresDoc: false,  processDays: 3  },
  { id: 'laboral',        label: 'Constancia Laboral',                 description: 'Carta que acredita tu relación laboral vigente.',              requiresDoc: false,  processDays: 5  },
  { id: 'no_adeudo',      label: 'Constancia de No Adeudo',            description: 'Certificado de no tener adeudos con la institución.',          requiresDoc: false,  processDays: 2  },
  { id: 'participacion',  label: 'Constancia de Participación',        description: 'Para cursos, talleres, congresos o eventos académicos.',        requiresDoc: true,   docHint: 'Comprobante del evento (PDF)', processDays: 4 },
  { id: 'comision',       label: 'Constancia de Comisión',             description: 'Acreditación de comisión académica o administrativa.',         requiresDoc: true,   docHint: 'Oficio de asignación (PDF)',   processDays: 5 },
  { id: 'certificacion',  label: 'Validación de Certificación',        description: 'Solicitar la validación de un certificado externo.',           requiresDoc: true,   docHint: 'Certificado a validar (PDF/JPG)', processDays: 7 },
  { id: 'antiguedad',     label: 'Constancia de Antigüedad',           description: 'Documento que acredita los años de servicio.',                 requiresDoc: false,  processDays: 5  },
];

const statusCfg: Record<RequestStatus, { label: string; pill: string; icon: React.ReactNode; dot: string; timelineColor: string }> = {
  pendiente:   { label: 'Pendiente',   pill: 'bg-amber-100 text-amber-700',  icon: <Clock className="w-3.5 h-3.5" />,       dot: 'bg-amber-400',   timelineColor: 'bg-amber-400'   },
  en_revision: { label: 'En revisión', pill: 'bg-blue-100 text-blue-700',    icon: <RefreshCw className="w-3.5 h-3.5" />,   dot: 'bg-blue-500',    timelineColor: 'bg-blue-500'    },
  aprobado:    { label: 'Aprobado',    pill: 'bg-emerald-100 text-emerald-700', icon: <BadgeCheck className="w-3.5 h-3.5" />, dot: 'bg-emerald-500', timelineColor: 'bg-emerald-500' },
  rechazado:   { label: 'Rechazado',   pill: 'bg-red-100 text-red-700',      icon: <XCircle className="w-3.5 h-3.5" />,     dot: 'bg-red-500',     timelineColor: 'bg-red-500'     },
};

/* ─────────────────────────── Mock history ──────────────────────── */

const initialRequests: CertRequest[] = [
  { id: 'r1', folio: 'SOL-2026-0047', type: 'Constancia de Nombramiento',  submittedAt: '05 jun 2026', updatedAt: '06 jun 2026', status: 'aprobado',    syncedToProfile: true  },
  { id: 'r2', folio: 'SOL-2026-0041', type: 'Validación de Certificación', submittedAt: '01 jun 2026', updatedAt: '03 jun 2026', status: 'en_revision', syncedToProfile: false, fileName: 'Cert_AWS_v2.pdf', notes: 'En proceso de verificación con institución emisora.' },
  { id: 'r3', folio: 'SOL-2026-0035', type: 'Constancia de Participación', submittedAt: '25 may 2026', updatedAt: '28 may 2026', status: 'aprobado',    syncedToProfile: true,  fileName: 'Congreso_SOMECE.pdf' },
  { id: 'r4', folio: 'SOL-2026-0028', type: 'Constancia Laboral',          submittedAt: '18 may 2026', updatedAt: '20 may 2026', status: 'rechazado',   syncedToProfile: false, notes: 'Datos del formato incompletos. Volver a enviar con correcciones.' },
  { id: 'r5', folio: 'SOL-2026-0019', type: 'Constancia de Adscripción',   submittedAt: '10 may 2026', updatedAt: '11 may 2026', status: 'aprobado',    syncedToProfile: true  },
];

/* ─────────────────── Cert type selector ────────────────────────── */

function CertTypeDropdown({ value, onChange }: { value: CertType | null; onChange: (c: CertType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl transition-all text-left ${
          value ? 'border-[#1e3a5f]/40 bg-[#1e3a5f]/5' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${value ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-400'}`}>
          <FileCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          {value ? (
            <>
              <p className="text-[#1e3a5f] font-semibold leading-none" style={{ fontSize: '13px' }}>{value.label}</p>
              <p className="text-gray-500 mt-0.5 truncate" style={{ fontSize: '11px' }}>{value.description}</p>
            </>
          ) : (
            <p className="text-gray-400" style={{ fontSize: '13px' }}>Selecciona el tipo de constancia…</p>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-30 overflow-hidden">
          <div className="p-2 max-h-72 overflow-y-auto">
            {certTypes.map((ct) => (
              <button
                key={ct.id}
                onClick={() => { onChange(ct); setOpen(false); }}
                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                  value?.id === ct.id ? 'bg-[#1e3a5f]/8 text-[#1e3a5f]' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${value?.id === ct.id ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold" style={{ fontSize: '12px' }}>{ct.label}</p>
                    <span className="text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded" style={{ fontSize: '10px' }}>
                      ~{ct.processDays} días
                    </span>
                    {ct.requiresDoc && (
                      <span className="text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded" style={{ fontSize: '10px' }}>
                        Requiere documento
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '11px' }}>{ct.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Request history card ───────────────────────── */

function RequestCard({ req }: { req: CertRequest }) {
  const s = statusCfg[req.status];
  return (
    <div className={`bg-white rounded-2xl border p-4 transition-all hover:shadow-sm group ${
      req.status === 'rechazado' ? 'border-red-200' :
      req.status === 'aprobado'  ? 'border-emerald-200/60' :
      'border-gray-200'
    }`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-start gap-2.5">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
            req.status === 'aprobado' ? 'bg-emerald-100 text-emerald-600' :
            req.status === 'rechazado' ? 'bg-red-100 text-red-600' :
            'bg-gray-100 text-gray-500'
          }`}>
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold leading-snug" style={{ fontSize: '13px' }}>{req.type}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Hash className="w-2.5 h-2.5 text-gray-400" />
              <p className="font-mono text-gray-500" style={{ fontSize: '10px' }}>{req.folio}</p>
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full shrink-0 ${s.pill}`} style={{ fontSize: '10px', fontWeight: 700 }}>
          {s.icon}{s.label}
        </span>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '11px' }}>
          <CalendarDays className="w-3 h-3" />
          <span>Enviado: <span className="font-medium text-gray-700">{req.submittedAt}</span></span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-500" style={{ fontSize: '11px' }}>
          <RefreshCw className="w-3 h-3" />
          <span>Actualizado: <span className="font-medium text-gray-700">{req.updatedAt}</span></span>
        </div>
      </div>

      {/* File chip */}
      {req.fileName && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-gray-50 rounded-lg">
          <FileText className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <p className="text-gray-600 truncate flex-1" style={{ fontSize: '11px' }}>{req.fileName}</p>
        </div>
      )}

      {/* Notes */}
      {req.notes && (
        <div className={`flex items-start gap-2 mb-3 px-3 py-2 rounded-lg ${
          req.status === 'rechazado' ? 'bg-red-50 border border-red-100' : 'bg-blue-50 border border-blue-100'
        }`}>
          <AlertCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${req.status === 'rechazado' ? 'text-red-500' : 'text-blue-500'}`} />
          <p className={`${req.status === 'rechazado' ? 'text-red-700' : 'text-blue-700'}`} style={{ fontSize: '11px', lineHeight: 1.5 }}>
            {req.notes}
          </p>
        </div>
      )}

      {/* Footer: actions + sync badge */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-1">
        {req.syncedToProfile ? (
          <span className="inline-flex items-center gap-1.5 text-emerald-700" style={{ fontSize: '10px', fontWeight: 600 }}>
            <Sparkles className="w-3 h-3" /> Sincronizado al Perfil
          </span>
        ) : (
          <span className="text-gray-400" style={{ fontSize: '10px' }}>
            {req.status === 'aprobado' ? 'Sincronizando…' : 'Pendiente de aprobación'}
          </span>
        )}
        {req.status === 'aprobado' && (
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 transition-colors" title="Vista previa">
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 rounded-lg text-gray-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 transition-colors" title="Descargar">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {req.status === 'rechazado' && (
          <button className="flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors" style={{ fontSize: '10px', fontWeight: 600 }}>
            <RefreshCw className="w-3 h-3" /> Reenviar corregido
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────── Main view ─────────────────────────── */

export function SolicitudConstancias() {
  const [selectedType, setSelectedType] = useState<CertType | null>(null);
  const [notes, setNotes]               = useState('');
  const [fileName, setFileName]         = useState<string | null>(null);
  const [isDrag, setIsDrag]             = useState(false);
  const [requests, setRequests]         = useState<CertRequest[]>(initialRequests);
  const [submitted, setSubmitted]       = useState(false);
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'todas'>('todas');
  const fileRef                         = useRef<HTMLInputElement>(null);

  const pickFile = (f: File) => setFileName(f.name);

  const canSubmit = selectedType && (!selectedType.requiresDoc || fileName);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const folio = `SOL-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(4, '0')}`;
    const newReq: CertRequest = {
      id: Date.now().toString(),
      folio,
      type: selectedType!.label,
      submittedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      updatedAt:   new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'pendiente',
      fileName: fileName ?? undefined,
      notes: notes.trim() || undefined,
      syncedToProfile: false,
    };
    setRequests((prev) => [newReq, ...prev]);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedType(null);
      setFileName(null);
      setNotes('');
    }, 2500);
  };

  const visible = requests.filter((r) => statusFilter === 'todas' || r.status === statusFilter);

  const counts = {
    todas:       requests.length,
    pendiente:   requests.filter((r) => r.status === 'pendiente').length,
    en_revision: requests.filter((r) => r.status === 'en_revision').length,
    aprobado:    requests.filter((r) => r.status === 'aprobado').length,
    rechazado:   requests.filter((r) => r.status === 'rechazado').length,
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Solicitud de Constancias</h1>
          <p className="text-sm text-gray-500">
            Genera solicitudes de documentos institucionales y consulta el estado de tus trámites
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Request form ── */}
          <div className="w-80 shrink-0 space-y-4">

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {/* Card header */}
              <div className="px-5 py-4 bg-[#1e3a5f]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold" style={{ fontSize: '14px' }}>Nueva Solicitud</p>
                    <p className="text-blue-200" style={{ fontSize: '11px' }}>Tiempo estimado: 2–7 días hábiles</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-5">
                {/* Step 1: Type */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center shrink-0" style={{ fontSize: '10px', fontWeight: 700 }}>1</span>
                    <p className="text-gray-700 font-semibold" style={{ fontSize: '12px' }}>Tipo de constancia</p>
                  </div>
                  <CertTypeDropdown value={selectedType} onChange={setSelectedType} />

                  {/* Process time chip */}
                  {selectedType && (
                    <div className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <p className="text-blue-700" style={{ fontSize: '11px' }}>
                        Tiempo de proceso estimado: <strong>{selectedType.processDays} días hábiles</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Step 2: Document (conditional) */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      selectedType?.requiresDoc ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'
                    }`} style={{ fontSize: '10px', fontWeight: 700 }}>2</span>
                    <p className={`font-semibold ${selectedType?.requiresDoc ? 'text-gray-700' : 'text-gray-400'}`} style={{ fontSize: '12px' }}>
                      Documento de soporte
                      {selectedType && !selectedType.requiresDoc && (
                        <span className="ml-1 text-gray-400 font-normal">(no requerido)</span>
                      )}
                    </p>
                  </div>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
                    onDragLeave={() => setIsDrag(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDrag(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f); }}
                    onClick={() => fileRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl py-6 px-4 text-center transition-all cursor-pointer ${
                      isDrag ? 'border-[#1e3a5f] bg-blue-50' :
                      fileName ? 'border-emerald-300 bg-emerald-50' :
                      selectedType?.requiresDoc ? 'border-amber-300 bg-amber-50 hover:border-amber-400' :
                      'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {fileName ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-800 truncate max-w-[140px]" style={{ fontSize: '12px', fontWeight: 500 }}>{fileName}</span>
                        <button onClick={(e) => { e.stopPropagation(); setFileName(null); }} className="p-0.5 hover:bg-emerald-100 rounded transition-colors">
                          <X className="w-3.5 h-3.5 text-emerald-700" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-7 h-7 mx-auto mb-1.5 ${isDrag ? 'text-[#1e3a5f]' : selectedType?.requiresDoc ? 'text-amber-500' : 'text-gray-300'}`} />
                        <p className="text-gray-600" style={{ fontSize: '12px', fontWeight: 500 }}>
                          {isDrag ? 'Suelta aquí' : 'Arrastra o selecciona archivo'}
                        </p>
                        <p className="text-gray-400 mt-0.5" style={{ fontSize: '10px' }}>
                          {selectedType?.docHint ?? 'PDF, JPG, PNG · Máx. 10 MB'}
                        </p>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept=".pdf,.jpg,.png" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); e.target.value = ''; }} />
                </div>

                {/* Step 3: Notes */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${selectedType ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'}`} style={{ fontSize: '10px', fontWeight: 700 }}>3</span>
                    <p className={`font-semibold ${selectedType ? 'text-gray-700' : 'text-gray-400'}`} style={{ fontSize: '12px' }}>
                      Observaciones <span className="font-normal text-gray-400">(opcional)</span>
                    </p>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Indica el motivo de la solicitud o información adicional…"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit && !submitted}
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                    submitted
                      ? 'bg-emerald-600 text-white'
                      : canSubmit
                      ? 'bg-[#1e3a5f] text-white hover:bg-[#2d5280] shadow-sm hover:shadow-md'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  style={{ fontSize: '13px', fontWeight: 600 }}
                >
                  {submitted ? (
                    <><CheckCircle2 className="w-4 h-4" /> Solicitud enviada</>
                  ) : (
                    <><Send className="w-4 h-4" /> Enviar Solicitud</>
                  )}
                </button>

                {!canSubmit && selectedType?.requiresDoc && !fileName && (
                  <p className="text-amber-600 text-center flex items-center justify-center gap-1" style={{ fontSize: '11px' }}>
                    <AlertCircle className="w-3.5 h-3.5" /> Este tipo requiere adjuntar un documento
                  </p>
                )}
              </div>
            </div>

            {/* Auto-sync info box */}
            <div className="flex items-start gap-3 px-4 py-3.5 bg-[#1e3a5f]/5 border border-[#1e3a5f]/15 rounded-2xl">
              <Sparkles className="w-4 h-4 text-[#1e3a5f] shrink-0 mt-0.5" />
              <p className="text-[#1e3a5f]" style={{ fontSize: '12px', lineHeight: 1.6 }}>
                <strong>Sincronización automática:</strong> Las constancias aprobadas se vincularán automáticamente a tu sección de <strong>Perfil del Profesor</strong>.
              </p>
            </div>

            {/* Stats mini */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Aprobadas', value: counts.aprobado,  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
                { label: 'Pendientes', value: counts.pendiente + counts.en_revision, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
              ].map((s) => (
                <div key={s.label} className={`border rounded-xl px-4 py-3 text-center ${s.bg}`}>
                  <p className={s.color} style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '10px' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: History panel ── */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">

            {/* Panel header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-gray-900 font-semibold" style={{ fontSize: '15px' }}>Historial de Solicitudes</h2>
                <p className="text-gray-400 mt-0.5" style={{ fontSize: '11px' }}>
                  {requests.length} solicitudes registradas en el periodo actual
                </p>
              </div>
              {/* Filter pills */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
                {([
                  { key: 'todas', label: 'Todas', count: counts.todas },
                  { key: 'pendiente', label: 'Pendiente', count: counts.pendiente },
                  { key: 'en_revision', label: 'Revisión', count: counts.en_revision },
                  { key: 'aprobado', label: 'Aprobadas', count: counts.aprobado },
                  { key: 'rechazado', label: 'Rechazadas', count: counts.rechazado },
                ] as { key: RequestStatus | 'todas'; label: string; count: number }[]).map((f) => (
                  <button key={f.key} onClick={() => setStatusFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      statusFilter === f.key ? 'bg-[#1e3a5f] text-white' : 'text-gray-500 hover:bg-gray-100'
                    }`} style={{ fontSize: '11px', fontWeight: statusFilter === f.key ? 600 : 400 }}>
                    {f.label}
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${statusFilter === f.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`} style={{ fontSize: '9px', fontWeight: 700 }}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-white border border-gray-200 rounded-xl">
              <Info className="w-4 h-4 text-[#1e3a5f] shrink-0" />
              <p className="text-gray-600" style={{ fontSize: '12px' }}>
                Las constancias <strong>aprobadas</strong> se sincronizan automáticamente a tu sección de <strong>Perfil del Profesor</strong> para su descarga y validación institucional.
              </p>
            </div>

            {/* Cards grid */}
            {visible.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-16 gap-3">
                <FileText className="w-10 h-10 text-gray-200" />
                <p className="text-gray-400" style={{ fontSize: '13px' }}>No hay solicitudes con ese estado.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                {visible.map((req) => <RequestCard key={req.id} req={req} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
