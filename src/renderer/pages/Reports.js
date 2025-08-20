const React = require('react');

const Reports = () => {
    return React.createElement('div', { className: 'reports-page fade-in' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', null, 'Reportes y Estadísticas'),
            React.createElement('p', { className: 'page-subtitle' }, 'Genera informes detallados del taller')
        ),
        
        React.createElement('div', { className: 'grid grid-2' },
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h2', { className: 'card-title' }, 'Reportes de Mantenimiento')
                ),
                React.createElement('div', { className: 'report-options' }, [
                    React.createElement('button', { key: 'monthly', className: 'btn btn-primary' }, '📊 Reporte Mensual'),
                    React.createElement('button', { key: 'vehicle', className: 'btn btn-secondary' }, '🚗 Por Vehículo'),
                    React.createElement('button', { key: 'cost', className: 'btn btn-warning' }, '💰 Análisis de Costos'),
                    React.createElement('button', { key: 'schedule', className: 'btn btn-success' }, '📅 Programación')
                ])
            ),
            
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h2', { className: 'card-title' }, 'Reportes de Inventario')
                ),
                React.createElement('div', { className: 'report-options' }, [
                    React.createElement('button', { key: 'stock', className: 'btn btn-primary' }, '📦 Estado de Stock'),
                    React.createElement('button', { key: 'suppliers', className: 'btn btn-secondary' }, '🏢 Proveedores'),
                    React.createElement('button', { key: 'movements', className: 'btn btn-warning' }, '🔄 Movimientos'),
                    React.createElement('button', { key: 'alerts', className: 'btn btn-danger' }, '⚠️ Alertas')
                ])
            )
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h2', { className: 'card-title' }, 'Generar Reporte Personalizado')
            ),
            React.createElement('div', { className: 'custom-report-form' }, [
                React.createElement('div', { key: 'filters', className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Filtros'),
                    React.createElement('select', { className: 'form-select' }, [
                        React.createElement('option', { key: 'all', value: 'all' }, 'Todos los vehículos'),
                        React.createElement('option', { key: 'tractors', value: 'tractors' }, 'Solo tractores'),
                        React.createElement('option', { key: 'trucks', value: 'trucks' }, 'Solo camiones')
                    ])
                ),
                React.createElement('div', { key: 'dateRange', className: 'form-group' },
                    React.createElement('label', { className: 'form-label' }, 'Rango de fechas'),
                    React.createElement('div', { className: 'date-inputs' }, [
                        React.createElement('input', { key: 'start', type: 'date', className: 'form-input' }),
                        React.createElement('span', { key: 'separator' }, 'hasta'),
                        React.createElement('input', { key: 'end', type: 'date', className: 'form-input' })
                    ])
                ),
                React.createElement('button', { key: 'generate', className: 'btn btn-primary' }, '📋 Generar Reporte')
            ])
        )
    );
};

module.exports = Reports;
