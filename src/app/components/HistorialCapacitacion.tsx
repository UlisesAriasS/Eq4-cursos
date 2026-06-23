import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle2, Clock, XCircle, Award, Filter, Search } from 'lucide-react';
import { api, HistorialItem } from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ── Badge de estatus ───────────────────────────────────────────────────── */
function EstatusBadge({ estatus }: { estatus: HistorialItem['estatus'] }) {
  const cfg = {
    Aprobado:  { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2,  label: 'Aprobado'  },
    Inscrito:  { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   icon: Clock,         label: 'Inscrito'  },
    Reprobado: { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     icon: XCircle,       label: 'Reprobado' },
  }[estatus];

  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

/* ── Tarjeta de estadísticas ────────────────────────────────────────────── */
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 flex flex-col gap-1 shadow-sm`}>
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  );
}

/* ── Componente principal ───────────────────────────────────────────────── */
export function HistorialCapacitacion() {
  const { docente } = useAuth();
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [filtroEstatus, setFiltroEstatus] = useState<string>('Todos');
  const [busqueda, setBusqueda]   = useState('');

  useEffect(() => {
    if (!docente) return;
    setLoading(true);
    api.getHistorial(docente.usuario_id)
      .then(data => setHistorial(data.registros))
      .catch(err  => setError(err.message))
      .finally(()  => setLoading(false));
  }, [docente]);

  /* Estadísticas */
  const total     = historial.length;
  const aprobados = historial.filter(h => h.estatus === 'Aprobado').length;
  const inscritos = historial.filter(h => h.estatus === 'Inscrito').length;
  const reprobados= historial.filter(h => h.estatus === 'Reprobado').length;
  const totalHoras= historial
    .filter(h => h.estatus === 'Aprobado')
    .reduce((acc, h) => acc + h.horas, 0);

  /* Filtrado */
  const filtrado = historial.filter(h => {
    const matchEstatus = filtroEstatus === 'Todos' || h.estatus === filtroEstatus;
    const matchBusqueda = h.nombre_curso.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstatus && matchBusqueda;
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Cargando historial…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center bg-red-50 border border-red-200 rounded-2xl p-8">
          <XCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 overflow-y-auto pb-6">

      {/* Header de la sección */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Mi Capacitación</h1>
          <p className="text-sm text-gray-500 mt-1">
            Historial de cursos y certificaciones · {total} registros
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
          <Award className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">{totalHoras} hrs aprobadas</span>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total de cursos"  value={total}     color="#6366f1" />
        <StatCard label="Aprobados"        value={aprobados} color="#10b981" />
        <StatCard label="En curso"         value={inscritos} color="#f59e0b" />
        <StatCard label="Reprobados"       value={reprobados}color="#ef4444" />
      </div>

      {/* Barra de filtros */}
      <div className="flex items-center gap-3">
        {/* Buscador */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar curso…"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
          />
        </div>

        {/* Filtro de estatus */}
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <Filter className="w-3.5 h-3.5 text-gray-400 ml-2" />
          {['Todos', 'Aprobado', 'Inscrito', 'Reprobado'].map(est => (
            <button
              key={est}
              onClick={() => setFiltroEstatus(est)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filtroEstatus === est
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {est}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de cursos */}
      {filtrado.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200 p-12">
          <BookOpen className="w-12 h-12" strokeWidth={1.2} />
          <p className="text-sm font-medium">No se encontraron cursos con ese filtro</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3.5">Curso / Certificación</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5">Tipo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5">Horas</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5">Estatus</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3.5">Conclusión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtrado.map((item, i) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Nombre del curso */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                      </div>
                      <span className="font-medium text-gray-900">{item.nombre_curso}</span>
                    </div>
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-4">
                    <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                      {item.tipo_curso}
                    </span>
                  </td>

                  {/* Horas */}
                  <td className="px-4 py-4">
                    <span className="font-semibold text-gray-700">{item.horas}</span>
                    <span className="text-gray-400 ml-1 text-xs">hrs</span>
                  </td>

                  {/* Estatus */}
                  <td className="px-4 py-4">
                    <EstatusBadge estatus={item.estatus} />
                  </td>

                  {/* Fecha */}
                  <td className="px-4 py-4 text-gray-500">
                    {item.fecha_conclusion
                      ? new Date(item.fecha_conclusion + 'T00:00:00').toLocaleDateString('es-MX', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        })
                      : <span className="text-gray-300 italic text-xs">En progreso</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
