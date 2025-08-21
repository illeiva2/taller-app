const React = require('react');
const ReactDOM = require('react-dom');

// Importar componente de prueba
const { testRender, TestComponent } = require('./test');

console.log('=== INICIANDO DIAGNÓSTICO ===');
console.log('React version:', React.version);
console.log('ReactDOM version:', ReactDOM.version);

// Función principal para renderizar la aplicación
function renderApp() {
    console.log('Iniciando renderizado de la aplicación...');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('No se encontró el elemento root');
        return;
    }
    
    try {
        // Primero probar con el componente simple
        console.log('Probando con componente simple...');
        ReactDOM.render(React.createElement(TestComponent), rootElement);
        console.log('✅ Aplicación renderizada correctamente');
        
        // Ocultar el loading
        const loadingElement = document.querySelector('.loading');
        if (loadingElement) {
            console.log('Ocultando elemento de carga...');
            loadingElement.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error al renderizar la aplicación:', error);
        console.error('Stack trace:', error.stack);
        
        // Mostrar error en pantalla
        rootElement.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h2>Error al cargar la aplicación</h2>
                <p>${error.message}</p>
                <button onclick="window.location.reload()" style="padding: 10px 20px; margin: 10px;">
                    Recargar Aplicación
                </button>
            </div>
        `;
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
            setTimeout(() => {
                renderApp();
            }, 100);
        });
    } else {
        console.log('DOM ya está listo, iniciando aplicación...');
        setTimeout(() => {
            renderApp();
        }, 100);
    }
}

// Inicializar la aplicación
initializeApp();
