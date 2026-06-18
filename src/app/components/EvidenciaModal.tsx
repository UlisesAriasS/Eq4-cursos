import { useState, useRef } from 'react';
import {
  X,
  ChevronDown,
  Upload,
  FileText,
  Save,
  BookOpen,
  FlaskConical,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Info,
} from 'lucide-react';

/* ─────────────────────────── Catalog ───────────────────────────── */

interface ActivityConfig {
  label: string;
  fields: FieldDef[];
}

interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date' | 'select';
  options?: string[];
  hint?: string;
  required?: boolean;
  width?: 'full' | 'half';
}

interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  accent: string;
  accentLight: string;
  activities: ActivityConfig[];
}

const categories: Category[] = [
  {
    id: 'ensenanza',
    label: 'Enseñanza-Aprendizaje',
    icon: <BookOpen className="w-4 h-4" />,
    accent: 'text-[#1e3a5f]',
    accentLight: 'bg-blue-50',
    activities: [
      {
        label: 'Libro de texto',
        fields: [
          { key: 'titulo',     label: 'Título del libro',      placeholder: 'Título completo de la obra',   type: 'text',   required: true,  width: 'full' },
          { key: 'isbn',       label: 'ISBN',                  placeholder: 'Ej. 978-607-XXXX-XX-X',        type: 'text',   required: true,  width: 'half', hint: 'ISBN de 13 dígitos' },
          { key: 'editorial',  label: 'Datos Editoriales',     placeholder: 'Editorial, ciudad, año',       type: 'text',   required: true,  width: 'half' },
          { key: 'anio',       label: 'Año de publicación',    placeholder: 'AAAA',                         type: 'number', required: true,  width: 'half' },
          { key: 'paginas',    label: 'Número de páginas',     placeholder: 'Ej. 320',                      type: 'number', required: false, width: 'half' },
        ],
      },
      {
        label: 'Apuntes de clase',
        fields: [
          { key: 'materia',    label: 'Nombre de la materia',  placeholder: 'Ej. Redes de Computadoras II',  type: 'text',   required: true,  width: 'full' },
          { key: 'unidad',     label: 'Unidad / Módulo',       placeholder: 'Ej. Unidad 1',                  type: 'text',   required: false, width: 'half' },
          { key: 'semestre',   label: 'Semestre',              placeholder: 'Ej. 2026-I',                    type: 'text',   required: true,  width: 'half' },
        ],
      },
      {
        label: 'Guía de laboratorio',
        fields: [
          { key: 'titulo',     label: 'Título de la guía',     placeholder: 'Ej. Guía Práctica #3',          type: 'text',   required: true,  width: 'full' },
          { key: 'materia',    label: 'Materia correspondiente', placeholder: 'Nombre de la materia',        type: 'text',   required: true,  width: 'half' },
          { key: 'semestre',   label: 'Semestre',              placeholder: 'Ej. 2026-I',                    type: 'text',   required: true,  width: 'half' },
        ],
      },
      {
        label: 'Instrumento de evaluación',
        fields: [
          { key: 'tipo_eval',  label: 'Tipo de evaluación',    placeholder: 'Ej. Rúbrica, Examen, Lista de cotejo', type: 'text', required: true, width: 'half' },
          { key: 'materia',    label: 'Materia',               placeholder: 'Nombre de la materia',          type: 'text',   required: true,  width: 'half' },
          { key: 'semestre',   label: 'Semestre',              placeholder: 'Ej. 2026-I',                    type: 'text',   required: true,  width: 'half' },
          { key: 'parcial',    label: 'Parcial / Unidad',      placeholder: 'Ej. Primer parcial',            type: 'text',   required: false, width: 'half' },
        ],
      },
    ],
  },
  {
    id: 'investigacion',
    label: 'Investigación',
    icon: <FlaskConical className="w-4 h-4" />,
    accent: 'text-violet-700',
    accentLight: 'bg-violet-50',
    activities: [
      {
        label: 'Artículo científico (ISI / Scopus)',
        fields: [
          { key: 'titulo',     label: 'Título del artículo',   placeholder: 'Título completo del artículo',  type: 'text',   required: true,  width: 'full' },
          { key: 'doi',        label: 'DOI',                   placeholder: 'Ej. 10.1000/xyz123',            type: 'text',   required: true,  width: 'half', hint: 'Digital Object Identifier' },
          { key: 'issn',       label: 'ISSN',                  placeholder: 'Ej. XXXX-XXXX',                 type: 'text',   required: true,  width: 'half' },
          { key: 'revista',    label: 'Nombre de la revista',  placeholder: 'Nombre completo de la revista', type: 'text',   required: true,  width: 'full' },
          { key: 'volumen',    label: 'Volumen / Número',      placeholder: 'Ej. Vol. 12, Núm. 3',           type: 'text',   required: false, width: 'half' },
          { key: 'paginas',    label: 'Páginas',               placeholder: 'Ej. pp. 145–162',               type: 'text',   required: false, width: 'half' },
          { key: 'anio',       label: 'Año de publicación',    placeholder: 'AAAA',                          type: 'number', required: true,  width: 'half' },
          { key: 'indizacion', label: 'Índice de indización',  placeholder: 'Ej. Scopus Q2, JCR',            type: 'text',   required: false, width: 'half' },
        ],
      },
      {
        label: 'Artículo en revista arbitrada',
        fields: [
          { key: 'titulo',     label: 'Título del artículo',   placeholder: 'Título completo',               type: 'text',   required: true,  width: 'full' },
          { key: 'issn',       label: 'ISSN / ISBN',           placeholder: 'Identificador de la revista',   type: 'text',   required: true,  width: 'half' },
          { key: 'revista',    label: 'Nombre de la revista',  placeholder: 'Nombre de la publicación',      type: 'text',   required: true,  width: 'half' },
          { key: 'anio',       label: 'Año',                   placeholder: 'AAAA',                          type: 'number', required: true,  width: 'half' },
          { key: 'editorial',  label: 'Datos Editoriales',     placeholder: 'Editorial, ciudad',             type: 'text',   required: false, width: 'half' },
        ],
      },
      {
        label: 'Capítulo de libro',
        fields: [
          { key: 'titulo_cap', label: 'Título del capítulo',   placeholder: 'Título del capítulo',           type: 'text',   required: true,  width: 'full' },
          { key: 'titulo_lib', label: 'Título del libro',      placeholder: 'Obra que lo contiene',          type: 'text',   required: true,  width: 'full' },
          { key: 'isbn',       label: 'ISBN',                  placeholder: '978-XXX-XXXX-XX-X',             type: 'text',   required: true,  width: 'half' },
          { key: 'editorial',  label: 'Datos Editoriales',     placeholder: 'Editorial, ciudad, año',        type: 'text',   required: true,  width: 'half' },
          { key: 'paginas',    label: 'Páginas del capítulo',  placeholder: 'Ej. pp. 45–78',                 type: 'text',   required: false, width: 'half' },
          { key: 'anio',       label: 'Año',                   placeholder: 'AAAA',                          type: 'number', required: true,  width: 'half' },
        ],
      },
      {
        label: 'Ponencia / Conferencia',
        fields: [
          { key: 'titulo',     label: 'Título de la ponencia', placeholder: 'Título completo',               type: 'text',   required: true,  width: 'full' },
          { key: 'evento',     label: 'Nombre del evento',     placeholder: 'Congreso, simposio o foro',     type: 'text',   required: true,  width: 'full' },
          { key: 'lugar',      label: 'Lugar / Ciudad',        placeholder: 'Ciudad, País',                  type: 'text',   required: true,  width: 'half' },
          { key: 'fecha',      label: 'Fecha del evento',      placeholder: '',                              type: 'date',   required: true,  width: 'half' },
          { key: 'isbn',       label: 'ISBN de memorias',      placeholder: 'Si aplica',                     type: 'text',   required: false, width: 'half' },
          { key: 'doi',        label: 'DOI',                   placeholder: 'Si aplica',                     type: 'text',   required: false, width: 'half', hint: 'Digital Object Identifier' },
        ],
      },
    ],
  },
  {
    id: 'gestion',
    label: 'Gestión Académica',
    icon: <ClipboardList className="w-4 h-4" />,
    accent: 'text-teal-700',
    accentLight: 'bg-teal-50',
    activities: [
      {
        label: 'Acta de sesión colegiada',
        fields: [
          { key: 'folio',      label: 'Folio del acta',        placeholder: 'Ej. UTN-CA-2026-005',           type: 'text',   required: true,  width: 'half' },
          { key: 'fecha',      label: 'Fecha de la sesión',    placeholder: '',                              type: 'date',   required: true,  width: 'half' },
          { key: 'colegiado',  label: 'Cuerpo colegiado',      placeholder: 'Nombre del cuerpo académico',   type: 'text',   required: true,  width: 'full' },
        ],
      },
      {
        label: 'Informe de actividades',
        fields: [
          { key: 'periodo',    label: 'Periodo',               placeholder: 'Ej. Enero – Junio 2026',        type: 'text',   required: true,  width: 'half' },
          { key: 'folio',      label: 'Folio / Número',        placeholder: 'Número de informe',             type: 'text',   required: false, width: 'half' },
          { key: 'descripcion',label: 'Descripción breve',     placeholder: 'Resumen del contenido',         type: 'text',   required: false, width: 'full' },
        ],
      },
    ],
  },
  {
    id: 'tutorias',
    label: 'Tutorías',
    icon: <MessageSquare className="w-4 h-4" />,
    accent: 'text-sky-700',
    accentLight: 'bg-sky-50',
    activities: [
      {
        label: 'Reporte de tutoría',
        fields: [
          { key: 'alumno',     label: 'Nombre del alumno',     placeholder: 'Nombre completo',               type: 'text',   required: true,  width: 'full' },
          { key: 'matricula',  label: 'Matrícula',             placeholder: 'Ej. 2024-10045',                type: 'text',   required: true,  width: 'half' },
          { key: 'fecha',      label: 'Fecha de sesión',       placeholder: '',                              type: 'date',   required: true,  width: 'half' },
          { key: 'tipo_sesion',label: 'Tipo de sesión',        placeholder: 'Ej. Diagnóstico, Seguimiento',  type: 'text',   required: false, width: 'half' },
          { key: 'semestre',   label: 'Semestre del alumno',   placeholder: 'Ej. 4°',                        type: 'text',   required: false, width: 'half' },
        ],
      },
      {
        label: 'Plan de acción tutorial',
        fields: [
          { key: 'periodo',    label: 'Periodo',               placeholder: 'Ej. 2026-I',                    type: 'text',   required: true,  width: 'half' },
          { key: 'grupo',      label: 'Grupo asignado',        placeholder: 'Ej. ISC-4A',                    type: 'text',   required: true,  width: 'half' },
          { key: 'num_alumnos',label: 'N.º de tutorados',      placeholder: 'Cantidad',                      type: 'number', required: true,  width: 'half' },
        ],
      },
    ],
  },
];

