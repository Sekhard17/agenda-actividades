import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Toaster } from 'sonner'
import Login from './components/Auth/Login'
import RegistroSupervisor from './components/Auth/RegistroSupervisor'
import RutaProtegida from './components/Auth/RutaProtegida'
import Dashboard from './components/Dashboard/Dashboard'
import LayoutPrincipal from './components/Layout/LayoutPrincipal'
import Perfil from './components/Perfil/Perfil'

function App() {
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro-supervisor" element={<RegistroSupervisor />} />
        
        {/* Rutas protegidas */}
        <Route element={<RutaProtegida />}>
          <Route element={<LayoutPrincipal />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/actividades-diarias" element={<div className="p-4">Actividades Diarias (En desarrollo)</div>} />
            <Route path="/proyectos" element={<div className="p-4">Proyectos (En desarrollo)</div>} />
            <Route path="/funcionarios" element={<div className="p-4">Funcionarios (En desarrollo)</div>} />
            <Route path="/asignaciones" element={<div className="p-4">Asignaciones (En desarrollo)</div>} />
            <Route path="/informes" element={<div className="p-4">Informes (En desarrollo)</div>} />
            <Route path="/estadisticas" element={<div className="p-4">Estadísticas (En desarrollo)</div>} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/configuracion" element={<div className="p-4">Configuración (En desarrollo)</div>} />
          </Route>
        </Route>
        
        {/* Ruta por defecto - redirige a dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
