import React from "react";
import './Sidebar.css'
//Props son los datos que se le pasan a un elemento (JSX)
interface SidebarProps {
    //Prop para saber la pestaña activa
    activeTab : String
    //Prop para tener una nueva pestaña activa
    setActiveTab : (tab: string) => void;
}

export const Sidebar : React.FC <SidebarProps> = ({activeTab, setActiveTab}) =>{
    //Lista de las opciones del mennú 
    const menuItems = [
        {id: 'dashboard', label: 'Dashboard'}, 
        {id: 'inventario', label : 'Inventario'}, 
        {id: 'ventas', label: 'Ventas'}, 
        {id: 'config', label: 'Configuración'}
    ];
    return (
        //Declaración de elementos Visuales
        <aside className="sidebar"> 
            <div className="sidebar-brand">
                <h2>Control del Panel</h2>
            </div>
            <nav className="sidebar-menu">
                <ul> 
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                            //Usamos la función ? (if) para saber cual es la pestaña activa
                            className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                            >
                                <span className="sidebar-icon">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
