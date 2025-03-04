import React, { useEffect, useState } from 'react';
import { FiCalendar, FiClock, FiBriefcase, FiAlignLeft, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { NuevaActividad } from '../../hooks/useActividadesDiarias';

interface ModalActividadProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (actividad: Omit<NuevaActividad, 'id_usuario'>) => void;
  actividad: Omit<NuevaActividad, 'id_usuario'>;
  proyectos: any[];
  titulo?: string;
  modo?: 'crear' | 'editar';
}

const ModalActividad: React.FC<ModalActividadProps> = ({
  isOpen,
  onClose,
  onSubmit,
  actividad: actividadInicial,
  proyectos,
  titulo = 'Nueva Actividad',
  modo = 'crear'
}) => {
  const [actividad, setActividad] = useState<Omit<NuevaActividad, 'id_usuario'>>(actividadInicial);
  const [errores, setErrores] = useState<{[key: string]: string}>({});
  const [animateIn, setAnimateIn] = useState(false);
  const [duracion, setDuracion] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
      setActividad(actividadInicial);
      calcularDuracion();
    } else {
      setAnimateIn(false);
    }
  }, [isOpen, actividadInicial]);

  useEffect(() => {
    calcularDuracion();
  }, [actividad.hora_inicio, actividad.hora_fin]);

  const calcularDuracion = () => {
    if (!actividad.hora_inicio || !actividad.hora_fin) {
      setDuracion('');
      return;
    }

    try {
      const inicio = new Date(`2000-01-01T${actividad.hora_inicio}`);
      const fin = new Date(`2000-01-01T${actividad.hora_fin}`);
      
      if (fin < inicio) {
        setDuracion('Hora fin debe ser posterior a hora inicio');
        return;
      }
      
      const diff = (fin.getTime() - inicio.getTime()) / (1000 * 60);
      const horas = Math.floor(diff / 60);
      const minutos = Math.floor(diff % 60);
      
      setDuracion(`${horas} h ${minutos} min`);
    } catch (error) {
      setDuracion('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setActividad(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando se modifica el campo
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores: {[key: string]: string} = {};
    
    if (!actividad.fecha) {
      nuevosErrores.fecha = 'La fecha es requerida';
    }
    
    if (!actividad.hora_inicio) {
      nuevosErrores.hora_inicio = 'La hora de inicio es requerida';
    }
    
    if (!actividad.hora_fin) {
      nuevosErrores.hora_fin = 'La hora de fin es requerida';
    } else if (actividad.hora_inicio && actividad.hora_fin) {
      const inicio = new Date(`2000-01-01T${actividad.hora_inicio}`);
      const fin = new Date(`2000-01-01T${actividad.hora_fin}`);
      
      if (fin <= inicio) {
        nuevosErrores.hora_fin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }
    
    if (!actividad.descripcion) {
      nuevosErrores.descripcion = 'La descripción es requerida';
    } else if (actividad.descripcion.length < 5) {
      nuevosErrores.descripcion = 'La descripción debe tener al menos 5 caracteres';
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onSubmit(actividad);
      handleClose();
    }
  };

  const handleClose = () => {
    setAnimateIn(false);
    setTimeout(() => {
      onClose();
      setErrores({});
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black transition-opacity duration-300 z-50 flex items-center justify-center p-4 ${
        animateIn ? 'bg-opacity-50' : 'bg-opacity-0 pointer-events-none'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${
          animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Cerrar"
          >
            <FiX className="text-xl" />
          </button>

          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              {modo === 'crear' ? (
                <FiCalendar className="text-blue-500" />
              ) : (
                <FiCheck className="text-green-500" />
              )}
              {titulo}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                  <FiCalendar className="text-blue-500" />
                  <span>Fecha</span>
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={actividad.fecha}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errores.fecha ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errores.fecha && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle /> {errores.fecha}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                    <FiClock className="text-blue-500" />
                    <span>Hora inicio</span>
                  </label>
                  <input
                    type="time"
                    name="hora_inicio"
                    value={actividad.hora_inicio}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errores.hora_inicio ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errores.hora_inicio && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <FiAlertCircle /> {errores.hora_inicio}
                    </p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                    <FiClock className="text-blue-500" />
                    <span>Hora fin</span>
                  </label>
                  <input
                    type="time"
                    name="hora_fin"
                    value={actividad.hora_fin}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                      errores.hora_fin ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                    }`}
                  />
                  {errores.hora_fin && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <FiAlertCircle /> {errores.hora_fin}
                    </p>
                  )}
                </div>
              </div>
              
              {duracion && (
                <div className={`text-sm ${duracion.includes('debe') ? 'text-red-500' : 'text-blue-500 dark:text-blue-400'} font-medium`}>
                  Duración: {duracion}
                </div>
              )}
              
              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                  <FiBriefcase className="text-blue-500" />
                  <span>Proyecto</span>
                </label>
                <select
                  name="id_proyecto"
                  value={actividad.id_proyecto || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Seleccionar proyecto</option>
                  {proyectos.map(proyecto => (
                    <option key={proyecto.id} value={proyecto.id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 mb-1">
                  <FiAlignLeft className="text-blue-500" />
                  <span>Descripción</span>
                </label>
                <textarea
                  name="descripcion"
                  value={actividad.descripcion}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errores.descripcion ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  rows={3}
                  placeholder="Describe la actividad realizada..."
                />
                {errores.descripcion && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle /> {errores.descripcion}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {actividad.descripcion.length} / 500 caracteres
                </p>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                >
                  <FiCheck />
                  {modo === 'crear' ? 'Crear Actividad' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalActividad;
