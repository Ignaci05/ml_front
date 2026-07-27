import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Modal, DetailRow, DetailSection } from './Modal';
import './Inventario.css';

export const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [detalleProducto, setDetalleProducto] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagenUrl: '',
    activo: true,
    categoria: null,
    proveedor: null
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData, proveedoresData] = await Promise.all([
        apiService.getProductos(),
        apiService.getCategorias(),
        apiService.getProveedores()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData.filter(c => c.activo));
      setProveedores(proveedoresData.filter(p => p.activo));
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        categoria: formData.categoria ? { id: formData.categoria } : null,
        proveedor: formData.proveedor ? { id: formData.proveedor } : null
      };

      if (editando) {
        await apiService.updateProducto(editando, productoData);
      } else {
        await apiService.createProducto(productoData);
      }
      resetForm();
      cargarDatos();
    } catch (err) {
      alert('Error al guardar el producto');
      console.error(err);
    }
  };

  const handleEditar = (producto) => {
    setEditando(producto.id);
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion || '',
      precio: producto.precio.toString(),
      stock: producto.stock.toString(),
      imagenUrl: producto.imagenUrl || '',
      activo: producto.activo,
      categoria: producto.categoria?.id || null,
      proveedor: producto.proveedor?.id || null
    });
    setMostrarForm(true);
  };

  const handleVerDetalle = (producto) => {
    setDetalleProducto(producto);
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await apiService.deleteProducto(id);
        cargarDatos();
      } catch (err) {
        alert('Error al eliminar el producto');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      precio: '',
      stock: '',
      imagenUrl: '',
      activo: true,
      categoria: null,
      proveedor: null
    });
    setEditando(null);
    setMostrarForm(false);
  };

  if (loading) return <div className="estado-mensaje">Cargando inventario...</div>;
  if (error) return <div className="estado-mensaje error">{error}</div>;

  return (
    <div className="inventario-container">
      <div className="inventario-header">
        <h2>Inventario</h2>
        <button
          className={`btn ${mostrarForm ? 'btn-secondary' : 'btn-success'}`}
          onClick={() => mostrarForm ? resetForm() : setMostrarForm(true)}
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo Producto'}
        </button>
      </div>

      {mostrarForm && (
        <form className="form-container" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del producto"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
            min="0"
            step="0.01"
          />
          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
            min="0"
          />
          <input
            type="text"
            placeholder="URL de imagen"
            value={formData.imagenUrl}
            onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            rows={2}
          />
          <select
            value={formData.categoria || ''}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value ? parseInt(e.target.value) : null })}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <select
            value={formData.proveedor || ''}
            onChange={(e) => setFormData({ ...formData, proveedor: e.target.value ? parseInt(e.target.value) : null })}
          >
            <option value="">Seleccionar proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={prov.id}>{prov.nombre}</option>
            ))}
          </select>
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
        <table className="inventario-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan={7} className="estado-mensaje">No hay productos registrados.</td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id} onClick={() => handleVerDetalle(producto)} className="clickable-row">
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${producto.precio?.toFixed(2)}</td>
                  <td className={producto.stock <= 5 ? 'stock-bajo' : ''}>
                    {producto.stock}
                    {producto.stock <= 5 && <span className="stock-warning"> (Bajo)</span>}
                  </td>
                  <td>{producto.categoria?.nombre || '-'}</td>
                  <td>
                    <span className={`badge ${producto.activo ? 'badge-success' : 'badge-danger'}`}>
                      {producto.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <div className="actions-cell">
                      <button className="btn btn-sm btn-primary" onClick={() => handleVerDetalle(producto)} title="Ver detalle">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        Ver
                      </button>
                      <button className="btn btn-sm btn-success" onClick={() => handleEditar(producto)} title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(producto.id)} title="Eliminar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!detalleProducto}
        onClose={() => setDetalleProducto(null)}
        title="Detalle del Producto"
      >
        {detalleProducto && (
          <>
            <DetailSection title="Información del Producto">
              <DetailRow label="ID" value={detalleProducto.id} />
              <DetailRow label="Nombre" value={detalleProducto.nombre} />
              <DetailRow label="Descripción" value={detalleProducto.descripcion} />
              <DetailRow
                label="Precio"
                value={<span className="detail-value success">${detalleProducto.precio?.toFixed(2)}</span>}
              />
              <DetailRow
                label="Stock"
                value={<span className={detalleProducto.stock <= 5 ? 'detail-value warning' : 'detail-value'}>{detalleProducto.stock} unidades</span>}
              />
              {detalleProducto.imagenUrl && (
                <DetailRow label="Imagen" value={detalleProducto.imagenUrl} />
              )}
            </DetailSection>
            <DetailSection title="Clasificación">
              <DetailRow label="Categoría" value={detalleProducto.categoria?.nombre || '-'} />
              <DetailRow label="Proveedor" value={detalleProducto.proveedor?.nombre || '-'} />
            </DetailSection>
            <DetailSection title="Estado">
              <DetailRow
                label="Estado"
                value={
                  <span className={`detail-badge ${detalleProducto.activo ? 'active' : 'inactive'}`}>
                    {detalleProducto.activo ? 'Activo' : 'Inactivo'}
                  </span>
                }
              />
            </DetailSection>
          </>
        )}
      </Modal>
    </div>
  );
};
