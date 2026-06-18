import { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  BookOpen,
  Video,
  FileCheck,
} from 'lucide-react';

interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'guide' | 'exercise';
  size: string;
  available: boolean;
}

interface Course {
  id: string;
  name: string;
  instructor: string;
  progress: number;
}

interface CourseDetailPanelProps {
  course: Course;
  onClose: () => void;
}

const materials: Material[] = [
  { id: '1', name: 'Guía de instalación del entorno.pdf', type: 'pdf', size: '1.2 MB', available: true },
  { id: '2', name: 'Módulo 1 – Introducción a FastAPI.pdf', type: 'pdf', size: '3.4 MB', available: true },
  { id: '3', name: 'Video: Creación de endpoints REST', type: 'video', size: '145 MB', available: true },
  { id: '4', name: 'Módulo 2 – Autenticación y Seguridad.pdf', type: 'pdf', size: '2.1 MB', available: true },
  { id: '5', name: 'Práctica 1 – CRUD completo.pdf', type: 'exercise', size: '0.8 MB', available: true },
  { id: '6', name: 'Módulo 3 – Despliegue en producción.pdf', type: 'pdf', size: '2.9 MB', available: false },
];

const materialIcon = (type: Material['type']) => {
  switch (type) {
    case 'video': return <Video className="w-4 h-4 text-purple-500" />;
    case 'exercise': return <FileCheck className="w-4 h-4 text-orange-500" />;
    case 'guide': return <BookOpen className="w-4 h-4 text-blue-500" />;
    default: return <FileText className="w-4 h-4 text-red-500" />;
  }
};

export function CourseDetailPanel({ course, onClose }: CourseDetailPanelProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).map((f) => f.name);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map((f) => f.name);
      setUploadedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f !== name));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-50 shadow-2xl flex flex-col">
        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 bg-[#1e3a5f] shrink-0">
          <div>
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-0.5">
              Detalle del Curso
            </p>
            <h2 className="text-white font-semibold leading-snug" style={{ fontSize: '15px' }}>
              {course.name}
            </h2>
            <p className="text-blue-300 mt-0.5" style={{ fontSize: '12px' }}>
              {course.instructor}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-blue-200 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso general</span>
            <span className="text-sm font-semibold text-[#1e3a5f]">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#1e3a5f] h-2.5 rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Materials section */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#1e3a5f]" />
              Materiales y Actividades
            </h3>
            <div className="space-y-2">
              {materials.map((mat) => (
                <div
                  key={mat.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    mat.available
                      ? 'border-gray-200 bg-white hover:border-[#1e3a5f]/30 hover:bg-blue-50/40'
                      : 'border-gray-100 bg-gray-50 opacity-50'
                  }`}
                >
                  <div className="shrink-0">{materialIcon(mat.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug truncate ${
                        mat.available ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {mat.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{mat.size}</p>
                  </div>
                  {mat.available ? (
                    <button className="shrink-0 p-1.5 text-[#1e3a5f] hover:bg-[#1e3a5f]/10 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="shrink-0 flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      Próximamente
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Evidence upload section */}
          <div className="px-6 py-5">
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#1e3a5f]" />
              Cargar Evidencias
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Sube tus prácticas, reportes y capturas de pantalla en formato PDF, JPG o PNG.
            </p>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                isDragging
                  ? 'border-[#1e3a5f] bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors ${
                  isDragging ? 'bg-[#1e3a5f]/10' : 'bg-gray-200'
                }`}
              >
                <Upload
                  className={`w-6 h-6 transition-colors ${
                    isDragging ? 'text-[#1e3a5f]' : 'text-gray-400'
                  }`}
                />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                {isDragging ? 'Suelta el archivo aquí' : 'Arrastra tus archivos aquí'}
              </p>
              <p className="text-xs text-gray-500 mb-4">o haz clic para seleccionar</p>
              <input
                type="file"
                id="evidence-upload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label
                htmlFor="evidence-upload"
                className="inline-block px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-[#2d5280] transition-colors"
              >
                Seleccionar Archivos
              </label>
              <p className="text-xs text-gray-400 mt-3">
                PDF, JPG, PNG · Máx. 10 MB por archivo
              </p>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                  Archivos listos para enviar
                </p>
                {uploadedFiles.map((name, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    <span className="text-sm text-green-900 flex-1 truncate">{name}</span>
                    <button
                      onClick={() => removeFile(name)}
                      className="text-green-500 hover:text-green-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button className="w-full mt-2 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Enviar Evidencias ({uploadedFiles.length})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
