import { useState } from 'react';
import { apiService } from '../services/apiService';
import './Register.css';

export function Register({ isOpen, onClose, onRegisterSuccess, onLoginClick }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    role: 'ROLE_CLIENTE'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await apiService.register(formData);
      if (result?.message) {
        onRegisterSuccess();
        setFormData({
          username: '',
          password: '',
          nombre: '',
          apellido: '',
          telefono: '',
          direccion: '',
          role: 'ROLE_CLIENTE'
        });
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  const isCliente = formData.role === 'ROLE_CLIENTE';

  return (
    <div className="register-modal-overlay" onClick={onClose}>
      <div className="register-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="register-modal-close" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <h2>Crear Cuenta</h2>
        <p className="register-modal-subtitle">Completa los datos para registrarte</p>
        <form onSubmit={handleSubmit}>
          {error && <div className="register-error">{error}</div>}

          <div className="register-form-group">
            <label htmlFor="username">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Email
            </label>
            <input
              type="email"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="password">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="nombre">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="apellido">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form-group">
            <label htmlFor="role">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><polyline points="17 11 19 13 23 9"/></svg>
              Tipo de Usuario
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="ROLE_CLIENTE">Cliente</option>
              <option value="ROLE_ADMIN">Administrador</option>
            </select>
          </div>

          {isCliente && (
            <div className="register-client-fields">
              <div className="register-form-group">
                <label htmlFor="telefono">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required={isCliente}
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="direccion">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  required={isCliente}
                />
              </div>
            </div>
          )}

          <button type="submit" className="register-btn-submit" disabled={loading}>
            {loading ? (
              <span className="register-loading">Registrando...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                Crear Cuenta
              </>
            )}
          </button>

          <div className="register-login-link">
            <span>¿Ya tienes cuenta?</span>
            <button type="button" onClick={onLoginClick}>
              Inicia Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
