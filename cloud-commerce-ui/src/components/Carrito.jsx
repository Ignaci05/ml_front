import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import './Carrito.css';

export function Carrito({ isOpen, onClose, cartItems, onRemoveItem, onUpdateQuantity, onProcessSale, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAdmin = user?.role === 'ROLE_ADMIN';

  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  const handleProcessSale = async () => {
    if (cartItems.length === 0) return;

    if (isAdmin) {
      alert('Solo los clientes pueden realizar compras');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const venta = {
        detallesVenta: cartItems.map(item => ({
          producto: { id: item.id },
          cantidad: item.cantidad
        }))
      };

      await onProcessSale(venta);
      onClose();
    } catch (err) {
      setError('Error al procesar la venta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="carrito-overlay" onClick={onClose}>
      <div className="carrito-content" onClick={(e) => e.stopPropagation()}>
        <div className="carrito-header">
          <h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Carrito de Compras
          </h2>
          <button className="carrito-close" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="carrito-body">
          {cartItems.length === 0 ? (
            <div className="carrito-empty">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p>Tu carrito está vacío</p>
              <span>Agrega productos para comenzar</span>
            </div>
          ) : (
            <div className="carrito-items">
              {cartItems.map((item) => (
                <div key={item.id} className="carrito-item">
                  <div className="carrito-item-image">
                    {item.imagenUrl ? (
                      <img src={item.imagenUrl} alt={item.nombre} />
                    ) : (
                      <div className="carrito-item-placeholder">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="carrito-item-details">
                    <h4>{item.nombre}</h4>
                    <p className="carrito-item-price">${item.precio?.toFixed(2)}</p>
                  </div>
                  <div className="carrito-item-quantity">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.cantidad - 1))}
                      disabled={item.cantidad <= 1}
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                      disabled={item.cantidad >= item.stock}
                      title={item.cantidad >= item.stock ? `Stock máximo: ${item.stock}` : ''}
                    >
                      +
                    </button>
                  </div>
                  <div className="carrito-item-subtotal">
                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                    <span className="carrito-item-stock">Stock: {item.stock}</span>
                    <button className="carrito-item-remove" onClick={() => onRemoveItem(item.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="carrito-footer">
            <div className="carrito-summary">
              <div className="carrito-summary-row">
                <span>Subtotal ({totalItems} productos)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="carrito-summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {error && <div className="carrito-error">{error}</div>}

            {isAdmin ? (
              <div className="carrito-admin-message">
                Solo los clientes pueden realizar compras
              </div>
            ) : (
              <button
                className="carrito-checkout"
                onClick={handleProcessSale}
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Finalizar Compra'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
