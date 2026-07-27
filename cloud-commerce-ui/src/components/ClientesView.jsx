import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Modal, DetailRow, DetailSection } from './Modal';
import './ListaEntidad.css';

export function ClientesView() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [detalleCliente, setDetalleCliente] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', email: '', telefono: '', direccion: '', activo: true });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await apiService.getClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await apiService.updateCliente(editando, formData);
      } else {
        await apiService.createCliente(formData);
      }
      resetForm();
      cargarClientes();
    } catch (err) {
      alert('Error al guardar el cliente');
      console.error(err);
    }
  };

  const handleEditar = (cliente) => {
    setEditando(cliente.id);
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      activo: cliente.activo
    });
    setMostrarForm(true);
  };

  const handleVerDetalle = (cliente) => {
    setDetalleCliente(cliente);
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await apiService.deleteCliente(id);
        cargarClientes();
      } catch (err) {
        alert('Error al eliminar el cliente');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', apellido: '', email: '', telefono: '', direccion: '', activo: true });
    setEditando(null);
    setMostrarForm(false);
  };

  if (loading) return <div className="view-loading">Cargando clientes...</div>;
  if (error) return <div className="view-error">{error}</div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Clientes</h2>
        <button
          className={`btn ${mostrarForm ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => mostrarForm ? resetForm() : setMostrarForm(true)}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Cliente'}
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
            type="text"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
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
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente.id} onClick={() => handleVerDetalle(cliente)} className="clickable-row">
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <span className={`badge ${cliente.activo ? 'badge-success' : 'badge-danger'}`}>
                    {cliente.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="actions-cell">
                    <button className="btn btn-sm btn-primary" onClick={() => handleVerDetalle(cliente)} title="Ver detalle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ver
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => handleEditar(cliente)} title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(cliente.id)} title="Eliminar">
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
        isOpen={!!detalleCliente}
        onClose={() => setDetalleCliente(null)}
        title="Detalle del Cliente"
      >
        {detalleCliente && (
          <>
            <DetailSection title="Información Personal">
              <DetailRow label="ID" value={detalleCliente.id} />
              <DetailRow label="Nombre" value={`${detalleCliente.nombre} ${detalleCliente.apellido}`} />
              <DetailRow label="Email" value={detalleCliente.email} />
              <DetailRow label="Teléfono" value={detalleCliente.telefono} />
              <DetailRow label="Dirección" value={detalleCliente.direccion} />
            </DetailSection>
            <DetailSection title="Estado">
              <DetailRow
                label="Estado"
                value={
                  <span className={`detail-badge ${detalleCliente.activo ? 'active' : 'inactive'}`}>
                    {detalleCliente.activo ? 'Activo' : 'Inactivo'}
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
