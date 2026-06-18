import { useState } from 'react';
import { FileText, Upload, CheckCircle2, XCircle, Eye, RotateCcw, BookOpen } from 'lucide-react';
import { ProjectStatusStepper } from './ProjectStatusStepper';
import { CertificatePreviewModal } from './CertificatePreviewModal';

interface Material {
  name: string;
  size: string;
  type: string;
}

interface Project {
  id: string;
  title: string;
  semester: string;
  group: string;
  status: 'approved' | 'rejected';
  materials: Material[];
  stepperStep: number;
  dictamen: string;
  observations: string[];
  teacher: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'Sistema de Gestión Hospitalaria',
    semester: '2026-I',
    group: 'Grupo Alpha',
    status: 'approved',
    materials: [
      { name: 'Manual_Tecnico_v3.pdf', size: '2.4 MB', type: 'pdf' },
      { name: 'Presentacion_Final.pptx', size: '8.1 MB', type: 'pptx' },
      { name: 'Codigo_Fuente.zip', size: '15.3 MB', type: 'zip' },
    ],
    stepperStep: 3,
    dictamen:
      'El proyecto cumple con todos los requerimientos establecidos en el programa. La documentación técnica es completa y el código fuente fue revisado satisfactoriamente.',
    observations: [
      'Excelente trabajo en equipo. La documentación técnica supera las expectativas del programa.',
      'Los diagramas de arquitectura y el manual de usuario están muy bien estructurados.',
      'El sistema demuestra un alto nivel de madurez en el diseño de base de datos y la lógica de negocio.',
    ],
    teacher: 'Prof. Carlos Ruiz',
  },
  {
    id: '2',
    title: 'Plataforma E-Commerce Educativo',
    semester: '2026-I',
    group: 'Grupo Beta',
    status: 'rejected',
    materials: [
      { name: 'Manual_Usuario_v1.pdf', size: '1.8 MB', type: 'pdf' },
      { name: 'Propuesta_Tecnica.docx', size: '0.9 MB', type: 'docx' },
    ],
    stepperStep: 3,
    dictamen:
      'El proyecto presenta deficiencias en los capítulos 3 y 5. Se requieren correcciones antes de la segunda evaluación.',
    observations: [
      'Sección 3 (Arquitectura del sistema): Debe incluir diagrama de componentes y diagrama de despliegue.',
      'Sección 5 (Pruebas): Agregar mínimo 15 casos de prueba unitarios con evidencia de ejecución.',
      'El manual de usuario no cubre los flujos de error. Debe documentarse el manejo de excepciones.',
    ],
    teacher: 'Prof. Ana Morales',
  },
];

const fileIconColor: Record<string, string> = {
  pdf: 'text-red-500',
  pptx: 'text-orange-500',
  zip: 'text-purple-500',
  docx: 'text-blue-500',
};

export function StudentProjects() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Mis Proyectos Integradores
            </h1>
            <p className="text-sm text-gray-600">
              Seguimiento y gestión de tus proyectos del semestre
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f]/10 text-[#1e3a5f] rounded-full text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            2 proyectos activos
          </span>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map((project) => {
            const isApproved = project.status === 'approved';

            return (
              <div
                key={project.id}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col border-l-4 ${
                  isApproved ? 'border-l-green-500' : 'border-l-red-500'
                }`}
              >
                {/* Card header */}
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="font-semibold text-gray-900 leading-snug">
                        {project.title}
                      </h2>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {project.group}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {project.semester}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isApproved
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isApproved ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        {isApproved ? 'Aprobado' : 'Rechazado'}
                      </span>
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Materiales Entregados
                    </p>
                    <div className="space-y-1.5">
                      {project.materials.map((mat) => (
                        <div
                          key={mat.name}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <FileText
                            className={`w-4 h-4 shrink-0 ${
                              fileIconColor[mat.type] ?? 'text-gray-400'
                            }`}
                          />
                          <span className="text-sm text-gray-700 flex-1 truncate">{mat.name}</span>
                          <span className="text-xs text-gray-400 shrink-0">{mat.size}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stepper section */}
                <div className="p-5 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-4">
                    Estado del Trámite
                  </p>
                  <ProjectStatusStepper
                    currentStep={project.stepperStep}
                    finalStatus={project.status}
                    dictamen={project.dictamen}
                  />
                </div>

                {/* Observations */}
                <div className="p-5 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Observaciones {isApproved ? 'del Docente' : '— Puntos a Corregir'}
                  </p>
                  <div
                    className={`rounded-lg border p-3 space-y-2 ${
                      isApproved
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      {project.teacher}
                    </p>
                    {project.observations.map((obs, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                            isApproved ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <p
                          className={`text-sm leading-relaxed ${
                            isApproved ? 'text-green-800' : 'text-red-800'
                          }`}
                        >
                          {obs}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card footer action */}
                <div className="px-5 pb-5">
                  {isApproved ? (
                    <button
                      onClick={() => setModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d5280] transition-colors text-sm font-medium"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Constancia
                    </button>
                  ) : (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      Volver a Entregar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <CertificatePreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        studentName="María García López"
        matricula="2023-10045"
        courseName="Sistema de Gestión Hospitalaria"
        period="Enero – Junio 2026"
      />
    </div>
  );
}
