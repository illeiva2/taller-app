const React = require('react');

const Vehicles = () => {
    // Datos de ejemplo
    const vehicles = [
        { 
            id: 1, 
            name: 'Tractor JD 5075E', 
            type: 'Tractor', 
            brand: 'John Deere', 
            model: '5075E', 
            year: 2020, 
            plate: 'ABC123', 
            status: 'Activo',
            lastMaintenance: '2024-08-15',
            nextMaintenance: '2024-09-15'
        },
        { 
            id: 2, 
            name: 'Cosechadora New Holland', 
            type: 'Cosechadora', 
            brand: 'New Holland', 
            model: 'CR 10.90', 
            year: 2019, 
            plate: 'XYZ789', 
            status: 'Mantenimiento',
            lastMaintenance: '2024-08-10',
            nextMaintenance: '2024-08-25'
        },
        { 
            id: 3, 
            name: 'Camión Iveco Daily', 
            type: 'Camión', 
            brand: 'Iveco', 
            model: 'Daily 35S15', 
            year: 2021, 
            plate: 'DEF456', 
            status: 'Activo',
            lastMaintenance: '2024-08-05',
            nextMaintenance: '2024-09-05'
        },
        { 
            id: 4, 
            name: 'Camioneta Ford Ranger', 
            type: 'Camioneta', 
            brand: 'Ford', 
            model: 'Ranger XLT', 
            year: 2022, 
            plate: 'GHI789', 
            status: 'Activo',
            lastMaintenance: '2024-08-12',
            nextMaintenance: '2024-09-12'
        }
    ];
    
    return React.createElement('div', { className: 'vehicles-page fade-in' },
        // Header de la página
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', null, 'Gestión de Vehículos'),
            React.createElement('p', { className: 'page-subtitle' }, 'Administra la flota de vehículos del taller')
        ),
        
        // Barra de acciones
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'actions-bar' },
                React.createElement('button', { className: 'btn btn-primary' }, '➕ Nuevo Vehículo'),
                React.createElement('button', { className: 'btn btn-secondary' }, '🔍 Buscar'),
                React.createElement('button', { className: 'btn btn-success' }, '📊 Exportar'),
                React.createElement('div', { className: 'search-box' },
                    React.createElement('input', { 
                        type: 'text', 
                        className: 'form-input', 
                        placeholder: 'Buscar vehículo...' 
                    })
                )
            )
        ),
        
        // Tabla de vehículos
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h2', { className: 'card-title' }, 'Lista de Vehículos'),
                React.createElement('span', { className: 'vehicle-count' }, `${vehicles.length} vehículos`)
            ),
            React.createElement('div', { className: 'table-container' },
                React.createElement('table', { className: 'table' },
                    React.createElement('thead', null,
                        React.createElement('tr', null, [
                            React.createElement('th', { key: 'name' }, 'Vehículo'),
                            React.createElement('th', { key: 'type' }, 'Tipo'),
                            React.createElement('th', { key: 'brand' }, 'Marca'),
                            React.createElement('th', { key: 'plate' }, 'Patente'),
                            React.createElement('th', { key: 'status' }, 'Estado'),
                            React.createElement('th', { key: 'lastMaintenance' }, 'Último Mant.'),
                            React.createElement('th', { key: 'nextMaintenance' }, 'Próximo Mant.'),
                            React.createElement('th', { key: 'actions' }, 'Acciones')
                        ])
                    ),
                    React.createElement('tbody', null,
                        vehicles.map(vehicle => 
                            React.createElement('tr', { key: vehicle.id }, [
                                React.createElement('td', { key: 'name' },
                                    React.createElement('div', { className: 'vehicle-info' },
                                        React.createElement('strong', null, vehicle.name),
                                        React.createElement('small', null, `${vehicle.year}`)
                                    )
                                ),
                                React.createElement('td', { key: 'type' },
                                    React.createElement('span', { className: 'vehicle-type' }, vehicle.type)
                                ),
                                React.createElement('td', { key: 'brand' }, vehicle.brand),
                                React.createElement('td', { key: 'plate' },
                                    React.createElement('span', { className: 'plate-number' }, vehicle.plate)
                                ),
                                React.createElement('td', { key: 'status' },
                                    React.createElement('span', { 
                                        className: `status-badge ${vehicle.status.toLowerCase()}` 
                                    }, vehicle.status)
                                ),
                                React.createElement('td', { key: 'lastMaintenance' }, vehicle.lastMaintenance),
                                React.createElement('td', { key: 'nextMaintenance' }, vehicle.nextMaintenance),
                                React.createElement('td', { key: 'actions' },
                                    React.createElement('div', { className: 'action-buttons' }, [
                                        React.createElement('button', { 
                                            key: 'edit',
                                            className: 'btn btn-sm btn-secondary',
                                            title: 'Editar'
                                        }, '✏️'),
                                        React.createElement('button', { 
                                            key: 'maintenance',
                                            className: 'btn btn-sm btn-success',
                                            title: 'Mantenimiento'
                                        }, '🔧'),
                                        React.createElement('button', { 
                                            key: 'delete',
                                            className: 'btn btn-sm btn-danger',
                                            title: 'Eliminar'
                                        }, '🗑️')
                                    ])
                                )
                            ])
                        )
                    )
                )
            )
        ),
        
        // Estadísticas de vehículos
        React.createElement('div', { className: 'grid grid-3' },
            React.createElement('div', { className: 'stat-card' },
                React.createElement('div', { className: 'stat-number' }, vehicles.filter(v => v.status === 'Activo').length),
                React.createElement('div', { className: 'stat-label' }, 'Vehículos Activos')
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('div', { className: 'stat-number' }, vehicles.filter(v => v.status === 'Mantenimiento').length),
                React.createElement('div', { className: 'stat-label' }, 'En Mantenimiento')
            ),
            React.createElement('div', { className: 'stat-card' },
                React.createElement('div', { className: 'stat-number' }, vehicles.filter(v => v.status === 'Inactivo').length),
                React.createElement('div', { className: 'stat-label' }, 'Inactivos')
            )
        )
    );
};

module.exports = Vehicles;
