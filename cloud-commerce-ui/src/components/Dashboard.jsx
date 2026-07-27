import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import './Dashboard.css';

export function Dashboard({ onNavigate }) {
  const [stats, setStats] = useState({
    clientes: 0,
    proveedores: 0,
    productos: 0,
    ventas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const [clientes, proveedores, productos] = await Promise.all([
        apiService.getClientes(),
        apiService.getProveedores(),
        apiService.getProductos()
      ]);

      setStats({
        clientes: Array.isArray(clientes) ? clientes.length : 0,
        proveedores: Array.isArray(proveedores) ? proveedores.length : 0,
        productos: Array.isArray(productos) ? productos.length : 0,
        ventas: 0
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Panel de Administración</h1>
      <p className="dashboard-subtitle">Resumen de la actividad del negocio</p>

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => onNavigate('clientes')}>
          <div className="dashboard-card-icon clientes">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-number">{stats.clientes}</span>
            <span className="dashboard-card-label">Clientes</span>
          </div>
          <div className="dashboard-card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => onNavigate('proveedores')}>
          <div className="dashboard-card-icon proveedores">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-number">{stats.proveedores}</span>
            <span className="dashboard-card-label">Proveedores</span>
          </div>
          <div className="dashboard-card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => onNavigate('inventario')}>
          <div className="dashboard-card-icon productos">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-number">{stats.productos}</span>
            <span className="dashboard-card-label">Productos</span>
          </div>
          <div className="dashboard-card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>

        <div className="dashboard-card" onClick={() => onNavigate('ventas')}>
          <div className="dashboard-card-icon ventas">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div className="dashboard-card-content">
            <span className="dashboard-card-number">{stats.ventas}</span>
            <span className="dashboard-card-label">Ventas</span>
          </div>
          <div className="dashboard-card-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>

      <div className="dashboard-quick-actions">
        <h2>Acciones Rápidas</h2>
        <div className="dashboard-actions-grid">
          <button className="dashboard-action-btn" onClick={() => onNavigate('clientes')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            Gestionar Clientes
          </button>
          <button className="dashboard-action-btn" onClick={() => onNavigate('proveedores')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Gestionar Proveedores
          </button>
          <button className="dashboard-action-btn" onClick={() => onNavigate('inventario')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            Gestionar Inventario
          </button>
          <button className="dashboard-action-btn" onClick={() => onNavigate('catalogo')}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Ver Catálogo
          </button>
        </div>
      </div>

      <div className="dashboard-activity">
        <h2>Actividad Reciente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-dot bg-primary"></span>
            <div>
              <p className="mb-1 fw-semibold">Sistema iniciado</p>
              <p className="text-muted small mb-0">El dashboard está activo</p>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-dot bg-success"></span>
            <div>
              <p className="mb-1 fw-semibold">Datos cargados</p>
              <p className="text-muted small mb-0">Estadísticas actualizadas correctamente</p>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-dot bg-warning"></span>
            <div>
              <p className="mb-1 fw-semibold">Bienvenido</p>
              <p className="text-muted small mb-0">Panel de administración operativo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
