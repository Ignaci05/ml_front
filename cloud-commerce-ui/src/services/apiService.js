const API_URL = 'http://localhost:8085/api/';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorMsg = await response.text();
        throw new Error(errorMsg || 'Error en la solicitud');
    }
    if (response.status === 204) return null;
    return await response.json();
};

export const apiService = {
    getProductos: async () => {
        const response = await fetch(`${API_URL}productos`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener los productos');
        return await handleResponse(response);
    },

    /* Métodos para los productos */

    getProductoById: async (id) => {
        const response = await fetch(`${API_URL}productos/${id}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener el producto');
        return await handleResponse(response);
    },

    createProducto: async (producto) => {
        const response = await fetch(`${API_URL}productos/crear`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        if (!response.ok) throw new Error('Error al crear el producto');
        return await handleResponse(response);
    },

    updateProducto: async (id, producto) => {
        const response = await fetch(`${API_URL}productos/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(producto),
        });
        if (!response.ok) throw new Error('Error al actualizar el producto');
        return await handleResponse(response);
    },

    deleteProducto: async (id) => {
        const response = await fetch(`${API_URL}productos/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al eliminar el producto');
        return await handleResponse(response);
    },

    getClientes: async () => {
        const response = await fetch(`${API_URL}clientes`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener los clientes');
        return await handleResponse(response);
    },

    getClienteById: async (id) => {
        const response = await fetch(`${API_URL}clientes/${id}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener el cliente');
        return await handleResponse(response);
    },

    /* Métodos para clientes*/

    createCliente: async (cliente) => {
        const response = await fetch(`${API_URL}clientes/crear`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(cliente),
        });
        if (!response.ok) throw new Error('Error al crear el cliente');
        return await handleResponse(response);
    },

    updateCliente: async (id, cliente) => {
        const response = await fetch(`${API_URL}clientes/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(cliente),
        });
        if (!response.ok) throw new Error('Error al actualizar el cliente');
        return await handleResponse(response);
    },

    deleteCliente: async (id) => {
        const response = await fetch(`${API_URL}clientes/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al eliminar el cliente');
        return await handleResponse(response);
    },

    /*Métodos para categoorias */

    getCategorias: async () => {
        const response = await fetch(`${API_URL}categorias`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener las categorias');
        return await handleResponse(response);
    },

    getCategoriaById: async (id) => {
        const response = await fetch(`${API_URL}categorias/${id}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener la categoria');
        return await handleResponse(response);
    },

    createCategoria: async (categoria) => {
        const response = await fetch(`${API_URL}categorias/crear`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        if (!response.ok) throw new Error('Error al crear la categoria');
        return await handleResponse(response);
    },

    updateCategoria: async (id, categoria) => {
        const response = await fetch(`${API_URL}categorias/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(categoria),
        });
        if (!response.ok) throw new Error('Error al actualizar la categoria');
        return await handleResponse(response);
    },

    deleteCategoria: async (id) => {
        const response = await fetch(`${API_URL}categorias/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al eliminar la categoria');
        return await handleResponse(response);
    },
    /*Métodos para proveedores */
    getProveedores: async () => {
        const response = await fetch(`${API_URL}proveedores`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener los proveedores');
        return await handleResponse(response);
    },

    getProveedorById: async (id) => {
        const response = await fetch(`${API_URL}proveedores/${id}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener el proveedor');
        return await handleResponse(response);
    },

    createProveedor: async (proveedor) => {
        const response = await fetch(`${API_URL}proveedores/crear`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        if (!response.ok) throw new Error('Error al crear el proveedor');
        return await handleResponse(response);
    },

    updateProveedor: async (id, proveedor) => {
        const response = await fetch(`${API_URL}proveedores/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(proveedor),
        });
        if (!response.ok) throw new Error('Error al actualizar el proveedor');
        return await handleResponse(response);
    },

    deleteProveedor: async (id) => {
        const response = await fetch(`${API_URL}proveedores/${id}`, {
            method: 'DELETE',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al eliminar el proveedor');
        return await handleResponse(response);
    },

    /* Métodos para logn */

    login: async (credentials) => {
        const response = await fetch(`${API_URL}auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error('Credenciales inválidas');
        const data = await handleResponse(response);
        localStorage.setItem('token', data.token);
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('nombre');
        localStorage.removeItem('role');
    },

    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },

    register: async (userData) => {
        const response = await fetch(`${API_URL}auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al registrar');
        }
        return await handleResponse(response);
    },
    getUserRole : () =>{
        return localStorage.getItem('role');
    },

    /* mÉTODOS PARA VENTAS */
    getVentas: async () => {
        const response = await fetch(`${API_URL}ventas`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener las ventas');
        return await handleResponse(response);
    },

    getVentaById: async (id) => {
        const response = await fetch(`${API_URL}ventas/${id}`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener la venta');
        return await handleResponse(response);
    },

    createVenta: async (venta) => {
        const response = await fetch(`${API_URL}ventas/crear`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(venta),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al crear la venta');
        }
        return await handleResponse(response);
    },

    procesarVenta: async (venta) => {
        const response = await fetch(`${API_URL}ventas`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(venta),
        });
        if (!response.ok) throw new Error('Error al procesar la venta');
        return await handleResponse(response);
    },

    getMisCompras: async () => {
        const response = await fetch(`${API_URL}ventas/mis-compras`, {
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al obtener las compras');
        return await handleResponse(response);
    },

    createCheckoutSession: async (ventaId) => {
        const response = await fetch(`${API_URL}stripe/checkout/${ventaId}`, {
            method: 'POST',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al crear sesión de pago');
        return await handleResponse(response);
    },

    confirmarPago: async (id) => {
        const response = await fetch(`${API_URL}ventas/confirmar-pago/${id}`, {
            method: 'POST',
            headers: getHeaders(),
        });
        if (!response.ok) throw new Error('Error al confirmar el pago');
        return await handleResponse(response);
    },

    updateVenta: async (id, venta) => {
        const response = await fetch(`${API_URL}ventas/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(venta),
        });
        if (!response.ok) throw new Error('Error al actualizar la venta');
        return await handleResponse(response);
    },
};
