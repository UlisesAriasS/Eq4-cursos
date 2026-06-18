import { Upload, Award, ExternalLink } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  groupName: string;
  progress: number;
  semester: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  icon: string;
  color: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Sistema de Gestión Hospitalaria',
    groupName: 'Grupo Alpha',
    progress: 75,
    semester: '2026-I',
  },
  {
    id: '2',
    title: 'Plataforma E-Commerce',
    groupName: 'Grupo Beta',
    progress: 60,
    semester: '2026-I',
  },
  {
    id: '3',
    title: 'App de Delivery IoT',
    groupName: 'Grupo Gamma',
    progress: 45,
    semester: '2026-I',
  },
  {
    id: '4',
    title: 'Sistema de Control Académico',
    groupName: 'Grupo Delta',
    progress: 90,
    semester: '2026-I',
  },
  {
    id: '5',
    title: 'Red Social Educativa',
    groupName: 'Grupo Epsilon',
    progress: 30,
    semester: '2026-I',
  },
  {
    id: '6',
    title: 'Dashboard Analítico BI',
    groupName: 'Grupo Zeta',
    progress: 55,
    semester: '2026-I',
  },
];

const mockCertifications: Certification[] = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2025-03-15',
    icon: '☁️',
    color: '#FF9900',
  },
  {
    id: '2',
    name: 'CCNA: Enterprise Networking',
    issuer: 'Cisco Systems',
    date: '2024-11-20',
    icon: '🌐',
    color: '#1BA0D7',
  },
  {
    id: '3',
    name: 'Google Cloud Professional',
    issuer: 'Google Cloud',
    date: '2025-08-10',
    icon: '☁️',
    color: '#4285F4',
  },
  {
    id: '4',
    name: 'Microsoft Azure Administrator',
    issuer: 'Microsoft',
    date: '2024-06-05',
    icon: '⚡',
    color: '#0078D4',
  },
];

export function TeacherDashboard() {
  const handleUploadMaterial = (projectId: string, projectTitle: string) => {
    alert(`Subir material para: ${projectTitle}`);
  };

  const handleRequestValidation = (certId: string, certName: string) => {
    alert(`Solicitar validación para: ${certName}`);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Projects Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Mis Proyectos Integradores</h1>
            <p className="text-sm text-gray-600">
              Gestiona los proyectos de tus estudiantes y sube material educativo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-3">
                    {project.semester}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.groupName}</p>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progreso</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#1e3a5f] h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <button
                  onClick={() => handleUploadMaterial(project.id, project.title)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e3a5f] text-white rounded-lg font-medium hover:bg-[#2d5280] transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  Subir Material
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div className="pb-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Mis Certificaciones</h2>
            <p className="text-sm text-gray-600">
              Tus certificaciones tecnológicas verificadas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCertifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${cert.color}15` }}
                  >
                    {cert.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{cert.name}</h3>
                    <p className="text-xs text-gray-600 mb-1">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">
                      Obtenido: {new Date(cert.date).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRequestValidation(cert.id, cert.name)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Award className="w-4 h-4" />
                    Solicitar Validación
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Agregar Nueva Certificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
