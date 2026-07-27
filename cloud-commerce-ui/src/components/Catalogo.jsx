import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Footer } from './Footer';
import './Catalogo.css';

export function Catalogo({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        apiService.getProductos(),
        apiService.getCategorias(),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(p => p.categoria?.id === categoriaSeleccionada)
    : productos;

  const abrirModalProducto = (producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarModalProducto = () => {
    setProductoSeleccionado(null);
  };

  if (loading) {
    return <div className="catalogo-loading">Cargando...</div>;
  }

  if (error) {
    return <div className="catalogo-error">{error}</div>;
  }

  return (
    <div className="catalogo-container">
      <div className="catalogo-layout">
        <aside className="categorias-sidebar">
          <h3 className="categorias-title">Categorías</h3>
          <ul className="categorias-list">
            <li>
              <button
                className={`categoria-btn ${categoriaSeleccionada === null ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada(null)}
              >
                Todos
              </button>
            </li>
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <button
                  className={`categoria-btn ${categoriaSeleccionada === categoria.id ? 'active' : ''}`}
                  onClick={() => setCategoriaSeleccionada(categoria.id)}
                >
                  {categoria.nombre}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="catalogo-main">
          <h2 className="catalogo-title">Catálogo de Productos</h2>
          {productosFiltrados.length === 0 ? (
            <p className="catalogo-empty">No hay productos disponibles</p>
          ) : (
            <div className="catalogo-grid">
              {productosFiltrados.map((producto) => (
                <div key={producto.id} className="producto-card" onClick={() => abrirModalProducto(producto)}>
                  <div className="producto-image-container">
                    {producto.imagenUrl ? (
                      <img
                        src={producto.imagenUrl}
                        alt={producto.nombre}
                        className="producto-imagen"
                      />
                    ) : (
                      <div className="producto-image-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <span className="producto-categoria-badge">
                      {producto.categoria?.nombre || 'Sin categoría'}
                    </span>
                  </div>
                  <div className="producto-info">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    <p className="producto-descripcion">{producto.descripcion}</p>
                    <div className="producto-footer">
                      <div className="producto-precio-stock">
                        <span className="producto-precio">${producto.precio?.toFixed(2)}</span>
                        <span className="producto-stock">{producto.stock} disponibles</span>
                      </div>
                      <button
                        className="btn-agregar-carrito"
                        disabled={producto.stock <= 0}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (producto.stock > 0) {
                            onAddToCart(producto);
                          } else {
                            alert('No hay stock disponible de este producto');
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        {producto.stock <= 0 ? 'Sin Stock' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {productoSeleccionado && (
        <div className="producto-modal-overlay" onClick={cerrarModalProducto}>
          <div className="producto-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="producto-modal-close" onClick={cerrarModalProducto}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="producto-modal-grid">
              <div className="producto-modal-image">
                {productoSeleccionado.imagenUrl ? (
                  <img src={productoSeleccionado.imagenUrl} alt={productoSeleccionado.nombre} />
                ) : (
                  <div className="producto-modal-image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="producto-modal-details">
                <span className="producto-modal-categoria">{productoSeleccionado.categoria?.nombre || 'Sin categoría'}</span>
                <h2 className="producto-modal-nombre">{productoSeleccionado.nombre}</h2>
                <p className="producto-modal-descripcion">{productoSeleccionado.descripcion}</p>

                <div className="producto-modal-info">
                  <div className="producto-modal-precio">
                    <span className="label">Precio</span>
                    <span className="value">${productoSeleccionado.precio?.toFixed(2)}</span>
                  </div>
                  <div className="producto-modal-stock">
                    <span className="label">Stock</span>
                    <span className="value">{productoSeleccionado.stock} unidades</span>
                  </div>
                </div>

                {productoSeleccionado.proveedor && (
                  <div className="producto-modal-proveedor">
                    <span className="label">Proveedor</span>
                    <span className="value">{productoSeleccionado.proveedor.nombre}</span>
                  </div>
                )}

                <button
                  className="btn-agregar-carrito-large"
                  disabled={productoSeleccionado.stock <= 0}
                  onClick={() => {
                    if (productoSeleccionado.stock > 0) {
                      onAddToCart(productoSeleccionado);
                      cerrarModalProducto();
                    } else {
                      alert('No hay stock disponible de este producto');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  {productoSeleccionado.stock <= 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
