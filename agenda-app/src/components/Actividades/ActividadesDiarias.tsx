import React, { useState } from 'react';
import { FiCalendar, FiClock, FiBriefcase, FiCheck, FiPlus } from 'react-icons/fi';
import TituloPagina from '../UI/TituloPagina';

// Tipo para las actividades diarias
interface ActividadDiaria {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  proyecto: string;
  descripcion: string;
  estado: 'pendiente' | 'completada';
}

const ActividadesDiarias: React.FC = () => {
  // Estado para las actividades diarias (simuladas por ahora)
  const [actividades, setActividades] = useState<ActividadDiaria[]>([
    {
      id: '1',
      fecha: '2023-06-10',
      horaInicio: '09:00',
      horaFin: '11:00',
      proyecto: 'Proyecto REX',
      descripcion: 'Desarrollo de interfaz de usuario',
      estado: 'completada'
    },
    {
      id: '2',
      fecha: '2023-06-10',
      horaInicio: '11:30',
      horaFin: '13:00',
      proyecto: 'Sistema de Gestión',
      descripcion: 'Reunión con stakeholders',
      estado: 'completada'
    },
    {
      id: '3',
      fecha: '2023-06-10',
      horaInicio: '14:00',
      horaFin: '17:00',
      proyecto: 'Proyecto REX',
      descripcion: 'Implementación de API',
      estado: 'pendiente'
    }
  ]);

  // Estado para la fecha seleccionada
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Filtrar actividades por fecha
  const actividadesFiltradas = actividades.filter(
    actividad => actividad.fecha === fechaSeleccionada
  );

  // Función para cambiar el estado de una actividad
  const toggleEstadoActividad = (id: string) => {
    setActividades(prevActividades =>
      prevActividades.map(actividad =>
        actividad.id === id
          ? {
              ...actividad,
              estado: actividad.estado === 'pendiente' ? 'completada' : 'pendiente'
            }
          : actividad
      )
    );
  };

  // Calcular horas totales trabajadas
  const horasTotales = actividadesFiltradas.reduce((total, actividad) => {
    if (actividad.estado === 'completada') {
      const inicio = new Date(`2000-01-01T${actividad.horaInicio}`);
      const fin = new Date(`2000-01-01T${actividad.horaFin}`);
      const diff = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
      return total + diff;
    }
    return total;
  }, 0);

  return (
    <div>
      <TituloPagina titulo="Actividades Diarias" />
      
      {/* Encabezado y controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Actividades Diarias</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Registro y seguimiento de tus actividades diarias
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={fechaSeleccionada}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
      
      {/* Resumen */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center p-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
              <FiClock className="text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Horas Trabajadas</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{horasTotales.toFixed(1)}h</p>
            </div>
          </div>
          
          <div className="flex items-center p-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-4">
              <FiCheck className="text-green-600 dark:text-green-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Actividades Completadas</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {actividadesFiltradas.filter(a => a.estado === 'completada').length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center p-3">
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full mr-4">
              <FiBriefcase className="text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Proyectos Activos</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">
                {new Set(actividadesFiltradas.map(a => a.proyecto)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de actividades */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Actividades del día</h2>
          <button className="flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
            <FiPlus className="mr-1" /> Agregar actividad
          </button>
        </div>
        
        {actividadesFiltradas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No hay actividades registradas para esta fecha</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600">
              <FiPlus className="mr-2" /> Registrar nueva actividad
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {actividadesFiltradas.map((actividad) => (
              <li key={actividad.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        actividad.estado === 'completada' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></span>
                      <h3 className="text-base font-medium text-gray-800 dark:text-white">{actividad.descripcion}</h3>
                    </div>
                    <div className="flex flex-wrap text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span className="flex items-center mr-4">
                        <FiBriefcase className="mr-1" /> {actividad.proyecto}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="mr-1" /> {actividad.horaInicio} - {actividad.horaFin}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => toggleEstadoActividad(actividad.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        actividad.estado === 'completada'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}
                    >
                      {actividad.estado === 'completada' ? 'Completada' : 'Pendiente'}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ActividadesDiarias;
