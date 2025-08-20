const React = require('react');

const Maintenance = () => {
    const maintenanceRecords = [
        {
            id: 1,
            vehicle: 'Tractor JD 5075E',
            type: 'Mantenimiento Preventivo',
            description: 'Cambio de aceite y filtros',
            startDate: '2024-08-20',
            endDate: '2024-08-21',
            status: 'Completado',
            technician: 'Carlos Rodríguez',
            cost: 45000,
            priority: 'Normal'
        },
        {
            id: 2,
            vehicle: 'Camión Iveco Daily',
            type: 'Reparación',
            description: 'Reparación del sistema de frenos',
            startDate: '2024-08-19',
            endDate: null,
            status: 'En Proceso',
            technician: 'Miguel López',
            cost: 85000,
            priority: 'Alta'
        }
    ];

    return React.createElement('div', { className: 'maintenance-page fade-in' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', null, 'Gestión de Mantenimientos'),
            React.createElement('p', { className: 'page-subtitle' }, 'Control de mantenimientos preventivos y reparaciones')
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h2', { className: 'card-title' }, 'Mantenimientos'),
                React.createElement('button', { className: 'btn btn-primary' }, '➕ Nuevo Mantenimiento')
            ),
            React.createElement('div', { className: 'table-container' },
                React.createElement('table', { className: 'table' },
                    React.createElement('thead', null,
                        React.createElement('tr', null, [
                            React.createElement('th', { key: 'vehicle' }, 'Vehículo'),
                            React.createElement('th', { key: 'type' }, 'Tipo'),
                            React.createElement('th', { key: 'status' }, 'Estado'),
                            React.createElement('th', { key: 'technician' }, 'Técnico'),
                            React.createElement('th', { key: 'cost' }, 'Costo'),
                            React.createElement('th', { key: 'actions' }, 'Acciones')
                        ])
                    ),
                    React.createElement('tbody', null,
                        maintenanceRecords.map(record => 
                            React.createElement('tr', { key: record.id }, [
                                React.createElement('td', { key: 'vehicle' }, record.vehicle),
                                React.createElement('td', { key: 'type' }, record.type),
                                React.createElement('td', { key: 'status' },
                                    React.createElement('span', { 
                                        className: `status-badge ${record.status.toLowerCase().replace(' ', '-')}` 
                                    }, record.status)
                                ),
                                React.createElement('td', { key: 'technician' }, record.technician),
                                React.createElement('td', { key: 'cost' }, `$${record.cost.toLocaleString()}`),
                                React.createElement('td', { key: 'actions' },
                                    React.createElement('div', { className: 'action-buttons' }, [
                                        React.createElement('button', { 
                                            key: 'view',
                                            className: 'btn btn-sm btn-secondary'
                                        }, '👁️'),
                                        React.createElement('button', { 
                                            key: 'edit',
                                            className: 'btn btn-sm btn-primary'
                                        }, '✏️')
                                    ])
                                )
                            ])
                        )
                    )
                )
            )
        )
    );
};

module.exports = Maintenance;
