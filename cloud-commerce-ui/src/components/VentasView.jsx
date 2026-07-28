import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Modal, DetailRow, DetailSection } from './Modal';
import './ListaEntidad.css';
import './MisCompras.css';

export function VentasView() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detalleVenta, setDetalleVenta] = useState(null);

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVentas();
      setVentas(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las ventas');
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
    return <span className={clases[estado] || 'badge badge-secondary'}>{estado || 'PENDIENTE'}</span>;
  };

  const handleConfirmarPago = async (id) => {
    if (!confirm('¿Confirmar el pago de esta venta?')) return;
    try {
      await apiService.confirmarPago(id);
      cargarVentas();
    } catch (err) {
      alert('Error al confirmar el pago');
    }
  };

  const handleCancelarVenta = async (id) => {
    if (!confirm('¿Cancelar esta venta?')) return;
    try {
      await apiService.updateVenta(id, { estado: 'CANCELADO' });
      cargarVentas();
    } catch (err) {
      alert('Error al cancelar la venta');
    }
  };

  if (loading) return <div className="view-loading">Cargando ventas...</div>;
  if (error) return <div className="view-error">{error}</div>;

  return (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Ventas</h2>
        <button className="btn btn-secondary" onClick={cargarVentas}>
          Actualizar
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Pago</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} onClick={() => setDetalleVenta(venta)} className="clickable-row">
                <td>{venta.id}</td>
                <td>{formatDate(venta.fechaVenta)}</td>
                <td>{venta.email || '-'}</td>
                <td>${venta.total?.toFixed(2)}</td>
                <td>{venta.tipoPago || '-'}</td>
                <td>{getStatusBadge(venta.estado)}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="actions-cell">
                    <button className="btn btn-sm btn-primary" onClick={() => setDetalleVenta(venta)} title="Ver detalle">
                      Ver
                    </button>
                    {venta.estado === 'PENDIENTE' && (
                      <>
                        <button className="btn btn-sm btn-success" onClick={() => handleConfirmarPago(venta.id)} title="Confirmar pago">
                          Confirmar
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleCancelarVenta(venta.id)} title="Cancelar">
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
              <DetailRow label="Cliente" value={detalleVenta.email || '-'} />
              <DetailRow label="Total" value={`$${detalleVenta.total?.toFixed(2)}`} />
              <DetailRow label="Método de pago" value={detalleVenta.tipoPago || '-'} />
              <DetailRow label="Estado" value={getStatusBadge(detalleVenta.estado)} />
            </DetailSection>
            <DetailSection title="Productos">
              {detalleVenta.detallesVenta?.length > 0 ? (
                detalleVenta.detallesVenta.map((detalle) => (
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
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sin productos registrados</p>
              )}
            </DetailSection>
          </>
        )}
      </Modal>
    </div>
  );
}
