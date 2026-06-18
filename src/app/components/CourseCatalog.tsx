import { useState } from 'react';
import {
  Search,
  Clock,
  User,
  Monitor,
  MapPin,
  Shuffle,
  CheckCircle2,
  Download,
  BookOpen,
  ChevronRight,
  Award,
  Users,
  BarChart2,
} from 'lucide-react';
import { CourseDetailPanel } from './CourseDetailPanel';

type CourseStatus = 'available' | 'enrolled' | 'completed';
type FilterTab = 'all' | 'available' | 'enrolled';

interface Course {
  id: string;
  name: string;
  instructor: string;
  modality: 'Presencial' | 'Virtual' | 'Mixta';
  hours: number;
  category: string;
  status: CourseStatus;
  progress?: number;
  requirements?: string[];
  finalGrade?: string;
  enrolledCount: number;
}

const courses: Course[] = [
  {
    id: '1',
    name: 'Fundamentos de Redes Cisco',
    instructor: 'Ing. Roberto Vázquez',
    modality: 'Presencial',
    hours: 60,
    category: 'Infraestructura',
    status: 'available',
    requirements: ['Cupo disponible (5 lugares)', 'Sin curso previo requerido', 'Laptop con acceso a Packet Tracer'],
    enrolledCount: 19,
  },
  {
    id: '2',
    name: 'Desarrollo con FastAPI',
    instructor: 'Dra. Ana Morales',
    modality: 'Virtual',
    hours: 40,
    category: 'Desarrollo Web',
    status: 'enrolled',
    progress: 65,
    enrolledCount: 32,
  },
  {
    id: '3',
    name: 'Introducción a la Ciberseguridad',
    instructor: 'Prof. Luis Hernández',
    modality: 'Mixta',
    hours: 80,
    category: 'Seguridad',
    status: 'completed',
    finalGrade: '9.4',
    enrolledCount: 24,
  },
];

const modalityConfig: Record<
  Course['modality'],
  { icon: React.ReactNode; color: string }
> = {
  Presencial: {
    icon: <MapPin className="w-3 h-3" />,
    color: 'bg-orange-100 text-orange-700',
  },
  Virtual: {
    icon: <Monitor className="w-3 h-3" />,
    color: 'bg-blue-100 text-blue-700',
  },
  Mixta: {
    icon: <Shuffle className="w-3 h-3" />,
    color: 'bg-purple-100 text-purple-700',
  },
};

const categoryColors: Record<string, string> = {
  Infraestructura: 'bg-amber-50 text-amber-700',
  'Desarrollo Web': 'bg-sky-50 text-sky-700',
  Seguridad: 'bg-rose-50 text-rose-700',
};

