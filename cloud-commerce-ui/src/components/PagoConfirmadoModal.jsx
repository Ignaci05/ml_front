import './PagoConfirmadoModal.css';

export function PagoConfirmadoModal({ isOpen, onClose, ventaId, onGoToCatalog, onGoToMyOrders }) {
  if (!isOpen) return null;

  return (
    <div className="pago-modal-overlay" onClick={onClose}>
      <div className="pago-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="pago-modal-header">
          <div className="pago-success-icon-wrapper">
            <svg className="pago-success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className="pago-modal-title">¡Pago Confirmado!</h2>
          <p className="pago-modal-subtitle">Tu orden ha sido procesada exitosamente</p>
        </div>

        <div className="pago-modal-body">
          <div className="pago-info-box">
            <div className="pago-info-row">
              <span className="pago-info-label">Estado de Pago:</span>
              <span className="pago-badge-success">Aprobado</span>
            </div>
            {ventaId && (
              <div className="pago-info-row">
                <span className="pago-info-label">Número de Orden:</span>
                <span className="pago-info-value">#{ventaId}</span>
              </div>
            )}
            <div className="pago-info-row">
              <span className="pago-info-label">Método de Pago:</span>
              <span className="pago-info-value">Stripe (Tarjeta)</span>
            </div>
          </div>
          <p className="pago-thankyou-text">
            Gracias por tu compra en <strong>Mercadito Libre</strong>. Hemos enviado la confirmación de tu pedido.
          </p>
        </div>

        <div className="pago-modal-footer">
          <button 
            className="pago-btn-primary"
            onClick={() => {
              if (onGoToCatalog) onGoToCatalog();
              onClose();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            Volver al Catálogo
          </button>
          
          <button 
            className="pago-btn-secondary"
            onClick={() => {
              if (onGoToMyOrders) onGoToMyOrders();
              onClose();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Ver Mis Compras
          </button>
        </div>
      </div>
    </div>
  );
}
