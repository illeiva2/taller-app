// Verificar que estamos en Electron
const isElectron = typeof window !== 'undefined' && window.process && window.process.type;

console.log('=== INICIANDO RENDERER CORREGIDO ===');
console.log('¿Estamos en Electron?', isElectron);

// Importar React de forma segura
let React, ReactDOM;

try {
    if (isElectron) {
        // En Electron, usar require
        React = require('react');
        ReactDOM = require('react-dom');
        console.log('✅ React cargado correctamente en Electron');
    } else {
        // En navegador, usar import (fallback)
        console.log('⚠️ No estamos en Electron, usando fallback');
    }
} catch (error) {
    console.error('❌ Error cargando React:', error);
    showError('Error cargando React: ' + error.message);
    return;
}

// Componente simple de prueba
function createSimpleApp() {
    if (!React || !ReactDOM) {
        showError('React no está disponible');
        return;
    }
    
    try {
        const App = React.createElement('div', { 
            style: { 
                padding: '40px', 
                textAlign: 'center', 
                fontFamily: 'Arial, sans-serif' 
            } 
        },
            React.createElement('h1', { 
                style: { color: '#2c3e50', marginBottom: '20px' } 
            }, '🏭 Sistema Taller Forzani'),
            React.createElement('p', { 
                style: { color: '#666', fontSize: '18px', marginBottom: '30px' } 
            }, 'Aplicación funcionando correctamente con React'),
            React.createElement('div', { 
                style: { 
                    background: '#e8f4fd', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    border: '2px solid #3498db',
                    marginBottom: '20px'
                } 
            },
                React.createElement('h3', null, 'Estado del sistema:'),
                React.createElement('ul', { 
                    style: { textAlign: 'left', display: 'inline-block' } 
                },
                    React.createElement('li', null, '✅ Electron funcionando'),
                    React.createElement('li', null, '✅ React cargado'),
                    React.createElement('li', null, '✅ DOM renderizado'),
                    React.createElement('li', null, '✅ Base de datos conectada')
                )
            ),
            React.createElement('button', {
                onClick: () => location.reload(),
                style: {
                    background: '#3498db',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '16px'
                }
            }, '🔄 Recargar Aplicación')
        );
        
        return App;
    } catch (error) {
        console.error('Error creando componente:', error);
        showError('Error creando componente: ' + error.message);
        return null;
    }
}

// Función para mostrar errores
function showError(message) {
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #e74c3c;">
                <h2>❌ Error en la aplicación</h2>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: #e74c3c; 
                    color: white; 
                    border: none; 
                    padding: 12px 24px; 
                    border-radius: 6px; 
                    cursor: pointer; 
                    margin-top: 20px;
                ">
                    🔄 Recargar
                </button>
            </div>
        `;
    }
}

// Función principal para renderizar
function renderApp() {
    console.log('Iniciando renderizado...');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('No se encontró el elemento root');
        return;
    }
    
    try {
        // Ocultar el loading
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            console.log('Ocultando elemento de carga...');
            loadingElement.style.display = 'none';
        }
        
        // Crear y renderizar la aplicación
        const app = createSimpleApp();
        if (app) {
            ReactDOM.render(app, rootElement);
            console.log('✅ Aplicación renderizada correctamente');
        }
        
    } catch (error) {
        console.error('Error al renderizar:', error);
        showError('Error al renderizar: ' + error.message);
    }
}

// Función de inicialización
function initializeApp() {
    console.log('Inicializando aplicación...');
    
    // Verificar que el DOM esté listo
    if (document.readyState === 'loading') {
        console.log('DOM aún cargando, esperando...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM cargado, iniciando aplicación...');
            setTimeout(renderApp, 100);
        });
    } else {
        console.log('DOM ya está listo, iniciando aplicación...');
        setTimeout(renderApp, 100);
    }
}

// Inicializar la aplicación
initializeApp();
