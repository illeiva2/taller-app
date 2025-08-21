const React = require('react');
const { ipcRenderer } = require('electron');

const Parts = () => {
    const [parts, setParts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [showForm, setShowForm] = React.useState(false);
    const [editingPart, setEditingPart] = React.useState(null);
    const [formData, setFormData] = React.useState({
        name: '',
        code: '',
        category: '',
        stock: 0,
        minStock: 0,
        price: 0,
        supplier: ''
    });

    const partCategories = ['Filtros', 'Lubricantes', 'Frenos', 'Motor', 'Transmisión', 'Hidráulica', 'Eléctrica', 'Otro'];

    React.useEffect(() => {
        loadParts();
    }, []);

    const loadParts = async () => {
        try {
            const data = await ipcRenderer.invoke('db-get-parts');
            setParts(data);
            setLoading(false);
        } catch (error) {
            console.error('Error cargando repuestos:', error);
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
            if (editingPart) {
                await ipcRenderer.invoke('db-update-part', editingPart.id, formData);
            } else {
                await ipcRenderer.invoke('db-add-part', formData);
            }
            
            setShowForm(false);
            setEditingPart(null);
            resetForm();
            loadParts();
        } catch (error) {
            console.error('Error guardando repuesto:', error);
            alert('Error al guardar el repuesto');
        }
    };

    const handleEdit = (part) => {
        setEditingPart(part);
        setFormData({
            name: part.name,
            code: part.code,
            category: part.category,
            stock: part.stock,
            minStock: part.min_stock,
            price: part.price,
            supplier: part.supplier || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este repuesto?')) {
            try {
                await ipcRenderer.invoke('db-delete-part', id);
                loadParts();
            } catch (error) {
                console.error('Error eliminando repuesto:', error);
                alert('Error al eliminar el repuesto');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            category: '',
            stock: 0,
            minStock: 0,
            price: 0,
            supplier: ''
        });
    };

    const openNewForm = () => {
        setEditingPart(null);
        resetForm();
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingPart(null);
        resetForm();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const getStockStatus = (stock, minStock) => {
        if (stock <= 0) return 'out-of-stock';
        if (stock <= minStock) return 'low-stock';
        return 'in-stock';
    };

    const getStockStatusText = (stock, minStock) => {
        if (stock <= 0) return 'Sin Stock';
        if (stock <= minStock) return 'Stock Bajo';
        return 'En Stock';
    };

    if (loading) {
        return React.createElement('div', { className: 'parts-loading' },
            React.createElement('div', { className: 'spinner' }),
            React.createElement('p', null, 'Cargando repuestos...')
        );
    }

    return React.createElement('div', { className: 'parts-page' },
        // Header
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', { className: 'page-title' }, 'Gestión de Repuestos'),
            React.createElement('button', {
                className: 'btn btn-primary',
                onClick: openNewForm
            }, '⚙️ Nuevo Repuesto')
        ),

        // Formulario
        showForm && React.createElement('div', { className: 'form-overlay' },
            React.createElement('div', { className: 'form-container' },
                React.createElement('div', { className: 'form-header' },
                    React.createElement('h2', null, editingPart ? 'Editar Repuesto' : 'Nuevo Repuesto'),
                    React.createElement('button', {
                        className: 'btn-close',
                        onClick: closeForm
                    }, '×')
                ),
                React.createElement('form', { onSubmit: handleSubmit, className: 'part-form' },
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Nombre *'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'name',
                                value: formData.name,
                                onChange: handleInputChange,
                                required: true,
                                placeholder: 'Ej: Filtro de Aceite'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Código *'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'code',
                                value: formData.code,
                                onChange: handleInputChange,
                                required: true,
                                placeholder: 'Ej: FO-001'
                            })
                        )
                    ),
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Categoría *'),
                            React.createElement('select', {
                                name: 'category',
                                value: formData.category,
                                onChange: handleInputChange,
                                required: true
                            },
                                React.createElement('option', { value: '' }, 'Seleccionar categoría'),
                                partCategories.map(category => 
                                    React.createElement('option', { key: category, value: category }, category)
                                )
                            )
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Proveedor'),
                            React.createElement('input', {
                                type: 'text',
                                name: 'supplier',
                                value: formData.supplier,
                                onChange: handleInputChange,
                                placeholder: 'Ej: AutoParts SA'
                            })
                        )
                    ),
                    React.createElement('div', { className: 'form-row' },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Stock Actual *'),
                            React.createElement('input', {
                                type: 'number',
                                name: 'stock',
                                value: formData.stock,
                                onChange: handleInputChange,
                                required: true,
                                min: 0,
                                placeholder: '0'
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', null, 'Stock Mínimo *'),
                            React.createElement('input', {
                                type: 'number',
                                name: 'minStock',
                                value: formData.minStock,
                                onChange: handleInputChange,
                                required: true,
                                min: 0,
                                placeholder: '0'
                            })
                        )
                    ),
                    React.createElement('div', { className: 'form-group' },
                        React.createElement('label', null, 'Precio *'),
                        React.createElement('input', {
                            type: 'number',
                            name: 'price',
                            value: formData.price,
                            onChange: handleInputChange,
                            required: true,
                            min: 0,
                            step: 0.01,
                            placeholder: '0.00'
                        })
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
                        }, editingPart ? 'Actualizar' : 'Crear')
                    )
                )
            )
        ),

        // Lista de repuestos
        React.createElement('div', { className: 'parts-list' },
            parts.length > 0 ? 
                React.createElement('div', { className: 'parts-grid' },
                    parts.map(part => 
                        React.createElement('div', { 
                            key: part.id, 
                            className: `part-card ${getStockStatus(part.stock, part.min_stock)}` 
                        },
                            React.createElement('div', { className: 'part-header' },
                                React.createElement('h3', { className: 'part-name' }, part.name),
                                React.createElement('span', { 
                                    className: `stock-badge ${getStockStatus(part.stock, part.min_stock)}` 
                                }, getStockStatusText(part.stock, part.min_stock))
                            ),
                            React.createElement('div', { className: 'part-details' },
                                React.createElement('p', { className: 'part-code' }, 
                                    `Código: ${part.code}`
                                ),
                                React.createElement('p', { className: 'part-category' }, 
                                    `Categoría: ${part.category}`
                                ),
                                React.createElement('div', { className: 'part-stock' },
                                    React.createElement('span', { className: 'stock-info' }, 
                                        `Stock: ${part.stock}`
                                    ),
                                    React.createElement('span', { className: 'min-stock' }, 
                                        `Mín: ${part.min_stock}`
                                    )
                                ),
                                React.createElement('p', { className: 'part-price' }, 
                                    `Precio: ${formatCurrency(part.price)}`
                                ),
                                part.supplier && React.createElement('p', { className: 'part-supplier' }, 
                                    `Proveedor: ${part.supplier}`
                                )
                            ),
                            React.createElement('div', { className: 'part-actions' },
                                React.createElement('button', {
                                    className: 'btn btn-secondary btn-sm',
                                    onClick: () => handleEdit(part)
                                }, '✏️ Editar'),
                                React.createElement('button', {
                                    className: 'btn btn-danger btn-sm',
                                    onClick: () => handleDelete(part.id)
                                }, '🗑️ Eliminar')
                            )
                        )
                    )
                ) :
                React.createElement('div', { className: 'no-parts' },
                    React.createElement('p', null, 'No hay repuestos registrados'),
                    React.createElement('button', {
                        className: 'btn btn-primary',
                        onClick: openNewForm
                    }, 'Agregar primer repuesto')
                )
        ),

        // Resumen de inventario
        parts.length > 0 && React.createElement('div', { className: 'inventory-summary' },
            React.createElement('h2', { className: 'section-title' }, 'Resumen del Inventario'),
            React.createElement('div', { className: 'summary-grid' },
                React.createElement('div', { className: 'summary-card' },
                    React.createElement('h3', null, parts.length),
                    React.createElement('p', null, 'Total Repuestos')
                ),
                React.createElement('div', { className: 'summary-card' },
                    React.createElement('h3', null, parts.filter(p => p.stock <= p.min_stock).length),
                    React.createElement('p', null, 'Stock Bajo')
                ),
                React.createElement('div', { className: 'summary-card' },
                    React.createElement('h3', null, parts.filter(p => p.stock === 0).length),
                    React.createElement('p', null, 'Sin Stock')
                ),
                React.createElement('div', { className: 'summary-card' },
                    React.createElement('h3', null, formatCurrency(parts.reduce((sum, p) => sum + (p.stock * p.price), 0))),
                    React.createElement('p', null, 'Valor Total')
                )
            )
        )
    );
};

module.exports = Parts;
