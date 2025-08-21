const React = require('react');
const { ipcRenderer } = require('electron');

const Reports = () => {
    const [vehicles, setVehicles] = React.useState([]);
    const [maintenance, setMaintenance] = React.useState([]);
    const [parts, setParts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedReport, setSelectedReport] = React.useState('maintenance');
    const [dateRange, setDateRange] = React.useState({
        start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [vehiclesData, maintenanceData, partsData] = await Promise.all([
                ipcRenderer.invoke('db-get-vehicles'),
                ipcRenderer.invoke('db-get-maintenance'),
                ipcRenderer.invoke('db-get-parts')
            ]);
            setVehicles(vehiclesData);
            setMaintenance(maintenanceData);
            setParts(partsData);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const getFilteredMaintenance = () => {
        return maintenance.filter(maint => {
            const startDate = new Date(maint.start_date);
            const rangeStart = new Date(dateRange.start);
            const rangeEnd = new Date(dateRange.end);
            return startDate >= rangeStart && startDate <= rangeEnd;
        });
    };

    const getMaintenanceStats = () => {
        const filtered = getFilteredMaintenance();
        const totalCost = filtered.reduce((sum, m) => sum + (m.cost || 0), 0);
        const byStatus = filtered.reduce((acc, m) => {
            acc[m.status] = (acc[m.status] || 0) + 1;
            return acc;
        }, {});
        const byType = filtered.reduce((acc, m) => {
            acc[m.type] = (acc[m.type] || 0) + 1;
            return acc;
        }, {});

        return { totalCost, byStatus, byType, count: filtered.length };
    };

    const getVehicleStats = () => {
        const byStatus = vehicles.reduce((acc, v) => {
            acc[v.status] = (acc[v.status] || 0) + 1;
            return acc;
        }, {});
        const byType = vehicles.reduce((acc, v) => {
            acc[v.type] = (acc[v.type] || 0) + 1;
            return acc;
        }, {});

        return { byStatus, byType, total: vehicles.length };
    };

    const getPartsStats = () => {
        const lowStock = parts.filter(p => p.stock <= p.min_stock);
        const outOfStock = parts.filter(p => p.stock === 0);
        const totalValue = parts.reduce((sum, p) => sum + (p.stock * p.price), 0);
        const byCategory = parts.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
        }, {});

        return { lowStock, outOfStock, totalValue, byCategory, total: parts.length };
    };

    const exportReport = (type) => {
        let content = '';
        let filename = '';

        switch(type) {
            case 'maintenance':
                const maintStats = getMaintenanceStats();
                content = `REPORTE DE MANTENIMIENTOS\n`;
                content += `Período: ${dateRange.start} a ${dateRange.end}\n\n`;
                content += `Total de mantenimientos: ${maintStats.count}\n`;
                content += `Costo total: ${formatCurrency(maintStats.totalCost)}\n\n`;
                content += `Por estado:\n`;
                Object.entries(maintStats.byStatus).forEach(([status, count]) => {
                    content += `- ${status}: ${count}\n`;
                });
                content += `\nPor tipo:\n`;
                Object.entries(maintStats.byType).forEach(([type, count]) => {
                    content += `- ${type}: ${count}\n`;
                });
                filename = `mantenimientos_${dateRange.start}_${dateRange.end}.txt`;
                break;

            case 'vehicles':
                const vehicleStats = getVehicleStats();
                content = `REPORTE DE VEHÍCULOS\n\n`;
                content += `Total de vehículos: ${vehicleStats.total}\n\n`;
                content += `Por estado:\n`;
                Object.entries(vehicleStats.byStatus).forEach(([status, count]) => {
                    content += `- ${status}: ${count}\n`;
                });
                content += `\nPor tipo:\n`;
                Object.entries(vehicleStats.byType).forEach(([type, count]) => {
                    content += `- ${type}: ${count}\n`;
                });
                filename = `vehiculos_${new Date().toISOString().split('T')[0]}.txt`;
                break;

            case 'parts':
                const partsStats = getPartsStats();
                content = `REPORTE DE REPUESTOS\n\n`;
                content += `Total de repuestos: ${partsStats.total}\n`;
                content += `Valor total del inventario: ${formatCurrency(partsStats.totalValue)}\n`;
                content += `Stock bajo: ${partsStats.lowStock.length}\n`;
                content += `Sin stock: ${partsStats.outOfStock.length}\n\n`;
                content += `Por categoría:\n`;
                Object.entries(partsStats.byCategory).forEach(([category, count]) => {
                    content += `- ${category}: ${count}\n`;
                });
                filename = `repuestos_${new Date().toISOString().split('T')[0]}.txt`;
                break;
        }

        // Crear y descargar archivo
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return React.createElement('div', { className: 'reports-loading' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Cargando reportes...')
        );
    }

    const maintStats = getMaintenanceStats();
    const vehicleStats = getVehicleStats();
    const partsStats = getPartsStats();

    return React.createElement('div', { className: 'reports-page' },
        // Header
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'Reportes y Estadísticas'),
            React.createElement('p', { className: 'page-subtitle' }, 'Análisis y exportación de datos del taller')
        ),

        // Selector de reporte
        React.createElement('div', { className: 'report-selector' },
            React.createElement('div', { className: 'selector-tabs' },
                React.createElement('button', {
                    className: `tab ${selectedReport === 'maintenance' ? 'active' : ''}`,
                    onClick: () => setSelectedReport('maintenance')
                }, '🔧 Mantenimientos'),
                React.createElement('button', {
                    className: `tab ${selectedReport === 'vehicles' ? 'active' : ''}`,
                    onClick: () => setSelectedReport('vehicles')
                }, '🚗 Vehículos'),
                React.createElement('button', {
                    className: `tab ${selectedReport === 'parts' ? 'active' : ''}`,
                    onClick: () => setSelectedReport('parts')
                }, '⚙️ Repuestos')
            )
        ),

        // Reporte de Mantenimientos
        selectedReport === 'maintenance' && React.createElement('div', { className: 'report-section' },
            React.createElement('div', { className: 'report-header' },
                React.createElement('h2', null, 'Reporte de Mantenimientos'),
                React.createElement('div', { className: 'date-filters' },
                    React.createElement('div', { className: 'date-input' },
                        React.createElement('label', null, 'Desde:'),
                        React.createElement('input', {
                            type: 'date',
                            name: 'start',
                            value: dateRange.start,
                            onChange: handleDateChange
                        })
                    ),
                    React.createElement('div', { className: 'date-input' },
                        React.createElement('label', null, 'Hasta:'),
                        React.createElement('input', {
                            type: 'date',
                            name: 'end',
                            value: dateRange.end,
                            onChange: handleDateChange
                        })
                    ),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: () => exportReport('maintenance')
                    }, '📊 Exportar')
                )
            ),
            React.createElement('div', { className: 'stats-overview' },
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, maintStats.count),
                    React.createElement('p', null, 'Total Mantenimientos')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, formatCurrency(maintStats.totalCost)),
                    React.createElement('p', null, 'Costo Total')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, maintStats.count > 0 ? formatCurrency(maintStats.totalCost / maintStats.count) : '$0'),
                    React.createElement('p', null, 'Costo Promedio')
                )
            ),
            React.createElement('div', { className: 'charts-section' },
                React.createElement('div', { className: 'chart-container' },
                    React.createElement('h3', null, 'Por Estado'),
                    React.createElement('div', { className: 'chart' },
                        Object.entries(maintStats.byStatus).map(([status, count]) => 
                            React.createElement('div', { key: status, className: 'chart-bar' },
                                React.createElement('div', { 
                                    className: 'bar-fill',
                                    style: { height: `${(count / maintStats.count) * 100}%` }
                                }),
                                React.createElement('span', { className: 'bar-label' }, status),
                                React.createElement('span', { className: 'bar-value' }, count)
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'chart-container' },
                    React.createElement('h3', null, 'Por Tipo'),
                    React.createElement('div', { className: 'chart' },
                        Object.entries(maintStats.byType).map(([type, count]) => 
                            React.createElement('div', { key: type, className: 'chart-bar' },
                                React.createElement('div', { 
                                    className: 'bar-fill',
                                    style: { height: `${(count / maintStats.count) * 100}%` }
                                }),
                                React.createElement('span', { className: 'bar-label' }, type),
                                React.createElement('span', { className: 'bar-value' }, count)
                            )
                        )
                    )
                )
            )
        ),

        // Reporte de Vehículos
        selectedReport === 'vehicles' && React.createElement('div', { className: 'report-section' },
            React.createElement('div', { className: 'report-header' },
                React.createElement('h2', null, 'Reporte de Vehículos'),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: () => exportReport('vehicles')
                }, '📊 Exportar')
            ),
            React.createElement('div', { className: 'stats-overview' },
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, vehicleStats.total),
                    React.createElement('p', null, 'Total Vehículos')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, vehicleStats.byStatus['Activo'] || 0),
                    React.createElement('p', null, 'Vehículos Activos')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, vehicleStats.byStatus['Mantenimiento'] || 0),
                    React.createElement('p', null, 'En Mantenimiento')
                )
            ),
            React.createElement('div', { className: 'charts-section' },
                React.createElement('div', { className: 'chart-container' },
                    React.createElement('h3', null, 'Distribución por Estado'),
                    React.createElement('div', { className: 'pie-chart' },
                        Object.entries(vehicleStats.byStatus).map(([status, count]) => 
                            React.createElement('div', { key: status, className: 'pie-segment' },
                                React.createElement('span', { className: 'segment-label' }, status),
                                React.createElement('span', { className: 'segment-value' }, count)
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'chart-container' },
                    React.createElement('h3', null, 'Distribución por Tipo'),
                    React.createElement('div', { className: 'pie-chart' },
                        Object.entries(vehicleStats.byType).map(([type, count]) => 
                            React.createElement('div', { key: type, className: 'pie-segment' },
                                React.createElement('span', { className: 'segment-label' }, type),
                                React.createElement('span', { className: 'segment-value' }, count)
                            )
                        )
                    )
                )
            )
        ),

        // Reporte de Repuestos
        selectedReport === 'parts' && React.createElement('div', { className: 'report-section' },
            React.createElement('div', { className: 'report-header' },
                React.createElement('h2', null, 'Reporte de Repuestos'),
                React.createElement('button', {
                    className: 'btn btn-primary',
                    onClick: () => exportReport('parts')
                }, '📊 Exportar')
            ),
            React.createElement('div', { className: 'stats-overview' },
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, partsStats.total),
                    React.createElement('p', null, 'Total Repuestos')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, formatCurrency(partsStats.totalValue)),
                    React.createElement('p', null, 'Valor Total')
                ),
                React.createElement('div', { className: 'stat-card' },
                    React.createElement('h3', null, partsStats.lowStock.length),
                    React.createElement('p', null, 'Stock Bajo')
                )
            ),
            React.createElement('div', { className: 'charts-section' },
                React.createElement('div', { className: 'chart-container' },
                    React.createElement('h3', null, 'Distribución por Categoría'),
                    React.createElement('div', { className: 'pie-chart' },
                        Object.entries(partsStats.byCategory).map(([category, count]) => 
                            React.createElement('div', { key: category, className: 'pie-segment' },
                                React.createElement('span', { className: 'segment-label' }, category),
                                React.createElement('span', { className: 'segment-value' }, count)
                            )
                        )
                    )
                ),
                React.createElement('div', { className: 'chart-container' },
                    React.createElement('h3', null, 'Alertas de Stock'),
                    React.createElement('div', { className: 'alerts-list' },
                        partsStats.lowStock.length > 0 ? 
                            React.createElement('div', { className: 'alert-section' },
                                React.createElement('h4', null, 'Stock Bajo:'),
                                partsStats.lowStock.map(part => 
                                    React.createElement('div', { key: part.id, className: 'alert-item' },
                                        React.createElement('span', { className: 'alert-name' }, part.name),
                                        React.createElement('span', { className: 'alert-stock' }, `Stock: ${part.stock}`)
                                    )
                                )
                            ) : React.createElement('p', null, 'No hay alertas de stock'),
                        partsStats.outOfStock.length > 0 && 
                            React.createElement('div', { className: 'alert-section' },
                                React.createElement('h4', null, 'Sin Stock:'),
                                partsStats.outOfStock.map(part => 
                                    React.createElement('div', { key: part.id, className: 'alert-item critical' },
                                        React.createElement('span', { className: 'alert-name' }, part.name),
                                        React.createElement('span', { className: 'alert-stock' }, 'Sin stock')
                                    )
                                )
                            )
                    )
                )
            )
        )
    );
};

module.exports = Reports;
