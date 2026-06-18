import { useState, useRef } from 'react';
import {
  Download,
  Upload,
  FileArchive,
  GraduationCap,
  BookOpen,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  ChevronDown,
  FileText,
  Award,
  Layers,
  Star,
  Calendar,
  CheckCircle2,
  Clock,
  Building2,
  X,
  Plus,
} from 'lucide-react';

/* ─────────────────────────── Types ─────────────────────────────── */

type CertCategory =
  | 'Doctorado'
  | 'Maestría'
  | 'Diplomado'
  | 'Especialidad'
  | 'Certificación'
  | 'Curso'
  | 'Congreso';

interface HistoricalCert {
  id: string;
  name: string;
  institution: string;
  year: string;
  category: CertCategory;
  hours?: number;
  status: 'validado' | 'pendiente';
}

/* ─────────────────────────── Data ──────────────────────────────── */

const categoryConfig: Record<CertCategory, { color: string; bg: string }> = {
  Doctorado:      { color: 'text-violet-700', bg: 'bg-violet-100' },
  Maestría:       { color: 'text-blue-700',   bg: 'bg-blue-100'   },
  Diplomado:      { color: 'text-sky-700',    bg: 'bg-sky-100'    },
  Especialidad:   { color: 'text-indigo-700', bg: 'bg-indigo-100' },
  Certificación:  { color: 'text-amber-700',  bg: 'bg-amber-100'  },
  Curso:          { color: 'text-green-700',  bg: 'bg-green-100'  },
  Congreso:       { color: 'text-rose-700',   bg: 'bg-rose-100'   },
};

const categories: CertCategory[] = [
  'Doctorado', 'Maestría', 'Diplomado', 'Especialidad', 'Certificación', 'Curso', 'Congreso',
];

const initialCerts: HistoricalCert[] = [
  { id: '1', name: 'Doctorado en Ciencias Computacionales',         institution: 'CINVESTAV',                    year: '2018', category: 'Doctorado',     status: 'validado'  },
  { id: '2', name: 'Maestría en Redes y Telecomunicaciones',        institution: 'UNAM',                         year: '2014', category: 'Maestría',      status: 'validado'  },
  { id: '3', name: 'Diplomado en Competencias Docentes',            institution: 'SEP – DGETA',                  year: '2022', category: 'Diplomado',     hours: 120, status: 'validado'  },
  { id: '4', name: 'AWS Certified Cloud Practitioner',              institution: 'Amazon Web Services',          year: '2023', category: 'Certificación', status: 'validado'  },
  { id: '5', name: 'Cisco Certified Network Associate (CCNA)',      institution: 'Cisco Networking Academy',     year: '2021', category: 'Certificación', status: 'validado'  },
  { id: '6', name: 'Especialidad en Seguridad Informática',         institution: 'IPN',                          year: '2020', category: 'Especialidad',  hours: 360, status: 'validado'  },
  { id: '7', name: 'Congreso Nacional de Tecnología Educativa',     institution: 'SOMECE',                       year: '2023', category: 'Congreso',      status: 'validado'  },
  { id: '8', name: 'Curso: Inteligencia Artificial con Python',     institution: 'Coursera – DeepLearning.AI',   year: '2024', category: 'Curso',         hours: 40,  status: 'pendiente' },
  { id: '9', name: 'Diplomado en Innovación Educativa',             institution: 'Tecnológico de Monterrey',     year: '2023', category: 'Diplomado',     hours: 160, status: 'validado'  },
];

/* ─────────────────────────── CV Section ────────────────────────── */

