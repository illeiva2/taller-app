const React = require('react');

const Parts = () => {
    const parts = [
        { id: 1, name: 'Filtro de Aceite', code: 'FO-001', category: 'Filtros', stock: 25, minStock: 5, price: 1500, supplier: 'AutoParts SA' },
        { id: 2, name: 'Aceite Motor 15W40', code: 'AM-002', category: 'Lubricantes', stock: 50, minStock: 10, price: 2500, supplier: 'LubriMax' },
        { id: 3, name: 'Pastillas de Freno', code: 'PF-003', category: 'Frenos', stock: 8, minStock: 15, price: 8000, supplier: 'FrenosPro' }
    ];

    return React.createElement('div', { className: 'parts-page fade-in' },
        React.createElement('div', { className: 'page-header' },
            React.createElement('h1', null, 'Gestión de Repuestos'),
            React.createElement('p', { className: 'page-subtitle' }, 'Control de inventario de repuestos y partes')
        ),
        
        React.createElement('div', { className: 'card' },
            React.createElement('div', { className: 'card-header' },
                React.createElement('h2', { className: 'card-title' }, 'Inventario de Repuestos'),
                React.createElement('button', { className: 'btn btn-primary' }, '➕ Nuevo Repuesto')
            ),
            React.createElement('div', { className: 'table-container' },
                React.createElement('table', { className: 'table' },
                    React.createElement('thead', null,
                        React.createElement('tr', null, [
                            React.createElement('th', { key: 'name' }, 'Repuesto'),
                            React.createElement('th', { key: 'code' }, 'Código'),
                            React.createElement('th', { key: 'category' }, 'Categoría'),
                            React.createElement('th', { key: 'stock' }, 'Stock'),
                            React.createElement('th', { key: 'price' }, 'Precio'),
                            React.createElement('th', { key: 'supplier' }, 'Proveedor'),
                            React.createElement('th', { key: 'actions' }, 'Acciones')
                        ])
                    ),
                    React.createElement('tbody', null,
                        parts.map(part => 
                            React.createElement('tr', { key: part.id }, [
                                React.createElement('td', { key: 'name' }, part.name),
                                React.createElement('td', { key: 'code' }, part.code),
                                React.createElement('td', { key: 'category' }, part.category),
                                React.createElement('td', { key: 'stock' },
                                    React.createElement('span', { 
                                        className: part.stock <= part.minStock ? 'low-stock' : 'normal-stock' 
                                    }, part.stock)
                                ),
                                React.createElement('td', { key: 'price' }, `$${part.price.toLocaleString()}`),
                                React.createElement('td', { key: 'supplier' }, part.supplier),
                                React.createElement('td', { key: 'actions' },
                                    React.createElement('div', { className: 'action-buttons' }, [
                                        React.createElement('button', { 
                                            key: 'edit',
                                            className: 'btn btn-sm btn-primary'
                                        }, '✏️'),
                                        React.createElement('button', { 
                                            key: 'order',
                                            className: 'btn btn-sm btn-warning'
                                        }, '📦')
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

module.exports = Parts;
