console.log('=== INICIANDO VERSIÓN SIMPLE ===');

// Función simple para ocultar el loading y mostrar contenido
function showSimpleContent() {
    console.log('Mostrando contenido simple...');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('No se encontró el elemento root');
        return;
    }
    
    // Ocultar el loading
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
        console.log('Ocultando elemento de carga...');
        loadingElement.style.display = 'none';
    }
    
    // Mostrar contenido simple
    rootElement.innerHTML = `
        <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
            <h1 style="color: #2c3e50; margin-bottom: 20px;">✅ Aplicación Funcionando</h1>
            <p style="color: #666; font-size: 18px; margin-bottom: 30px;">
                Si puedes ver este mensaje, el problema está en React, no en el DOM.
            </p>
            <div style="background: #e8f4fd; padding: 20px; border-radius: 8px; border: 2px solid #3498db;">
                <h3>Estado de la aplicación:</h3>
                <ul style="text-align: left; display: inline-block;">
                    <li>✅ DOM cargado correctamente</li>
                    <li>✅ JavaScript ejecutándose</li>
                    <li>❌ React no se está renderizando</li>
                </ul>
            </div>
            <button onclick="location.reload()" style="
                background: #3498db; 
                color: white; 
                border: none; 
                padding: 12px 24px; 
                border-radius: 6px; 
                cursor: pointer; 
                margin-top: 20px;
                font-size: 16px;
            ">
                🔄 Recargar Aplicación
            </button>
        </div>
    `;
    
    console.log('✅ Contenido simple mostrado correctamente');
}

// Función de inicialización
function initializeSimple() {
    console.log('Inicializando versión simple...');
    
    // Verificar que el DOM esté listo
    if (document.readyState === 'loading') {
        console.log('DOM aún cargando, esperando...');
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM cargado, mostrando contenido...');
            setTimeout(showSimpleContent, 100);
        });
    } else {
        console.log('DOM ya está listo, mostrando contenido...');
        setTimeout(showSimpleContent, 100);
    }
}

// Inicializar
initializeSimple();
