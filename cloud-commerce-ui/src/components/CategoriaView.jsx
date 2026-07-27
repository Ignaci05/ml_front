import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Modal, DetailRow, DetailSection } from './Modal';
import './ListaEntidad.css';

export function CategoriaView() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [detalleCategoria, setDetalleCategoria] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', activo: true });

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategorias();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las categorías');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editando) {
        await apiService.updateCategoria(editando, formData);
      } else {
        await apiService.createCategoria(formData);
      }
      resetForm();
      cargarCategorias();
    } catch (err) {
      alert('Error al guardar la categoría');
      console.error(err);
    }
  };

  const handleEditar = (categoria) => {
    setEditando(categoria.id);
    setFormData({ nombre: categoria.nombre, activo: categoria.activo });
    setMostrarForm(true);
  };

  const handleVerDetalle = (categoria) => {
    setDetalleCategoria(categoria);
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await apiService.deleteCategoria(id);
        cargarCategorias();
      } catch (err) {
        alert('Error al eliminar la categoría');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', activo: true });
    setEditando(null);
    setMostrarForm(false);
  };

  if (loading) return <div className="view-loading">Cargando categorías...</div>;
  if (error) return <div className="view-error">{error}</div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Categorías</h2>
        <button
          className={`btn ${mostrarForm ? 'btn-secondary' : 'btn-primary'}`}
          onClick={() => mostrarForm ? resetForm() : setMostrarForm(true)}
        >
          {mostrarForm ? 'Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      {mostrarForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre de la categoría"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
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
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria) => (
              <tr key={categoria.id} onClick={() => handleVerDetalle(categoria)} className="clickable-row">
                <td>{categoria.id}</td>
                <td>{categoria.nombre}</td>
                <td>
                  <span className={`badge ${categoria.activo ? 'badge-success' : 'badge-danger'}`}>
                    {categoria.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="actions-cell">
                    <button className="btn btn-sm btn-primary" onClick={() => handleVerDetalle(categoria)} title="Ver detalle">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                      Ver
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => handleEditar(categoria)} title="Editar">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Editar
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(categoria.id)} title="Eliminar">
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
        isOpen={!!detalleCategoria}
        onClose={() => setDetalleCategoria(null)}
        title="Detalle de la Categoría"
      >
        {detalleCategoria && (
          <DetailSection title="Información de la Categoría">
            <DetailRow label="ID" value={detalleCategoria.id} />
            <DetailRow label="Nombre" value={detalleCategoria.nombre} />
            <DetailRow
              label="Estado"
              value={
                <span className={`detail-badge ${detalleCategoria.activo ? 'active' : 'inactive'}`}>
                  {detalleCategoria.activo ? 'Activo' : 'Inactivo'}
                </span>
              }
            />
          </DetailSection>
        )}
      </Modal>
    </div>
  );
}
