import './Navbar.css';

export function Navbar({ activeTab, onTabChange, user, onLogout, onLoginClick, onRegisterClick, onCartClick, cartItems }) {
  const isAdmin = user?.role === 'ROLE_ADMIN';

  const adminTabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'categorias', label: 'Categorías' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'proveedores', label: 'Proveedores' },
    { id: 'inventario', label: 'Inventario' },
  ];

  const clientTabs = [
    { id: 'catalogo', label: 'Catálogo' },
    { id: 'mis-compras', label: 'Mis Compras' },
  ];

  const visibleTabs = isAdmin ? adminTabs : clientTabs;

  return (
    <nav className="navbar">
      <div className="navbar-brand">Mercadito Libre</div>
      <ul className="navbar-menu">
        {visibleTabs.map((tab) => (
          <li key={tab.id}>
            <button
              className={`navbar-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="navbar-actions">
        <button className="navbar-cart-btn" onClick={onCartClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {cartItems > 0 && <span className="navbar-cart-badge">{cartItems}</span>}
        </button>
        {user ? (
          <>
            <span className="navbar-user">
              {isAdmin ? 'Admin: ' : 'Cliente: '}{user.nombre}
            </span>
            <button className="navbar-btn-logout" onClick={onLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <>
            <button className="navbar-btn-register" onClick={onRegisterClick}>
              Registrarse
            </button>
            <button className="navbar-btn-login" onClick={onLoginClick}>
              Iniciar Sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
