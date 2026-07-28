import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Modal, DetailRow, DetailSection } from './Modal';
import './MisCompras.css';

export function MisCompras() {
  const [compras, setCompras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState(null);

  useEffect(() => {
    cargarCompras();
  }, []);

  const cargarCompras = async () => {
    try {
      setLoading(true);
      const data = await apiService.getMisCompras();
      setCompras(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar tus compras');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (estado) => {
    const clases = {
      COMPLETADO: 'badge badge-success',
      PENDIENTE: 'badge badge-warning',
      CANCELADO: 'badge badge-danger',
    };
    return <span className={clases[estado] || 'badge badge-secondary'}>{estado}</span>;
  };

  if (loading) return <div className="view-loading">Cargando tus compras...</div>;
  if (error) return <div className="view-error">{error}</div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Mis Compras</h2>
        <button className="btn btn-secondary" onClick={cargarCompras}>
          Actualizar
        </button>
      </div>

      {compras.length === 0 ? (
        <div className="empty-state">
          <p>No tienes compras registradas</p>
        </div>
      ) : (
        <div className="compras-list">
          {compras.map((venta) => (
            <div
              key={venta.id}
              className="compra-card"
              onClick={() => setDetalleVenta(venta)}
            >
              <div className="compra-card-header">
                <div className="compra-card-info">
                  <span className="compra-card-id">Venta #{venta.id}</span>
                  <span className="compra-card-date">{formatDate(venta.fechaVenta)}</span>
                </div>
                <div className="compra-card-stats">
                  <span className="compra-card-total">${venta.total?.toFixed(2)}</span>
                  {getStatusBadge(venta.estado)}
                </div>
              </div>
              <div className="compra-card-body">
                <div className="compra-card-products">
                  {venta.detallesVenta?.map((detalle) => (
                    <span key={detalle.id} className="compra-product-tag">
                      {detalle.producto?.nombre} x{detalle.cantidad}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!detalleVenta}
        onClose={() => setDetalleVenta(null)}
        title={`Venta #${detalleVenta?.id}`}
      >
        {detalleVenta && (
          <>
            <DetailSection title="Información de la Venta">
              <DetailRow label="ID" value={detalleVenta.id} />
              <DetailRow label="Fecha" value={formatDate(detalleVenta.fechaVenta)} />
              <DetailRow label="Total" value={`$${detalleVenta.total?.toFixed(2)}`} />
              <DetailRow label="Método de pago" value={detalleVenta.tipoPago} />
              <DetailRow label="Estado" value={getStatusBadge(detalleVenta.estado)} />
            </DetailSection>
            <DetailSection title="Productos">
              {detalleVenta.detallesVenta?.map((detalle) => (
                <div key={detalle.id} className="detalle-producto-row">
                  <div className="detalle-producto-info">
                    <span className="detalle-producto-nombre">{detalle.producto?.nombre}</span>
                    <span className="detalle-producto-cant">Cant: {detalle.cantidad}</span>
                  </div>
                  <div className="detalle-producto-precios">
                    <span className="detalle-producto-unit">${detalle.precio_unitario?.toFixed(2)} c/u</span>
                    <span className="detalle-producto-subtotal">${detalle.subtotal?.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </DetailSection>
          </>
        )}
      </Modal>
    </div>
  );
}
