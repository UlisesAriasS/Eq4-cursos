import { useState } from 'react';
import { FileText, User, Calendar, CheckCircle2, Clock } from 'lucide-react';

interface Request {
  id: string;
  name: string;
  type: string;
  submittedBy: string;
  role: string;
  date: string;
  status: 'Pending' | 'Reviewed';
  document: string;
}

const mockRequests: Request[] = [
  {
    id: '1',
    name: 'Certificado de Estudios',
    type: 'Certificado',
    submittedBy: 'Juan Pérez',
    role: 'Estudiante',
    date: '2026-06-03',
    status: 'Pending',
    document: 'certificado-estudios.pdf',
  },
  {
    id: '2',
    name: 'Constancia de Matrícula',
    type: 'Constancia',
    submittedBy: 'Ana Martínez',
    role: 'Estudiante',
    date: '2026-06-02',
    status: 'Pending',
    document: 'constancia-matricula.pdf',
  },
  {
    id: '3',
    name: 'Acta de Calificaciones',
    type: 'Acta',
    submittedBy: 'Prof. Carlos Ruiz',
    role: 'Docente',
    date: '2026-06-01',
    status: 'Reviewed',
    document: 'acta-calificaciones.pdf',
  },
  {
    id: '4',
    name: 'Solicitud de Beca',
    type: 'Solicitud',
    submittedBy: 'Laura González',
    role: 'Estudiante',
    date: '2026-05-30',
    status: 'Pending',
    document: 'solicitud-beca.pdf',
  },
  {
    id: '5',
    name: 'Proyecto Final',
    type: 'Proyecto',
    submittedBy: 'Miguel Torres',
    role: 'Estudiante',
    date: '2026-05-28',
    status: 'Reviewed',
    document: 'proyecto-final.pdf',
  },
];

export function DocumentValidation() {
  const [selectedRequest, setSelectedRequest] = useState<Request>(mockRequests[0]);
  const [observations, setObservations] = useState('');

  const handleApprove = () => {
    alert(`Documento "${selectedRequest.name}" aprobado con observaciones: ${observations || 'Ninguna'}`);
    setObservations('');
  };

  const handleReject = () => {
    if (!observations.trim()) {
      alert('Por favor, agregue observaciones antes de rechazar el documento.');
      return;
    }
    alert(`Documento "${selectedRequest.name}" rechazado. Motivo: ${observations}`);
    setObservations('');
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Left Side - Request List */}
      <div className="w-96 flex flex-col bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Solicitudes Pendientes</h2>
          <p className="text-sm text-gray-500 mt-1">
            {mockRequests.filter(r => r.status === 'Pending').length} documentos por revisar
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockRequests.map((request) => (
            <button
              key={request.id}
              onClick={() => setSelectedRequest(request)}
              className={`w-full p-4 border-b border-gray-100 text-left transition-colors hover:bg-gray-50 ${
                selectedRequest.id === request.id ? 'bg-blue-50 border-l-4 border-l-[#1e3a5f]' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-sm text-gray-900">{request.name}</span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'Pending'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {request.status === 'Pending' ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Pendiente
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Revisado
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                <User className="w-3 h-3" />
                <span>{request.submittedBy}</span>
                <span className="text-gray-400">•</span>
                <span>{request.role}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(request.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side - Document Preview and Actions */}
      <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{selectedRequest.name}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enviado por {selectedRequest.submittedBy} - {selectedRequest.role}
          </p>
        </div>

        {/* Document Preview Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="w-full h-full bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium mb-2">Vista previa del documento</p>
              <p className="text-sm text-gray-500">{selectedRequest.document}</p>
              <p className="text-xs text-gray-400 mt-4">
                La visualización de PDF se implementará con un visor de documentos
              </p>
            </div>
          </div>
        </div>

        {/* Observations and Action Buttons */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <label htmlFor="observations" className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={4}
              placeholder="Agregue comentarios, observaciones o motivos de rechazo..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent resize-none"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleReject}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Rechazar
            </button>
            <button
              onClick={handleApprove}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
