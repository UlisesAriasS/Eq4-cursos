import { useState } from 'react';
import { Upload, FileText, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

interface Stage {
  id: string;
  name: string;
  status: 'completed' | 'active' | 'pending';
}

interface Feedback {
  id: string;
  author: string;
  date: string;
  message: string;
  type: 'info' | 'warning' | 'success';
}

const stages: Stage[] = [
  { id: '1', name: 'Planeación', status: 'completed' },
  { id: '2', name: 'Desarrollo', status: 'active' },
  { id: '3', name: 'Revisión', status: 'pending' },
];

const mockFeedback: Feedback[] = [
  {
    id: '1',
    author: 'Prof. Carlos Ruiz',
    date: '2026-06-04',
    message: 'Excelente avance en la documentación técnica. Por favor, incluir diagramas de arquitectura en la siguiente entrega.',
    type: 'success',
  },
  {
    id: '2',
    author: 'Prof. Carlos Ruiz',
    date: '2026-06-02',
    message: 'Recordar que la fecha límite para la entrega de la fase de desarrollo es el 10 de junio.',
    type: 'warning',
  },
  {
    id: '3',
    author: 'Sistema',
    date: '2026-06-01',
    message: 'Tu documento ha sido recibido correctamente y está en proceso de revisión.',
    type: 'info',
  },
];

export function StudentProject() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0].name);
    }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Proyecto Integrador</h1>
          <p className="text-sm text-gray-600">Sistema de Gestión Hospitalaria - Grupo Alpha</p>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between relative">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex-1 flex flex-col items-center relative z-10">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                      stage.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : stage.status === 'active'
                        ? 'bg-[#1e3a5f] text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {stage.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : stage.status === 'active' ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      <AlertCircle className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      stage.status === 'pending' ? 'text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {stage.name}
                  </span>
                </div>
                {index < stages.length - 1 && (
                  <div
                    className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 ${
                      stages[index + 1].status === 'completed' || stages[index].status === 'completed'
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upload Zone - Takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cargar Evidencia</h2>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 transition-all ${
                  isDragging
                    ? 'border-[#1e3a5f] bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="mb-4">
                    <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Arrastra tu archivo aquí
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    o haz clic para seleccionar un archivo PDF
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-block px-6 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium cursor-pointer hover:bg-[#2d5280] transition-colors"
                  >
                    Seleccionar Archivo
                  </label>
                  <p className="text-xs text-gray-500 mt-4">
                    Formato permitido: PDF • Tamaño máximo: 10MB
                  </p>
                </div>
              </div>

              {uploadedFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900">{uploadedFile}</p>
                    <p className="text-xs text-green-700">Archivo cargado correctamente</p>
                  </div>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    Enviar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status and Feedback Card - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado Actual</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Estado:</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    En Revisión
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Última Entrega:</div>
                  <div className="text-sm font-medium text-gray-900">03 de junio, 2026</div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-1">Próxima Fecha Límite:</div>
                  <div className="text-sm font-medium text-gray-900">10 de junio, 2026</div>
                </div>
              </div>
            </div>

            {/* Feedback Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-gray-700" />
                <h3 className="text-lg font-semibold text-gray-900">Observaciones</h3>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {mockFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`p-4 rounded-lg border ${
                      feedback.type === 'success'
                        ? 'bg-green-50 border-green-200'
                        : feedback.type === 'warning'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{feedback.author}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
