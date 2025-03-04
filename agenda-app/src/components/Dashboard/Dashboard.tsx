import React from 'react'
import { 
  FiCalendar, FiUsers, FiCheckSquare, FiBriefcase, 
  FiPieChart, FiBarChart2, FiClock
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

// Componente para tarjetas de resumen
interface TarjetaResumenProps {
  titulo: string
  valor: string | number
  icono: React.ReactNode
  color: string
  descripcion?: string
}

const TarjetaResumen: React.FC<TarjetaResumenProps> = ({ 
  titulo, 
  valor, 
  icono, 
  color,
  descripcion 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-full p-3 ${color}`}>
          {icono}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{titulo}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">{valor}</p>
            {descripcion && (
              <p className="ml-2 text-sm text-gray-500 dark:text-gray-400">{descripcion}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para gráficos
interface GraficoProps {
  titulo: string
  children: React.ReactNode
}

const Grafico: React.FC<GraficoProps> = ({ titulo, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{titulo}</h3>
      <div className="h-64">
        {children}
      </div>
    </div>
  )
}

// Componente para actividades recientes
interface ActividadRecienteProps {
  titulo: string
  fecha: string
  estado: 'completada' | 'pendiente' | 'en-progreso'
  tipo: string
}

const ActividadReciente: React.FC<ActividadRecienteProps> = ({ 
  titulo, 
  fecha, 
  estado, 
  tipo 
}) => {
  const getEstadoColor = () => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'en-progreso':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getTipoIcon = () => {
    switch (tipo) {
      case 'proyecto':
        return <FiBriefcase className="h-4 w-4" />
      case 'actividad':
        return <FiCalendar className="h-4 w-4" />
      case 'asignacion':
        return <FiCheckSquare className="h-4 w-4" />
      default:
        return <FiClock className="h-4 w-4" />
    }
  }

  return (
    <div className="flex items-center py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
      <div className="flex-shrink-0 mr-3">
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
          {getTipoIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {titulo}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {fecha}
        </p>
      </div>
      <div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor()}`}>
          {estado === 'completada' ? 'Completada' : 
           estado === 'pendiente' ? 'Pendiente' : 'En progreso'}
        </span>
      </div>
    </div>
  )
}

// Componente principal del Dashboard
const Dashboard: React.FC = () => {
  const { usuario } = useAuth()
  
  // Datos de ejemplo para el dashboard
  const actividadesRecientes = [
    { 
      id: 1, 
      titulo: 'Informe mensual de actividades', 
      fecha: '4 mar 2025, 09:30', 
      estado: 'completada' as const, 
      tipo: 'actividad' 
    },
    { 
      id: 2, 
      titulo: 'Reunión con equipo de desarrollo', 
      fecha: '3 mar 2025, 15:00', 
      estado: 'completada' as const, 
      tipo: 'actividad' 
    },
    { 
      id: 3, 
      titulo: 'Proyecto de modernización de sistemas', 
      fecha: '5 mar 2025, 10:00', 
      estado: 'pendiente' as const, 
      tipo: 'proyecto' 
    },
    { 
      id: 4, 
      titulo: 'Revisión de código con equipo', 
      fecha: '4 mar 2025, 14:30', 
      estado: 'en-progreso' as const, 
      tipo: 'asignacion' 
    },
  ]

  // Datos de ejemplo para tarjetas de resumen
  const tarjetasResumen = [
    {
      id: 1,
      titulo: 'Actividades Hoy',
      valor: 5,
      icono: <FiCalendar className="h-6 w-6 text-blue-500" />,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      descripcion: '2 pendientes'
    },
    {
      id: 2,
      titulo: 'Proyectos Activos',
      valor: 3,
      icono: <FiBriefcase className="h-6 w-6 text-purple-500" />,
      color: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      id: 3,
      titulo: 'Tareas Completadas',
      valor: 12,
      icono: <FiCheckSquare className="h-6 w-6 text-green-500" />,
      color: 'bg-green-100 dark:bg-green-900/30',
      descripcion: 'Esta semana'
    },
    {
      id: 4,
      titulo: usuario?.rol === 'supervisor' ? 'Funcionarios' : 'Asignaciones',
      valor: usuario?.rol === 'supervisor' ? 8 : 4,
      icono: usuario?.rol === 'supervisor' 
        ? <FiUsers className="h-6 w-6 text-orange-500" />
        : <FiCheckSquare className="h-6 w-6 text-orange-500" />,
      color: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Bienvenido, {usuario?.nombres?.split(' ')[0]}. Aquí tienes un resumen de tus actividades.
        </p>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {tarjetasResumen.map(tarjeta => (
          <TarjetaResumen 
            key={tarjeta.id}
            titulo={tarjeta.titulo}
            valor={tarjeta.valor}
            icono={tarjeta.icono}
            color={tarjeta.color}
            descripcion={tarjeta.descripcion}
          />
        ))}
      </div>

      {/* Gráficos y estadísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Grafico titulo="Actividades por Semana">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiBarChart2 className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Los gráficos de actividades estarán disponibles próximamente
              </p>
            </div>
          </div>
        </Grafico>
        
        <Grafico titulo="Distribución de Proyectos">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <FiPieChart className="h-16 w-16 mx-auto text-gray-300 dark:text-gray-600" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Las estadísticas de proyectos estarán disponibles próximamente
              </p>
            </div>
          </div>
        </Grafico>
      </div>

      {/* Actividades recientes y progreso */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Actividades Recientes</h3>
          <div>
            {actividadesRecientes.map(actividad => (
              <ActividadReciente 
                key={actividad.id}
                titulo={actividad.titulo}
                fecha={actividad.fecha}
                estado={actividad.estado}
                tipo={actividad.tipo}
              />
            ))}
          </div>
          <div className="mt-4">
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              Ver todas las actividades
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Progreso de Proyectos</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Modernización de Sistemas</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">45%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Implementación API REX</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">30%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-purple-600 dark:bg-purple-500 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Actualización de Interfaz</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">80%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              Ver todos los proyectos
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
