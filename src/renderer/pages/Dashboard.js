const React = require('react');
const { ipcRenderer } = require('electron');

const Dashboard = () => {
    const [stats, setStats] = React.useState({
        totalVehicles: 0,
        activeMaintenance: 0,
        pendingParts: 0,
        monthlyCost: 0
    });
    const [recentMaintenance, setRecentMaintenance] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsData, maintenanceData] = await Promise.all([
                ipcRenderer.invoke('db-get-dashboard-stats'),
                ipcRenderer.invoke('db-get-maintenance')
            ]);
            
            setStats(statsData);
            setRecentMaintenance(maintenanceData.slice(0, 5)); // Solo los últimos 5
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    if (loading) {
        return React.createElement('div', { className: 'dashboard-loading' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Cargando dashboard...')
        );
    }

    return React.createElement('div', { className: 'dashboard' },
        // Título y botón de actualizar
        React.createElement('div', { className: 'dashboard-header' },
            React.createElement('h1', { className: 'dashboard-title' }, 'Dashboard'),
            React.createElement('button', {
                className: 'btn btn-primary',
                onClick: loadDashboardData
            }, '🔄 Actualizar')
        ),

        // Tarjetas de estadísticas
        React.createElement('div', { className: 'stats-grid' },
            React.createElement('div', { className: 'stat-card vehicles' },
                React.createElement('div', { className: 'stat-icon' }, '🚗'),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('h3', { className: 'stat-number' }, stats.totalVehicles),
                    React.createElement('p', { className: 'stat-label' }, 'Vehículos Totales')
                )
            ),
            React.createElement('div', { className: 'stat-card maintenance' },
                React.createElement('div', { className: 'stat-icon' }, '🔧'),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('h3', { className: 'stat-number' }, stats.activeMaintenance),
                    React.createElement('p', { className: 'stat-label' }, 'Mantenimientos Activos')
                )
            ),
            React.createElement('div', { className: 'stat-card parts' },
                React.createElement('div', { className: 'stat-icon' }, '⚠️'),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('h3', { className: 'stat-number' }, stats.pendingParts),
                    React.createElement('p', { className: 'stat-label' }, 'Repuestos Pendientes')
                )
            ),
            React.createElement('div', { className: 'stat-card costs' },
                React.createElement('div', { className: 'stat-icon' }, '💰'),
                React.createElement('div', { className: 'stat-content' },
                    React.createElement('h3', { className: 'stat-number' }, formatCurrency(stats.monthlyCost)),
                    React.createElement('p', { className: 'stat-label' }, 'Costo Mensual')
                )
            )
        ),

        // Mantenimientos recientes
        React.createElement('div', { className: 'recent-section' },
            React.createElement('h2', { className: 'section-title' }, 'Mantenimientos Recientes'),
            recentMaintenance.length > 0 ? 
                React.createElement('div', { className: 'maintenance-list' },
                    recentMaintenance.map(maint => 
                        React.createElement('div', { 
                            key: maint.id, 
                            className: `maintenance-item ${maint.status.toLowerCase().replace(' ', '-')}` 
                        },
                            React.createElement('div', { className: 'maintenance-header' },
                                React.createElement('h4', { className: 'maintenance-title' }, maint.type),
                                React.createElement('span', { 
                                    className: `status-badge ${maint.status.toLowerCase().replace(' ', '-')}` 
                                }, maint.status)
                            ),
                            React.createElement('p', { className: 'maintenance-vehicle' }, 
                                `Vehículo: ${maint.vehicle_name}`
                            ),
                            React.createElement('p', { className: 'maintenance-description' }, 
                                maint.description || 'Sin descripción'
                            ),
                            React.createElement('div', { className: 'maintenance-meta' },
                                React.createElement('span', { className: 'maintenance-date' }, 
                                    `Inicio: ${new Date(maint.start_date).toLocaleDateString('es-AR')}`
                                ),
                                React.createElement('span', { className: 'maintenance-cost' }, 
                                    `Costo: ${formatCurrency(maint.cost)}`
                                )
                            )
                        )
                    )
                ) :
                React.createElement('p', { className: 'no-data' }, 'No hay mantenimientos recientes')
        ),

        // Acciones rápidas
        React.createElement('div', { className: 'quick-actions' },
            React.createElement('h2', { className: 'section-title' }, 'Acciones Rápidas'),
            React.createElement('div', { className: 'actions-grid' },
                React.createElement('button', {
                    className: 'action-btn new-vehicle',
                    onClick: () => {
                        // Navegar a vehículos
                        window.location.hash = '#/vehicles';
                    }
                },
                    React.createElement('span', { className: 'action-icon' }, '🚗'),
                    React.createElement('span', { className: 'action-text' }, 'Nuevo Vehículo')
                ),
                React.createElement('button', {
                    className: 'action-btn new-maintenance',
                    onClick: () => {
                        // Navegar a mantenimiento
                        window.location.hash = '#/maintenance';
                    }
                },
                    React.createElement('span', { className: 'action-icon' }, '🔧'),
                    React.createElement('span', { className: 'action-text' }, 'Nuevo Mantenimiento')
                ),
                React.createElement('button', {
                    className: 'action-btn new-part',
                    onClick: () => {
                        // Navegar a repuestos
                        window.location.hash = '#/parts';
                    }
                },
                    React.createElement('span', { className: 'action-icon' }, '⚙️'),
                    React.createElement('span', { className: 'action-text' }, 'Nuevo Repuesto')
                )
            )
        )
    );
};

module.exports = Dashboard;
