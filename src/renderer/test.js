const React = require('react');
const ReactDOM = require('react-dom');

console.log('React version:', React.version);
console.log('ReactDOM version:', ReactDOM.version);

// Componente de prueba simple
const TestComponent = () => {
    return React.createElement('div', { 
        style: { 
            padding: '20px', 
            backgroundColor: '#e8f4fd', 
            border: '2px solid #3498db',
            borderRadius: '8px',
            margin: '20px'
        } 
    },
        React.createElement('h1', null, '✅ React está funcionando correctamente'),
        React.createElement('p', null, 'Si puedes ver este mensaje, React se está renderizando bien.'),
        React.createElement('p', null, 'El problema debe estar en otro lugar.')
    );
};

// Función de prueba
function testRender() {
    console.log('Probando renderizado de React...');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        console.error('No se encontró el elemento root');
        return false;
    }
    
    try {
        ReactDOM.render(React.createElement(TestComponent), rootElement);
        console.log('✅ Test de renderizado exitoso');
        return true;
    } catch (error) {
        console.error('❌ Error en test de renderizado:', error);
        return false;
    }
}

// Exportar para uso externo
module.exports = { testRender, TestComponent };