function CVSummary() {
  const degrees = [
    { level: 'Doctorado', field: 'Ciencias Computacionales', school: 'CINVESTAV', year: '2018', icon: <GraduationCap className="w-4 h-4" /> },
    { level: 'Maestría',  field: 'Redes y Telecomunicaciones', school: 'UNAM',    year: '2014', icon: <GraduationCap className="w-4 h-4" /> },
    { level: 'Ingeniería', field: 'Sistemas Computacionales', school: 'IPN',      year: '2011', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  const trajectory = [
    { role: 'Profesor Titular A', org: 'Universidad Tecnológica Nacional', period: '2019 – presente', current: true },
    { role: 'Investigador Asociado', org: 'CINVESTAV – Dpto. de Redes',    period: '2016 – 2019',      current: false },
    { role: 'Docente de Asignatura', org: 'IPN – ESCOM',                   period: '2014 – 2016',      current: false },
  ];

  const stats = [
    { label: 'Años de experiencia', value: '12+', icon: <Star className="w-4 h-4 text-amber-500" /> },
    { label: 'Cursos impartidos',   value: '38',  icon: <BookOpen className="w-4 h-4 text-blue-500" /> },
    { label: 'Certificaciones',     value: '9',   icon: <Award className="w-4 h-4 text-violet-500" /> },
    { label: 'Diplomados',          value: '4',   icon: <Layers className="w-4 h-4 text-sky-500" /> },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Profile banner */}
      <div className="h-20 w-full" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5280 60%, #3a6fa0 100%)' }} />

      <div className="px-6 pb-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-8 mb-5">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-[#1e3a5f] flex items-center justify-center shadow-lg shrink-0">
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
            <div className="pb-1">
              <h2 className="text-gray-900" style={{ fontSize: '18px', fontWeight: 700 }}>
                Dr. Carlos Ruiz Mendoza
              </h2>
              <p className="text-gray-500 flex items-center gap-1.5 mt-0.5" style={{ fontSize: '12px' }}>
                <Building2 className="w-3.5 h-3.5" />
                Profesor Titular A · Universidad Tecnológica Nacional
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors shrink-0 shadow-sm" style={{ fontSize: '13px', fontWeight: 500 }}>
            <FileArchive className="w-4 h-4" />
            Descargar todo como ZIP
          </button>
        </div>

        {/* Contact chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { icon: <Mail className="w-3.5 h-3.5" />, text: 'c.ruiz@utn.edu.mx' },
            { icon: <Phone className="w-3.5 h-3.5" />, text: '+52 55 1234 5678' },
            { icon: <MapPin className="w-3.5 h-3.5" />, text: 'Ciudad de México' },
            { icon: <Calendar className="w-3.5 h-3.5" />, text: 'Ingreso: Ago 2019' },
          ].map((c) => (
            <span key={c.text} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600" style={{ fontSize: '12px' }}>
              {c.icon}{c.text}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                {s.icon}
              </div>
              <div>
                <p className="text-gray-900" style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1 }}>{s.value}</p>
                <p className="text-gray-500 mt-0.5" style={{ fontSize: '10px' }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Two-column: degrees + trajectory */}
        <div className="grid grid-cols-2 gap-4">
          {/* Formación académica */}
          <div>
            <p className="text-gray-400 uppercase tracking-widest mb-3" style={{ fontSize: '10px', fontWeight: 600 }}>
              Formación Académica
            </p>
            <div className="space-y-2">
              {degrees.map((d, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    i === 0 ? 'bg-violet-100 text-violet-700'
                    : i === 1 ? 'bg-blue-100 text-blue-700'
                    : 'bg-sky-100 text-sky-700'
                  }`}>
                    {d.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 leading-snug" style={{ fontSize: '13px', fontWeight: 600 }}>{d.level}</p>
                    <p className="text-gray-600" style={{ fontSize: '11px' }}>{d.field}</p>
                    <p className="text-gray-400 mt-0.5" style={{ fontSize: '10px' }}>{d.school} · {d.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trayectoria profesional */}
          <div>
            <p className="text-gray-400 uppercase tracking-widest mb-3" style={{ fontSize: '10px', fontWeight: 600 }}>
              Trayectoria Profesional
            </p>
            <div className="space-y-2">
              {trajectory.map((t, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  t.current ? 'border-[#1e3a5f]/25 bg-[#1e3a5f]/5' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    t.current ? 'bg-[#1e3a5f] text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-gray-900 leading-none" style={{ fontSize: '13px', fontWeight: 600 }}>{t.role}</p>
                      {t.current && (
                        <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full" style={{ fontSize: '9px', fontWeight: 700 }}>
                          ACTUAL
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-0.5" style={{ fontSize: '11px' }}>{t.org}</p>
                    <p className="text-gray-400 mt-0.5" style={{ fontSize: '10px' }}>{t.period}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Certificate Upload Zone ──────────────── */

function UploadCertArea({ onAdd }: { onAdd: (cert: HistoricalCert) => void }) {
  const [isDragging, setIsDragging]         = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CertCategory>('Certificación');
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [fileName, setFileName]             = useState<string | null>(null);
  const [certName, setCertName]             = useState('');
  const [institution, setInstitution]       = useState('');
  const [year, setYear]                     = useState(new Date().getFullYear().toString());
  const inputRef                            = useRef<HTMLInputElement>(null);

  const handleFile = (name: string) => setFileName(name);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f.name);
  };

  const handleSubmit = () => {
    if (!fileName || !certName || !institution) return;
    onAdd({
      id: Date.now().toString(),
      name: certName,
      institution,
      year,
      category: selectedCategory,
      status: 'pendiente',
    });
    setFileName(null);
    setCertName('');
    setInstitution('');
    setYear(new Date().getFullYear().toString());
  };

  const cat = categoryConfig[selectedCategory];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-[#1e3a5f]/10 flex items-center justify-center">
          <Upload className="w-4 h-4 text-[#1e3a5f]" />
        </div>
        <div>
          <h3 className="text-gray-900 font-semibold" style={{ fontSize: '14px' }}>Agregar Documento Histórico</h3>
          <p className="text-gray-400" style={{ fontSize: '11px' }}>Sube certificados anteriores a tu expediente</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Drop zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !fileName && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl py-5 px-4 text-center transition-all cursor-pointer ${
            isDragging ? 'border-[#1e3a5f] bg-blue-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
          }`}
        >
          {fileName ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-green-800 truncate max-w-xs" style={{ fontSize: '13px', fontWeight: 500 }}>{fileName}</span>
              <button onClick={(e) => { e.stopPropagation(); setFileName(null); }} className="p-1 hover:bg-green-100 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-green-600" />
              </button>
            </div>
          ) : (
            <>
              <Upload className={`w-7 h-7 mx-auto mb-2 ${isDragging ? 'text-[#1e3a5f]' : 'text-gray-300'}`} />
              <p className="text-gray-500" style={{ fontSize: '12px', fontWeight: 500 }}>Arrastra tu archivo aquí</p>
              <p className="text-gray-400" style={{ fontSize: '11px' }}>PDF, JPG, PNG · Máx. 20 MB</p>
            </>
          )}
        </div>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.png" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0].name)} className="hidden" />

        {/* Fields row */}
        <div className="grid grid-cols-3 gap-2">
          <input
            value={certName}
            onChange={(e) => setCertName(e.target.value)}
            placeholder="Nombre del documento"
            className="col-span-3 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            style={{ fontSize: '13px' }}
          />
          <input
            value={institution}
            onChange={(e) => setInstitution(e.target.value)}
            placeholder="Institución emisora"
            className="col-span-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            style={{ fontSize: '13px' }}
          />
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Año"
            maxLength={4}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
            style={{ fontSize: '13px' }}
          />
        </div>

        {/* Category dropdown + submit */}
        <div className="flex items-center gap-2">
          {/* Dropdown */}
          <div className="relative flex-1">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
              style={{ fontSize: '13px' }}
            >
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${cat.bg} ${cat.color}`} style={{ fontSize: '11px', fontWeight: 600 }}>
                {selectedCategory}
              </span>
              <span className="text-gray-500 flex-1 text-left">Clasificación del documento</span>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                {categories.map((cat) => {
                  const cfg = categoryConfig[cat];
                  return (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`} style={{ fontSize: '11px', fontWeight: 600 }}>
                        {cat}
                      </span>
                      <span className="text-gray-700" style={{ fontSize: '12px' }}>{cat}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!fileName || !certName || !institution}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl hover:bg-[#2d5280] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            style={{ fontSize: '13px', fontWeight: 500 }}
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────── Certificates Table ───────────────────── */

function CertificatesTable({ certs, onRemove }: { certs: HistoricalCert[]; onRemove: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<CertCategory | 'Todos'>('Todos');

  const visible = certs.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.institution.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === 'Todos' || c.category === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="text-gray-900 font-semibold" style={{ fontSize: '15px' }}>Historial de Certificados</h3>
          <p className="text-gray-400" style={{ fontSize: '11px' }}>{certs.length} documentos registrados</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar documento..."
              className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f]"
              style={{ fontSize: '12px', width: '180px' }}
            />
          </div>
          {/* Category filter */}
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value as CertCategory | 'Todos')}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 focus:border-[#1e3a5f] cursor-pointer"
            style={{ fontSize: '12px' }}
          >
            <option value="Todos">Todas las categorías</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Documento', 'Institución', 'Categoría', 'Año', 'Horas', 'Estado', ''].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-gray-400 uppercase tracking-widest"
                  style={{ fontSize: '10px', fontWeight: 600 }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400" style={{ fontSize: '13px' }}>
                  No se encontraron documentos.
                </td>
              </tr>
            ) : (
              visible.map((cert, idx) => {
                const cfg = categoryConfig[cert.category];
                return (
                  <tr
                    key={cert.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors group ${idx === visible.length - 1 ? 'border-none' : ''}`}
                  >
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-gray-500" />
                        </div>
                        <span className="text-gray-900" style={{ fontSize: '13px', fontWeight: 500 }}>
                          {cert.name}
                        </span>
                      </div>
                    </td>
                    {/* Institution */}
                    <td className="px-5 py-3.5">
                      <span className="text-gray-500" style={{ fontSize: '12px' }}>{cert.institution}</span>
                    </td>
                    {/* Category badge */}
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`} style={{ fontSize: '11px', fontWeight: 600 }}>
                        {cert.category}
                      </span>
                    </td>
                    {/* Year */}
                    <td className="px-5 py-3.5">
                      <span className="text-gray-600" style={{ fontSize: '12px' }}>{cert.year}</span>
                    </td>
                    {/* Hours */}
                    <td className="px-5 py-3.5">
                      <span className="text-gray-400" style={{ fontSize: '12px' }}>
                        {cert.hours ? `${cert.hours} h` : '—'}
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {cert.status === 'validado' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full" style={{ fontSize: '11px', fontWeight: 600 }}>
                          <CheckCircle2 className="w-3 h-3" /> Validado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full" style={{ fontSize: '11px', fontWeight: 600 }}>
                          <Clock className="w-3 h-3" /> Pendiente
                        </span>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg text-[#1e3a5f] hover:bg-[#1e3a5f]/10 transition-colors" title="Descargar">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onRemove(cert.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar"
                        >
                          <X className="w-3.5 h-3.5" />
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
    </div>
  );
}

/* ──────────────────────────── Main View ────────────────────────── */

export function TeacherProfile() {
  const [certs, setCerts] = useState<HistoricalCert[]>(initialCerts);

  const addCert = (cert: HistoricalCert) => setCerts((prev) => [cert, ...prev]);
  const removeCert = (id: string) => setCerts((prev) => prev.filter((c) => c.id !== id));

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Perfil del Profesor</h1>
          <p className="text-sm text-gray-500">Resumen de CV, formación académica y certificados históricos</p>
        </div>

        {/* CV Summary card */}
        <CVSummary />

        {/* Bottom section: upload + table */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-1">
            <UploadCertArea onAdd={addCert} />
          </div>
          <div className="xl:col-span-2">
            <CertificatesTable certs={certs} onRemove={removeCert} />
          </div>
        </div>
      </div>
    </div>
  );
}
