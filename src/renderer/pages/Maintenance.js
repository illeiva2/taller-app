const React = require('react');
const { ipcRenderer } = require('electron');

const Maintenance = () => {
    const [maintenance, setMaintenance] = React.useState([]);
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showForm, setShowForm] = React.useState(false);
    const [editingMaintenance, setEditingMaintenance] = React.useState(null);
    const [formData, setFormData] = React.useState({
        vehicleId: '',
        type: '',
        description: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Pendiente',
        technician: '',
        cost: 0,
        priority: 'Normal'
    });

    const maintenanceTypes = ['Mantenimiento Preventivo', 'Reparación', 'Inspección', 'Cambio de Aceite', 'Cambio de Filtros', 'Otro'];
    const maintenanceStatuses = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'];
    const priorities = ['Baja', 'Normal', 'Alta', 'Crítica'];

    React.useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [maintenanceData, vehiclesData] = await Promise.all([
                ipcRenderer.invoke('db-get-maintenance'),
                ipcRenderer.invoke('db-get-vehicles')
            ]);
            setMaintenance(maintenanceData);
            setVehicles(vehiclesData);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando datos:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingMaintenance) {
                await ipcRenderer.invoke('db-update-maintenance', editingMaintenance.id, formData);
            } else {
                await ipcRenderer.invoke('db-add-maintenance', formData);
            }
            
            setShowForm(false);
            setEditingMaintenance(null);
            resetForm();
            loadData();
        } catch (error) {
            console.error('Error guardando mantenimiento:', error);
            alert('Error al guardar el mantenimiento');
        }
    };

    const handleEdit = (maintenanceItem) => {
        setEditingMaintenance(maintenanceItem);
        setFormData({
            vehicleId: maintenanceItem.vehicle_id,
            type: maintenanceItem.type,
            description: maintenanceItem.description || '',
            startDate: maintenanceItem.start_date,
            endDate: maintenanceItem.end_date || '',
            status: maintenanceItem.status,
            technician: maintenanceItem.technician || '',
            cost: maintenanceItem.cost || 0,
            priority: maintenanceItem.priority
        });
        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            vehicleId: '',
            type: '',
            description: '',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            status: 'Pendiente',
            technician: '',
            cost: 0,
            priority: 'Normal'
        });
    };

    const openNewForm = () => {
        setEditingMaintenance(null);
        resetForm();
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingMaintenance(null);
        resetForm();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completado': return 'completed';
            case 'En Proceso': return 'in-progress';
            case 'Pendiente': return 'pending';
            case 'Cancelado': return 'cancelled';
            default: return 'pending';
        }
    };

    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'Crítica': return 'critical';
            case 'Alta': return 'high';
            case 'Normal': return 'normal';
            case 'Baja': return 'low';
            default: return 'normal';
        }
    };

    if (loading) {
        return React.createElement('div', { className: 'maintenance-loading' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Cargando mantenimientos...')
        );
    }

    return React.createElement('div', { className: 'maintenance-page' },
        // Header
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'Gestión de Mantenimientos'),
            React.createElement('button', {
                className: 'btn btn-primary',
                onClick: openNewForm
            }, '🔧 Nuevo Mantenimiento')
        ),

        // Formulario
        showForm && React.createElement('div', { className: 'form-overlay' },
            React.createElement('div', { className: 'form-container' },
                React.createElement('div', { className: 'form-header' },
                    React.createElement('h2', null, editingMaintenance ? 'Editar Mantenimiento' : 'Nuevo Mantenimiento'),
                    React.createElement('button', {
                        className: 'btn-close',
                        onClick: closeForm
                    }, '×')
                ),
                React.createElement('form', { onSubmit: handleSubmit, className: 'maintenance-form' },
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Vehículo *'),
                            React.createElement('select', {
                                name: 'vehicleId',
                                value: formData.vehicleId,
                                onChange: handleInputChange,
                                required: true
                            },
                                React.createElement('option', { value: '' }, 'Seleccionar vehículo'),
                                vehicles.map(vehicle => 
                                    React.createElement('option', { key: vehicle.id, value: vehicle.id }, vehicle.name)
                                )
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Tipo *'),
                            React.createElement('select', {
                                name: 'type',
                                value: formData.type,
                                onChange: handleInputChange,
                                required: true
                            },
                                React.createElement('option', { value: '' }, 'Seleccionar tipo'),
                                maintenanceTypes.map(type => 
                                    React.createElement('option', { key: type, value: type }, type)
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', null, 'Descripción'),
                        React.createElement('textarea', {
                            name: 'description',
                            value: formData.description,
                            onChange: handleInputChange,
                            placeholder: 'Descripción del mantenimiento...',
                            rows: 3
                        })
                    ),
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Fecha de Inicio *'),
                            React.createElement('input', {
                                type: 'date',
                                name: 'startDate',
                                value: formData.startDate,
                                onChange: handleInputChange,
                                required: true
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Fecha de Finalización'),
                            React.createElement('input', {
                                type: 'date',
                                name: 'endDate',
                                value: formData.endDate,
                                onChange: handleInputChange
                            })
                        )
                    ),
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Estado'),
                            React.createElement('select', {
                                name: 'status',
                                value: formData.status,
                                onChange: handleInputChange
                            },
                                maintenanceStatuses.map(status => 
                                    React.createElement('option', { key: status, value: status }, status)
                                )
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Prioridad'),
                            React.createElement('select', {
                                name: 'priority',
                                value: formData.priority,
                                onChange: handleInputChange
                            },
                                priorities.map(priority => 
                                    React.createElement('option', { key: priority, value: priority }, priority)
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Técnico'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'technician',
                                value: formData.technician,
                                onChange: handleInputChange,
                                placeholder: 'Nombre del técnico'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Costo'),
                            React.createElement('input', {
                                type: 'number',
                                name: 'cost',
                                value: formData.cost,
                                onChange: handleInputChange,
                                min: 0,
                                step: 0.01,
                                placeholder: '0.00'
                            })
                        )
                    ),
                    React.createElement('div', { className: 'form-actions' },
                        React.createElement('button', {
                            type: 'button',
                            className: 'btn btn-secondary',
                            onClick: closeForm
                        }, 'Cancelar'),
                        React.createElement('button', {
                            type: 'submit',
                            className: 'btn btn-primary'
                        }, editingMaintenance ? 'Actualizar' : 'Crear')
                    )
                )
            )
        ),

        // Lista de mantenimientos
        React.createElement('div', { className: 'maintenance-list' },
            maintenance.length > 0 ? 
                React.createElement('div', { className: 'maintenance-grid' },
                    maintenance.map(maint => 
                        React.createElement('div', { 
                            key: maint.id, 
                            className: `maintenance-card ${getStatusColor(maint.status)}` 
                        },
                            React.createElement('div', { className: 'maintenance-header' },
                                React.createElement('h3', { className: 'maintenance-title' }, maint.type),
                                React.createElement('div', { className: 'maintenance-badges' },
                                    React.createElement('span', { 
                                        className: `status-badge ${getStatusColor(maint.status)}` 
                                    }, maint.status),
                                    React.createElement('span', { 
                                        className: `priority-badge ${getPriorityColor(maint.priority)}` 
                                    }, maint.priority)
                                )
                            ),
                            React.createElement('div', { className: 'maintenance-details' },
                                React.createElement('p', { className: 'maintenance-vehicle' }, 
                                    `Vehículo: ${maint.vehicle_name}`
                                ),
                                maint.description && React.createElement('p', { className: 'maintenance-description' }, 
                                    maint.description
                                ),
                                React.createElement('div', { className: 'maintenance-meta' },
                                    React.createElement('span', { className: 'maintenance-date' }, 
                                        `Inicio: ${new Date(maint.start_date).toLocaleDateString('es-AR')}`
                                    ),
                                    maint.end_date && React.createElement('span', { className: 'maintenance-end-date' }, 
                                        `Fin: ${new Date(maint.end_date).toLocaleDateString('es-AR')}`
                                    )
                                ),
                                maint.technician && React.createElement('p', { className: 'maintenance-technician' }, 
                                    `Técnico: ${maint.technician}`
                                ),
                                maint.cost > 0 && React.createElement('p', { className: 'maintenance-cost' }, 
                                    `Costo: ${formatCurrency(maint.cost)}`
                                )
                            ),
                            React.createElement('div', { className: 'maintenance-actions' },
                                React.createElement('button', {
                                    className: 'btn btn-secondary btn-sm',
                                    onClick: () => handleEdit(maint)
                                }, '✏️ Editar')
                            )
                        )
                    )
                ) :
                React.createElement('div', { className: 'no-maintenance' },
                    React.createElement('p', null, 'No hay mantenimientos registrados'),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: openNewForm
                    }, 'Agregar primer mantenimiento')
                )
        )
    );
};

module.exports = Maintenance;
