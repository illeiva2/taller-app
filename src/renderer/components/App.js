const React = require('react');
const { Link, useLocation } = require('react-router-dom');

const App = ({ children }) => {
    const location = useLocation();
    
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: '📊' },
        { path: '/vehicles', label: 'Vehículos', icon: '🚗' },
        { path: '/maintenance', label: 'Mantenimiento', icon: '🔧' },
        { path: '/parts', label: 'Repuestos', icon: '⚙️' },
        { path: '/reports', label: 'Reportes', icon: '📋' }
    ];
    
    return React.createElement('div', { className: 'app' },
        // Header
        React.createElement('header', { className: 'header' },
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
        ),
        
        // Main content
        React.createElement('div', { className: 'main-container' },
            // Sidebar
            React.createElement('nav', { className: 'sidebar' },
                React.createElement('ul', { className: 'nav-menu' },
                    menuItems.map(item => 
                        React.createElement('li', { key: item.path, className: 'nav-item' },
                            React.createElement(Link, {
                                to: item.path,
                                className: `nav-link ${location.pathname === item.path ? 'active' : ''}`
                            },
                                React.createElement('span', { className: 'nav-icon' }, item.icon),
                                React.createElement('span', { className: 'nav-label' }, item.label)
                            )
                        )
                    )
                )
            ),
            
            // Content area
            React.createElement('main', { className: 'content' },
                children
            )
        )
    );
};

module.exports = App;