export function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');
  const [openCourse, setOpenCourse] = useState<Course | null>(null);

  const filtered = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase());
    if (filter === 'available') return matchesSearch && c.status === 'available';
    if (filter === 'enrolled') return matchesSearch && (c.status === 'enrolled' || c.status === 'completed');
    return matchesSearch;
  });

  const counts = {
    all: courses.length,
    available: courses.filter((c) => c.status === 'available').length,
    enrolled: courses.filter((c) => c.status === 'enrolled' || c.status === 'completed').length,
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Catálogo de Cursos</h1>
          <p className="text-sm text-gray-500">
            Explora los cursos disponibles e inscríbete o continúa tu aprendizaje
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Cursos disponibles', value: counts.available, icon: <BookOpen className="w-5 h-5 text-[#1e3a5f]" />, bg: 'bg-blue-50' },
            { label: 'En progreso', value: courses.filter(c => c.status === 'enrolled').length, icon: <BarChart2 className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
            { label: 'Completados', value: courses.filter(c => c.status === 'completed').length, icon: <Award className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500" style={{ fontSize: '12px' }}>{stat.label}</p>
                <p className="text-gray-900" style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre de curso o instructor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30 focus:border-[#1e3a5f]"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shrink-0">
            {(
              [
                { key: 'all', label: 'Todos' },
                { key: 'available', label: 'Disponibles' },
                { key: 'enrolled', label: 'Mis Cursos' },
              ] as { key: FilterTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  filter === tab.key
                    ? 'bg-[#1e3a5f] text-white font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-xs ${
                    filter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {counts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Course grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500">No se encontraron cursos con esos criterios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onOpenDetail={() => course.status === 'enrolled' && setOpenCourse(course)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Slide-over detail panel */}
      {openCourse && (
        <CourseDetailPanel
          course={openCourse}
          onClose={() => setOpenCourse(null)}
        />
      )}
    </div>
  );
}

/* ─── CourseCard ─────────────────────────────────────────── */

function CourseCard({
  course,
  onOpenDetail,
}: {
  course: Course;
  onOpenDetail: () => void;
}) {
  const modality = modalityConfig[course.modality];
  const isCompleted = course.status === 'completed';
  const isEnrolled = course.status === 'enrolled';
  const isAvailable = course.status === 'available';

  return (
    <div
      className={`bg-white rounded-xl border flex flex-col overflow-hidden transition-shadow hover:shadow-md ${
        isCompleted ? 'border-green-300' : 'border-gray-200'
      }`}
    >
      {/* Card top accent strip */}
      <div
        className={`h-1.5 w-full ${
          isCompleted ? 'bg-green-500' : isEnrolled ? 'bg-[#1e3a5f]' : 'bg-gray-200'
        }`}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Top badges row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
              categoryColors[course.category] ?? 'bg-gray-100 text-gray-600'
            }`}
          >
            {course.category}
          </span>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Acreditado
            </span>
          )}
          {isEnrolled && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              En progreso
            </span>
          )}
        </div>

        {/* Course name */}
        <h3 className="text-gray-900 font-semibold leading-snug mb-1" style={{ fontSize: '15px' }}>
          {course.name}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-1.5 text-gray-500 mb-4" style={{ fontSize: '12px' }}>
          <User className="w-3.5 h-3.5 shrink-0" />
          {course.instructor}
        </div>

        {/* Modality + Hours badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${modality.color}`}>
            {modality.icon}
            {course.modality}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
            <Clock className="w-3 h-3" />
            {course.hours} hrs
          </span>
          <span className="inline-flex items-center gap-1 ml-auto px-2 py-1 rounded-lg bg-gray-50 text-gray-500 text-xs">
            <Users className="w-3 h-3" />
            {course.enrolledCount}
          </span>
        </div>

        {/* ── STATUS-SPECIFIC CONTENT ── */}

        {/* Available: requirements */}
        {isAvailable && course.requirements && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100 flex-1">
            <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Requisitos
            </p>
            <ul className="space-y-1.5">
              {course.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1e3a5f]/40 shrink-0" />
                  <span className="text-gray-700" style={{ fontSize: '12px' }}>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Enrolled: progress bar */}
        {isEnrolled && course.progress !== undefined && (
          <div className="mb-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">Avance del curso</span>
              <span className="text-xs font-semibold text-[#1e3a5f]">{course.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
              <div
                className="bg-[#1e3a5f] h-2 rounded-full transition-all"
                style={{ width: `${course.progress}%` }}
              />
            </div>
            {/* Milestone markers */}
            <div className="flex justify-between">
              {[25, 50, 75, 100].map((pct) => (
                <div key={pct} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      course.progress! >= pct ? 'bg-[#1e3a5f]' : 'bg-gray-200'
                    }`}
                  />
                  <span className="text-gray-400" style={{ fontSize: '10px' }}>{pct}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completed: grade display */}
        {isCompleted && (
          <div className="mb-4 flex-1 flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-800 font-semibold" style={{ fontSize: '13px' }}>
                Curso completado
              </p>
              {course.finalGrade && (
                <p className="text-green-600" style={{ fontSize: '12px' }}>
                  Calificación final:{' '}
                  <span className="font-bold" style={{ fontSize: '14px' }}>{course.finalGrade}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── CTA Button ── */}
        {isAvailable && (
          <button className="w-full py-2.5 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2d5280] transition-colors">
            Solicitar Inscripción
          </button>
        )}

        {isEnrolled && (
          <button
            onClick={onOpenDetail}
            className="w-full py-2.5 bg-white border border-[#1e3a5f] text-[#1e3a5f] rounded-lg text-sm font-medium hover:bg-[#1e3a5f]/5 transition-colors flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Ver Materiales y Actividades
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        )}

        {isCompleted && (
          <button className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Descargar Constancia
          </button>
        )}
      </div>
    </div>
  );
}
