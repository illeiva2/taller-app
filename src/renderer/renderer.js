const React = require('react');
const ReactDOM = require('react-dom');

// Importar componentes
const Dashboard = require('./pages/Dashboard');
const Vehicles = require('./pages/Vehicles');
const Maintenance = require('./pages/Maintenance');
const Parts = require('./pages/Parts');
const Reports = require('./pages/Reports');

// Estado global de la aplicación
let currentPage = 'dashboard';

// Función para cambiar de página
function changePage(page) {
    currentPage = page;
    renderApp();
}

// Función para renderizar el contenido de la página
function renderPageContent() {
    switch(currentPage) {
        case 'dashboard':
            return React.createElement(Dashboard);
        case 'vehicles':
            return React.createElement(Vehicles);
        case 'maintenance':
            return React.createElement(Maintenance);
        case 'parts':
            return React.createElement(Parts);
        case 'reports':
            return React.createElement(Reports);
        default:
            return React.createElement(Dashboard);
    }
}

// Función principal para renderizar la aplicación
function renderApp() {
    console.log('Iniciando renderizado de la aplicación...');
    console.log('Página actual:', currentPage);
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('No se encontró el elemento root');
        return;
    }
    
    try {
        // Crear el header
        const header = React.createElement('header', { className: 'header' },
            React.createElement('div', { className: 'header-content' },
                React.createElement('h1', { className: 'app-title' },
                    React.createElement('span', { className: 'icon' }, '🏭'),
                    'Sistema Taller Forzani'
                ),
                React.createElement('div', { className: 'header-actions' },
                    React.createElement('button', { 
                        className: 'btn btn-secondary',
                        onClick: () => {
                            const { ipcRenderer } = require('electron');
                            ipcRenderer.invoke('get-app-version').then(version => {
                                alert(`Versión: ${version}`);
                            });
                        }
                    }, 'ℹ️ Info')
                )
            )
        );
        
        // Crear la barra de navegación
        const menuItems = [
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'vehicles', label: 'Vehículos', icon: '🚗' },
            { id: 'maintenance', label: 'Mantenimiento', icon: '🔧' },
            { id: 'parts', label: 'Repuestos', icon: '⚙️' },
            { id: 'reports', label: 'Reportes', icon: '📋' }
        ];
        
        const sidebar = React.createElement('nav', { className: 'sidebar' },
            React.createElement('ul', { className: 'nav-menu' },
                menuItems.map(item => 
                    React.createElement('li', { key: item.id, className: 'nav-item' },
                        React.createElement('button', {
                            className: `nav-link ${currentPage === item.id ? 'active' : ''}`,
                            onClick: () => changePage(item.id)
                        },
                            React.createElement('span', { className: 'nav-icon' }, item.icon),
                            React.createElement('span', { className: 'nav-label' }, item.label)
                        )
                    )
                )
            )
        );
        
        // Crear el contenido principal
        const content = React.createElement('main', { className: 'content' },
            renderPageContent()
        );
        
        // Crear el contenedor principal
        const mainContainer = React.createElement('div', { className: 'main-container' },
            sidebar,
            content
        );
        
        // Crear la aplicación completa
        const app = React.createElement('div', { className: 'app' },
            header,
            mainContainer
        );
        
        // Renderizar
        ReactDOM.render(app, rootElement);
        console.log('Aplicación renderizada correctamente');
    } catch (error) {
        console.error('Error al renderizar la aplicación:', error);
        console.error('Stack trace:', error.stack);
    }
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
} else {
    renderApp();
}

// Manejar eventos del menú de Electron
const { ipcRenderer } = require('electron');

ipcRenderer.on('menu-new-vehicle', () => {
    // Navegar a la página de vehículos
    window.location.hash = '#/vehicles';
});

ipcRenderer.on('menu-new-maintenance', () => {
    // Navegar a la página de mantenimiento
    window.location.hash = '#/maintenance';
});

ipcRenderer.on('menu-about', () => {
    // Mostrar información sobre la aplicación
    alert('Sistema Taller Forzani v1.0.0\nDesarrollado para Grupo Forzani');
});
