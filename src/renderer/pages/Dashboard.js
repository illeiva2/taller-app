const React = require('react');

const Dashboard = () => {
    // Datos de ejemplo - en una aplicación real vendrían de la base de datos
    const stats = {
        totalVehicles: 45,
        activeMaintenance: 8,
        pendingParts: 12,
        monthlyCost: 125000
    };
    
    const recentMaintenance = [
        { id: 1, vehicle: 'Tractor JD 5075E', type: 'Mantenimiento Preventivo', date: '2024-08-20', status: 'Completado' },
        { id: 2, vehicle: 'Camión Iveco Daily', type: 'Cambio de Aceite', date: '2024-08-19', status: 'En Proceso' },
        { id: 3, vehicle: 'Cosechadora New Holland', type: 'Reparación Motor', date: '2024-08-18', status: 'Pendiente' },
        { id: 4, vehicle: 'Camioneta Ford Ranger', type: 'Cambio de Filtros', date: '2024-08-17', status: 'Completado' }
    ];
    
    const upcomingMaintenance = [
        { id: 1, vehicle: 'Tractor JD 6120M', type: 'Mantenimiento 500h', dueDate: '2024-08-25', priority: 'Alta' },
        { id: 2, vehicle: 'Cosechadora Case IH', type: 'Cambio de Aceite', dueDate: '2024-08-28', priority: 'Media' },
        { id: 3, vehicle: 'Camión Mercedes-Benz', type: 'Revisión General', dueDate: '2024-09-02', priority: 'Baja' }
    ];
    
    return React.createElement('div', { className: 'dashboard fade-in' },
        // Título de la página
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', null, 'Dashboard - Resumen del Taller'),
            React.createElement('p', { className: 'page-subtitle' }, 'Vista general del estado del taller y mantenimientos')
        ),
        
        // Estadísticas principales
        React.createElement('div', { className: 'grid grid-4' },
            React.createElement('div', { className: 'stat-card' },
                React.createElement('div', { className: 'stat-number' }, stats.totalVehicles),
                React.createElement('div', { className: 'stat-label' }, 'Vehículos Totales')
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('div', { className: 'stat-number' }, stats.activeMaintenance),
                React.createElement('div', { className: 'stat-label' }, 'Mantenimientos Activos')
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('div', { className: 'stat-number' }, stats.pendingParts),
                React.createElement('div', { className: 'stat-label' }, 'Repuestos Pendientes')
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('div', { className: 'stat-number' }, `$${stats.monthlyCost.toLocaleString()}`),
                React.createElement('div', { className: 'stat-label' }, 'Costo Mensual')
            )
        ),
        
        // Contenido principal en dos columnas
        React.createElement('div', { className: 'grid grid-2' },
            // Mantenimientos Recientes
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h2', { className: 'card-title' }, 'Mantenimientos Recientes'),
                    React.createElement('button', { className: 'btn btn-primary' }, 'Ver Todos')
                ),
                React.createElement('div', { className: 'table-container' },
                    React.createElement('table', { className: 'table' },
                        React.createElement('thead', null,
                            React.createElement('tr', null, [
                                React.createElement('th', { key: 'vehicle' }, 'Vehículo'),
                                React.createElement('th', { key: 'type' }, 'Tipo'),
                                React.createElement('th', { key: 'date' }, 'Fecha'),
                                React.createElement('th', { key: 'status' }, 'Estado')
                            ])
                        ),
                        React.createElement('tbody', null,
                            recentMaintenance.map(item => 
                                React.createElement('tr', { key: item.id }, [
                                    React.createElement('td', { key: 'vehicle' }, item.vehicle),
                                    React.createElement('td', { key: 'type' }, item.type),
                                    React.createElement('td', { key: 'date' }, item.date),
                                    React.createElement('td', { key: 'status' },
                                        React.createElement('span', { 
                                            className: `status-badge ${item.status.toLowerCase().replace(' ', '-')}` 
                                        }, item.status)
                                    )
                                ])
                            )
                        )
                    )
                )
            ),
            
            // Próximos Mantenimientos
            React.createElement('div', { className: 'card' },
                React.createElement('div', { className: 'card-header' },
                    React.createElement('h2', { className: 'card-title' }, 'Próximos Mantenimientos'),
                    React.createElement('button', { className: 'btn btn-warning' }, 'Programar')
                ),
                React.createElement('div', { className: 'table-container' },
                    React.createElement('table', { className: 'table' },
                        React.createElement('thead', null,
                            React.createElement('tr', null, [
                                React.createElement('th', { key: 'vehicle' }, 'Vehículo'),
                                React.createElement('th', { key: 'type' }, 'Tipo'),
                                React.createElement('th', { key: 'dueDate' }, 'Vencimiento'),
                                React.createElement('th', { key: 'priority' }, 'Prioridad')
                            ])
                        ),
                        React.createElement('tbody', null,
                            upcomingMaintenance.map(item => 
                                React.createElement('tr', { key: item.id }, [
                                    React.createElement('td', { key: 'vehicle' }, item.vehicle),
                                    React.createElement('td', { key: 'type' }, item.type),
                                    React.createElement('td', { key: 'dueDate' }, item.dueDate),
                                    React.createElement('td', { key: 'priority' },
                                        React.createElement('span', { 
                                            className: `priority-badge ${item.priority.toLowerCase()}` 
                                        }, item.priority)
                                    )
                                ])
                            )
                        )
                    )
                )
            )
        ),
        
        // Acciones rápidas
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h2', { className: 'card-title' }, 'Acciones Rápidas')
            ),
            React.createElement('div', { className: 'quick-actions' },
                React.createElement('button', { className: 'btn btn-primary' }, '➕ Nuevo Vehículo'),
                React.createElement('button', { className: 'btn btn-success' }, '🔧 Nuevo Mantenimiento'),
                React.createElement('button', { className: 'btn btn-warning' }, '⚙️ Gestionar Repuestos'),
                React.createElement('button', { className: 'btn btn-secondary' }, '📊 Generar Reporte')
            )
        )
    );
};

module.exports = Dashboard;
