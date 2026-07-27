import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Modal, DetailRow, DetailSection } from './Modal';
import './ListaEntidad.css';

export function ProveedoresView() {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [detalleProveedor, setDetalleProveedor] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', direccion: '', activo: true });

  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProveedores();
      setProveedores(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los proveedores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await apiService.updateProveedor(editando, formData);
      } else {
        await apiService.createProveedor(formData);
      }
      resetForm();
      cargarProveedores();
    } catch (err) {
      alert('Error al guardar el proveedor');
      console.error(err);
    }
  };

  const handleEditar = (proveedor) => {
    setEditando(proveedor.id);
    setFormData({
      nombre: proveedor.nombre,
      email: proveedor.email,
      telefono: proveedor.telefono || '',
      direccion: proveedor.direccion || '',
      activo: proveedor.activo
    });
    setMostrarForm(true);
  };

  const handleVerDetalle = (proveedor) => {
    setDetalleProveedor(proveedor);
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        await apiService.deleteProveedor(id);
        cargarProveedores();
      } catch (err) {
        alert('Error al eliminar el proveedor');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', email: '', telefono: '', direccion: '', activo: true });
    setEditando(null);
    setMostrarForm(false);
  };

  if (loading) return <div className="view-loading">Cargando proveedores...</div>;
  if (error) return <div className="view-error">{error}</div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Proveedores</h2>
        <button
          className={`btn ${mostrarForm ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => mostrarForm ? resetForm() : setMostrarForm(true)}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Proveedor'}
        </button>
      </div>

      {mostrarForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
            />
            <span>Activo</span>
          </label>
          <button type="submit" className="btn btn-success">
            {editando ? 'Actualizar' : 'Guardar'}
          </button>
        </form>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id} onClick={() => handleVerDetalle(proveedor)} className="clickable-row">
                <td>{proveedor.id}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.email}</td>
                <td>{proveedor.telefono}</td>
                <td>{proveedor.direccion}</td>
                <td>
                  <span className={`badge ${proveedor.activo ? 'badge-success' : 'badge-danger'}`}>
                    {proveedor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="actions-cell">
                    <button className="btn btn-sm btn-primary" onClick={() => handleVerDetalle(proveedor)} title="Ver detalle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ver
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => handleEditar(proveedor)} title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(proveedor.id)} title="Eliminar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!detalleProveedor}
        onClose={() => setDetalleProveedor(null)}
        title="Detalle del Proveedor"
      >
        {detalleProveedor && (
          <>
            <DetailSection title="Información del Proveedor">
              <DetailRow label="ID" value={detalleProveedor.id} />
              <DetailRow label="Nombre" value={detalleProveedor.nombre} />
              <DetailRow label="Email" value={detalleProveedor.email} />
              <DetailRow label="Teléfono" value={detalleProveedor.telefono} />
              <DetailRow label="Dirección" value={detalleProveedor.direccion} />
            </DetailSection>
            <DetailSection title="Estado">
              <DetailRow
                label="Estado"
                value={
                  <span className={`detail-badge ${detalleProveedor.activo ? 'active' : 'inactive'}`}>
                    {detalleProveedor.activo ? 'Activo' : 'Inactivo'}
                  </span>
                }
              />
            </DetailSection>
          </>
        )}
      </Modal>
    </div>
  );
}
