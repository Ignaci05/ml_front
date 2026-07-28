import { useState, useEffect } from 'react';
import './App.css';
import './components/buttons.css';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Catalogo } from './components/Catalogo';
import { ClientesView } from './components/ClientesView';
import { ProveedoresView } from './components/ProveedoresView';
import { CategoriaView } from './components/CategoriaView';
import { Inventario } from './components/Inventario';
import { Dashboard } from './components/Dashboard';
import { Carrito } from './components/Carrito';
import { MisCompras } from './components/MisCompras';
import { VentasView } from './components/VentasView';
import { apiService } from './services/apiService';

function App() {
  const [activeTab, setActiveTab] = useState('catalogo');
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  const adminTabs = ['clientes', 'proveedores', 'categorias', 'inventario', 'dashboard', 'ventas'];
  const clientTabs = ['mis-compras'];

  const handleTabChange = (tabId) => {
    if (adminTabs.includes(tabId) && !isAdmin) {
      return;
    }
    setActiveTab(tabId);
  };

  const handleNavigateFromDashboard = (section) => {
    setActiveTab(section);
  };

  const renderContent = () => {
    if (adminTabs.includes(activeTab) && !isAdmin) {
      return <Catalogo onAddToCart={handleAddToCart} />;
    }

    if (clientTabs.includes(activeTab) && isAdmin) {
      return <Catalogo onAddToCart={handleAddToCart} />;
    }

    switch (activeTab) {
      case 'catalogo':
        return <Catalogo onAddToCart={handleAddToCart} />;
      case 'ventas':
        return <VentasView />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigateFromDashboard} />;
      case 'clientes':
        return <ClientesView />;
      case 'proveedores':
        return <ProveedoresView />;
      case 'categorias':
        return <CategoriaView />;
      case 'inventario':
        return <Inventario />;
      case 'mis-compras':
        return <MisCompras />;
      default:
        return <Catalogo onAddToCart={handleAddToCart} />;
    }
  };

  useEffect(() => {
    if (apiService.isAuthenticated()) {
      setUser({
        username: localStorage.getItem('username'),
        nombre: localStorage.getItem('nombre'),
        role: localStorage.getItem('role')
      });
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (adminTabs.includes(activeTab) && !isAdmin) {
      setActiveTab('catalogo');
    } else if (clientTabs.includes(activeTab) && isAdmin) {
      setActiveTab('catalogo');
    }
  }, [user, activeTab, isAdmin]);

  const handleLoginSuccess = (userData) => {
    setUser({
      username: userData.username,
      nombre: userData.nombre,
      role: userData.role
    });
    setCartItems([]);
  };

  const handleLogout = () => {
    apiService.logout();
    setUser(null);
    setCartItems([]);
    localStorage.removeItem('username');
    localStorage.removeItem('nombre');
    localStorage.removeItem('role');
    setActiveTab('catalogo');
  };

  const handleAddToCart = (producto) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    if (isAdmin) {
      alert('Solo los clientes pueden realizar compras');
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === producto.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prevItems, { ...producto, cantidad: 1 }];
    });
  };

  const handleCartClick = () => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productoId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productoId));
  };

  const handleUpdateQuantity = (productoId, newQuantity) => {
    if (newQuantity < 1) return;

    const item = cartItems.find(i => i.id === productoId);
    if (item && newQuantity > item.stock) {
      alert(`No puedes agregar más de ${item.stock} unidades. Stock disponible: ${item.stock}`);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productoId
          ? { ...item, cantidad: newQuantity }
          : item
      )
    );
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isPaymentSuccess = params.get('payment') === 'success';
    const ventaId = params.get('venta_id');

    if (isPaymentSuccess && ventaId) {
      window.history.replaceState({}, '', window.location.pathname);
      setCartItems([]);

      if (apiService.isAuthenticated()) {
        apiService.confirmarPago(ventaId)
          .then(() => alert('Pago exitoso! Tu compra ha sido procesada.'))
          .catch(() => alert('Pago procesado. Espera la confirmación del pago.'));
      }
    }
  }, []);

  const cartTotalItems = cartItems.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        user={user}
        onLogout={handleLogout}
        onLoginClick={() => setIsLoginOpen(true)}
        onRegisterClick={() => setIsRegisterOpen(true)}
        onCartClick={handleCartClick}
        cartItems={cartTotalItems}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer />
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterClick={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={() => setIsLoginOpen(true)}
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
      <Carrito
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        user={user}
      />
    </div>
  );
}

export default App;