/* ─────────────────── Reusable dropdown ─────────────────────────── */

function Select<T extends { label: string }>({
  placeholder, value, options, onChange, renderTrigger,
}: {
  placeholder: string;
  value: T | null;
  options: T[];
  onChange: (v: T) => void;
  renderTrigger?: (v: T) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 px-3.5 py-2.5 border rounded-xl transition-all text-left ${
          value ? 'border-[#1e3a5f]/40 bg-[#1e3a5f]/5' : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <span className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-400'}`} style={{ fontSize: '13px' }}>
          {value ? (renderTrigger ? renderTrigger(value) : value.label) : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 max-h-56 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => { onChange(opt); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${value?.label === opt.label ? 'text-[#1e3a5f] bg-[#1e3a5f]/5' : 'text-gray-700'}`}
              style={{ fontSize: '13px', fontWeight: value?.label === opt.label ? 600 : 400 }}
            >
              {opt.label}
              {value?.label === opt.label && <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-[#1e3a5f]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────── Dynamic field row ─────────────────────────── */

function DynamicFields({
  fields,
  values,
  onChange,
}: {
  fields: FieldDef[];
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  if (fields.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
      {fields.map((f) => (
        <div key={f.key} className={f.width === 'full' ? 'col-span-2' : 'col-span-1'}>
          <label className="flex items-center gap-1 mb-1.5">
            <span className="text-gray-700" style={{ fontSize: '12px', fontWeight: 500 }}>{f.label}</span>
            {f.required && <span className="text-red-500" style={{ fontSize: '12px' }}>*</span>}
            {f.hint && (
              <span className="text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded" style={{ fontSize: '9px' }}>{f.hint}</span>
            )}
          </label>
          <input
            type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'}
            placeholder={f.placeholder}
            value={values[f.key] ?? ''}
            onChange={(e) => onChange(f.key, e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] transition-all"
            style={{ fontSize: '13px' }}
          />
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────── Main modal ────────────────────────── */

interface EvidenciaModalProps {
  onClose: () => void;
  onSave?: (data: Record<string, unknown>) => void;
}

export function EvidenciaModal({ onClose, onSave }: EvidenciaModalProps) {
  const [category,       setCategory]       = useState<Category | null>(null);
  const [activityConfig, setActivityConfig] = useState<ActivityConfig | null>(null);
  const [fieldValues,    setFieldValues]    = useState<Record<string, string>>({});
  const [files,          setFiles]          = useState<File[]>([]);
  const [isDrag,         setIsDrag]         = useState(false);
  const [saved,          setSaved]          = useState(false);
  const [touched,        setTouched]        = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setActivityConfig(null);
    setFieldValues({});
  };

  const handleActivityChange = (act: ActivityConfig) => {
    setActivityConfig(act);
    setFieldValues({});
  };

  const handleFieldChange = (key: string, val: string) => {
    setFieldValues((prev) => ({ ...prev, [key]: val }));
    setTouched(true);
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const pdfs = Array.from(newFiles).filter((f) =>
      f.type === 'application/pdf' || f.name.endsWith('.pdf')
    );
    setFiles((prev) => [...prev, ...pdfs]);
  };

  const removeFile = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const requiredFields = activityConfig?.fields.filter((f) => f.required) ?? [];
  const missingRequired = requiredFields.some((f) => !fieldValues[f.key]?.trim());
  const canSave = category && activityConfig && !missingRequired && files.length > 0;

  const handleSave = () => {
    if (!canSave) { setTouched(true); return; }
    setSaved(true);
    onSave?.({ category: category.label, activity: activityConfig.label, fields: fieldValues, files: files.map((f) => f.name) });
    setTimeout(onClose, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col" style={{ maxWidth: '720px', maxHeight: '90vh' }}>

        {/* ── Modal header ── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5280 100%)', borderRadius: '1rem 1rem 0 0' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold" style={{ fontSize: '16px' }}>Registrar Nueva Evidencia</h2>
              <p className="text-blue-200" style={{ fontSize: '11px' }}>Completa todos los campos requeridos marcados con *</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-blue-200 hover:bg-white/15 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* ── Row 1: Category + Activity type ── */}
          <div>
            <p className="text-gray-400 uppercase tracking-widest mb-3" style={{ fontSize: '10px', fontWeight: 700 }}>
              Clasificación de la evidencia
            </p>
            <div className="grid grid-cols-2 gap-4">
              {/* Category dropdown */}
              <div>
                <label className="text-gray-700 mb-1.5 block" style={{ fontSize: '12px', fontWeight: 500 }}>
                  Categoría del Rubro <span className="text-red-500">*</span>
                </label>
                <Select<Category>
                  placeholder="Selecciona una categoría…"
                  value={category}
                  options={categories}
                  onChange={handleCategoryChange}
                  renderTrigger={(c) => (
                    <span className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center ${c.accentLight} ${c.accent}`}>{c.icon}</span>
                      <span>{c.label}</span>
                    </span>
                  )}
                />
              </div>

              {/* Activity dropdown */}
              <div>
                <label className={`mb-1.5 block ${category ? 'text-gray-700' : 'text-gray-400'}`} style={{ fontSize: '12px', fontWeight: 500 }}>
                  Tipo de Actividad <span className="text-red-500">*</span>
                </label>
                <div className={!category ? 'opacity-50 pointer-events-none' : ''}>
                  <Select<ActivityConfig>
                    placeholder={category ? 'Selecciona el tipo…' : 'Primero selecciona categoría'}
                    value={activityConfig}
                    options={category?.activities ?? []}
                    onChange={handleActivityChange}
                  />
                </div>
              </div>
            </div>

            {/* Category pills */}
            {!category && (
              <div className="flex flex-wrap gap-2 mt-3">
                {categories.map((c) => (
                  <button key={c.id} onClick={() => handleCategoryChange(c)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 ${c.accentLight} ${c.accent} hover:border-current transition-colors`}
                    style={{ fontSize: '11px', fontWeight: 500 }}>
                    {c.icon}{c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Row 2: Dynamic fields ── */}
          {activityConfig && (
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${category?.accentLight} ${category?.accent}`}>
                  {category?.icon}
                </div>
                <p className="text-gray-900 font-semibold" style={{ fontSize: '13px' }}>
                  {activityConfig.label}
                </p>
                <span className="ml-auto text-gray-400" style={{ fontSize: '10px' }}>
                  {requiredFields.length} campo{requiredFields.length !== 1 ? 's' : ''} requerido{requiredFields.length !== 1 ? 's' : ''}
                </span>
              </div>
              <DynamicFields
                fields={activityConfig.fields}
                values={fieldValues}
                onChange={handleFieldChange}
              />
              {touched && missingRequired && (
                <p className="flex items-center gap-1.5 mt-3 text-red-600" style={{ fontSize: '11px' }}>
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  Completa los campos obligatorios antes de guardar.
                </p>
              )}
            </div>
          )}

          {/* ── Row 3: File upload ── */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-gray-700" style={{ fontSize: '12px', fontWeight: 500 }}>
                Subir evidencia y copias para cotejo <span className="text-red-500">*</span>
              </label>
              <span className="text-gray-400" style={{ fontSize: '10px' }}>Solo PDF · Máx. 25 MB por archivo</span>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
              onDragLeave={() => setIsDrag(false)}
              onDrop={(e) => { e.preventDefault(); setIsDrag(false); addFiles(e.dataTransfer.files); }}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl px-6 py-8 text-center cursor-pointer transition-all ${
                isDrag
                  ? 'border-[#1e3a5f] bg-blue-50'
                  : files.length > 0
                  ? 'border-emerald-300 bg-emerald-50/60 hover:border-emerald-400'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100/60'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 transition-colors ${
                isDrag ? 'bg-[#1e3a5f]/10' : files.length > 0 ? 'bg-emerald-100' : 'bg-white border border-gray-200'
              }`}>
                <Upload className={`w-6 h-6 transition-colors ${
                  isDrag ? 'text-[#1e3a5f]' : files.length > 0 ? 'text-emerald-600' : 'text-gray-400'
                }`} />
              </div>
              <p className="text-gray-700 font-medium mb-1" style={{ fontSize: '13px' }}>
                {isDrag ? 'Suelta los archivos aquí' : 'Arrastra tus archivos PDF aquí'}
              </p>
              <p className="text-gray-500 mb-3" style={{ fontSize: '12px' }}>
                Incluye el documento principal y las <strong>copias para cotejo</strong>
              </p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors" style={{ fontSize: '12px', fontWeight: 500 }}>
                <Upload className="w-3.5 h-3.5" /> Seleccionar archivos
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => { if (e.target.files) addFiles(e.target.files); e.target.value = ''; }}
            />

            {/* File list */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-white border border-emerald-200 rounded-xl group">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                      <FileText className="w-3.5 h-3.5 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 truncate" style={{ fontSize: '12px', fontWeight: 500 }}>{file.name}</p>
                      <p className="text-gray-400" style={{ fontSize: '10px' }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB · PDF
                      </p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <button onClick={() => removeFile(idx)} className="p-1 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hint */}
            <div className="flex items-start gap-2 mt-2.5">
              <Info className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-gray-400" style={{ fontSize: '11px', lineHeight: 1.5 }}>
                Puedes subir múltiples archivos. Se recomienda incluir el documento original y al menos una copia simple para cotejo por Secretaría Académica.
              </p>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between gap-4">
          {/* Validation status */}
          <div className="flex items-center gap-2">
            {saved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full" style={{ fontSize: '12px', fontWeight: 500 }}>
                <CheckCircle2 className="w-4 h-4" /> Evidencia registrada exitosamente
              </span>
            ) : (
              <div className="flex items-center gap-2">
                {[
                  { ok: !!category,         label: 'Categoría' },
                  { ok: !!activityConfig,   label: 'Tipo' },
                  { ok: !missingRequired && !!activityConfig, label: 'Datos' },
                  { ok: files.length > 0,  label: 'Archivo' },
                ].map((step) => (
                  <span key={step.label} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${step.ok ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`} style={{ fontSize: '10px', fontWeight: 600 }}>
                    {step.ok ? <CheckCircle2 className="w-2.5 h-2.5" /> : <div className="w-2.5 h-2.5 rounded-full border border-current" />}
                    {step.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              style={{ fontSize: '13px', fontWeight: 500 }}
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saved}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
                saved
                  ? 'bg-emerald-600 text-white'
                  : canSave
                  ? 'bg-[#1e3a5f] text-white hover:bg-[#2d5280] shadow-sm hover:shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              style={{ fontSize: '13px', fontWeight: 600 }}
            >
              <Save className="w-4 h-4" />
              {saved ? 'Guardado' : 'Guardar Registro'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
