const React = require('react');
const { ipcRenderer } = require('electron');

const Vehicles = () => {
    const [vehicles, setVehicles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showForm, setShowForm] = React.useState(false);
    const [editingVehicle, setEditingVehicle] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '',
        type: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        plate: '',
        status: 'Activo'
    });

    const vehicleTypes = ['Tractor', 'Cosechadora', 'Camión', 'Camioneta', 'Implemento', 'Otro'];
    const vehicleStatuses = ['Activo', 'Mantenimiento', 'Fuera de Servicio', 'Vendido'];

    React.useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            const data = await ipcRenderer.invoke('db-get-vehicles');
            setVehicles(data);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando vehículos:', error);
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
            if (editingVehicle) {
                await ipcRenderer.invoke('db-update-vehicle', editingVehicle.id, formData);
            } else {
                await ipcRenderer.invoke('db-add-vehicle', formData);
            }
            
            setShowForm(false);
            setEditingVehicle(null);
            resetForm();
            loadVehicles();
        } catch (error) {
            console.error('Error guardando vehículo:', error);
            alert('Error al guardar el vehículo');
        }
    };

    const handleEdit = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            name: vehicle.name,
            type: vehicle.type,
            brand: vehicle.brand,
            model: vehicle.model,
            year: vehicle.year,
            plate: vehicle.plate,
            status: vehicle.status
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
            try {
                await ipcRenderer.invoke('db-delete-vehicle', id);
                loadVehicles();
            } catch (error) {
                console.error('Error eliminando vehículo:', error);
                alert('Error al eliminar el vehículo');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: '',
            brand: '',
            model: '',
            year: new Date().getFullYear(),
            plate: '',
            status: 'Activo'
        });
    };

    const openNewForm = () => {
        setEditingVehicle(null);
        resetForm();
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingVehicle(null);
        resetForm();
    };

    if (loading) {
        return React.createElement('div', { className: 'vehicles-loading' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Cargando vehículos...')
        );
    }

    return React.createElement('div', { className: 'vehicles-page' },
        // Header
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'Gestión de Vehículos'),
            React.createElement('button', {
                className: 'btn btn-primary',
                onClick: openNewForm
            }, '🚗 Nuevo Vehículo')
        ),

        // Formulario
        showForm && React.createElement('div', { className: 'form-overlay' },
            React.createElement('div', { className: 'form-container' },
                React.createElement('div', { className: 'form-header' },
                    React.createElement('h2', null, editingVehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'),
                    React.createElement('button', {
                        className: 'btn-close',
                        onClick: closeForm
                    }, '×')
                ),
                React.createElement('form', { onSubmit: handleSubmit, className: 'vehicle-form' },
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Nombre *'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'name',
                                value: formData.name,
                                onChange: handleInputChange,
                                required: true,
                                placeholder: 'Ej: Tractor JD 5075E'
                            })
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
                                vehicleTypes.map(type => 
                                    React.createElement('option', { key: type, value: type }, type)
                                )
                            )
                        )
                    ),
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Marca *'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'brand',
                                value: formData.brand,
                                onChange: handleInputChange,
                                required: true,
                                placeholder: 'Ej: John Deere'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Modelo *'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'model',
                                value: formData.model,
                                onChange: handleInputChange,
                                required: true,
                                placeholder: 'Ej: 5075E'
                            })
                        )
                    ),
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Año *'),
                            React.createElement('input', {
                                type: 'number',
                                name: 'year',
                                value: formData.year,
                                onChange: handleInputChange,
                                required: true,
                                min: 1900,
                                max: new Date().getFullYear() + 1
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Patente'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'plate',
                                value: formData.plate,
                                onChange: handleInputChange,
                                placeholder: 'Ej: ABC123'
                            })
                        )
                    ),
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', null, 'Estado'),
                        React.createElement('select', {
                            name: 'status',
                            value: formData.status,
                            onChange: handleInputChange
                        },
                            vehicleStatuses.map(status => 
                                React.createElement('option', { key: status, value: status }, status)
                            )
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
                        }, editingVehicle ? 'Actualizar' : 'Crear')
                    )
                )
            )
        ),

        // Lista de vehículos
        React.createElement('div', { className: 'vehicles-list' },
            vehicles.length > 0 ? 
                React.createElement('div', { className: 'vehicles-grid' },
                    vehicles.map(vehicle => 
                        React.createElement('div', { 
                            key: vehicle.id, 
                            className: `vehicle-card ${vehicle.status.toLowerCase().replace(' ', '-')}` 
                        },
                            React.createElement('div', { className: 'vehicle-header' },
                                React.createElement('h3', { className: 'vehicle-name' }, vehicle.name),
                                React.createElement('span', { 
                                    className: `status-badge ${vehicle.status.toLowerCase().replace(' ', '-')}` 
                                }, vehicle.status)
                            ),
                            React.createElement('div', { className: 'vehicle-details' },
                                React.createElement('p', { className: 'vehicle-info' }, 
                                    `${vehicle.brand} ${vehicle.model} (${vehicle.year})`
                                ),
                                vehicle.plate && React.createElement('p', { className: 'vehicle-plate' }, 
                                    `Patente: ${vehicle.plate}`
                                ),
                                React.createElement('p', { className: 'vehicle-type' }, 
                                    `Tipo: ${vehicle.type}`
                                )
                            ),
                            React.createElement('div', { className: 'vehicle-actions' },
                                React.createElement('button', {
                                    className: 'btn btn-secondary btn-sm',
                                    onClick: () => handleEdit(vehicle)
                                }, '✏️ Editar'),
                                React.createElement('button', {
                                    className: 'btn btn-danger btn-sm',
                                    onClick: () => handleDelete(vehicle.id)
                                }, '🗑️ Eliminar')
                            )
                        )
                    )
                ) :
                React.createElement('div', { className: 'no-vehicles' },
                    React.createElement('p', null, 'No hay vehículos registrados'),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: openNewForm
                    }, 'Agregar primer vehículo')
                )
        )
    );
};

module.exports = Vehicles;
