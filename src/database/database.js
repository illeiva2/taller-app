const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

class TallerDatabase {
    constructor() {
        // Obtener la ruta de la base de datos
        const dbPath = path.join(app.getPath('userData'), 'taller.db');
        this.db = new sqlite3.Database(dbPath);
        this.init();
    }

    async init() {
        // Crear tablas si no existen
        await this.createTables();
        await this.insertSampleData();
    }

    createTables() {
        return new Promise((resolve, reject) => {
            // Tabla de vehículos
            this.db.run(`
                CREATE TABLE IF NOT EXISTS vehicles (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    type TEXT NOT NULL,
                    brand TEXT NOT NULL,
                    model TEXT NOT NULL,
                    year INTEGER NOT NULL,
                    plate TEXT UNIQUE,
                    status TEXT DEFAULT 'Activo',
                    last_maintenance DATE,
                    next_maintenance DATE,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Tabla de repuestos
            this.db.run(`
                CREATE TABLE IF NOT EXISTS parts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    code TEXT UNIQUE NOT NULL,
                    category TEXT NOT NULL,
                    stock INTEGER DEFAULT 0,
                    min_stock INTEGER DEFAULT 0,
                    price REAL NOT NULL,
                    supplier TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Tabla de mantenimientos
            this.db.run(`
                CREATE TABLE IF NOT EXISTS maintenance (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    vehicle_id INTEGER NOT NULL,
                    type TEXT NOT NULL,
                    description TEXT,
                    start_date DATE NOT NULL,
                    end_date DATE,
                    status TEXT DEFAULT 'Pendiente',
                    technician TEXT,
                    cost REAL DEFAULT 0,
                    priority TEXT DEFAULT 'Normal',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (vehicle_id) REFERENCES vehicles (id)
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Tabla de repuestos usados en mantenimientos
            this.db.run(`
                CREATE TABLE IF NOT EXISTS maintenance_parts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    maintenance_id INTEGER NOT NULL,
                    part_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL,
                    unit_price REAL NOT NULL,
                    FOREIGN KEY (maintenance_id) REFERENCES maintenance (id),
                    FOREIGN KEY (part_id) REFERENCES parts (id)
                )
            `, (err) => {
                if (err) reject(err);
            });

            // Tabla de proveedores
            this.db.run(`
                CREATE TABLE IF NOT EXISTS suppliers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    contact_person TEXT,
                    phone TEXT,
                    email TEXT,
                    address TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `, (err) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('Base de datos inicializada correctamente');
                    resolve();
                }
            });
        });
    }

    insertSampleData() {
        return new Promise((resolve, reject) => {
            // Verificar si ya hay datos
            this.db.get('SELECT COUNT(*) as count FROM vehicles', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (row.count > 0) {
                    resolve();
                    return;
                }

                // Insertar vehículos de ejemplo
                const vehicles = [
                    ['Tractor JD 5075E', 'Tractor', 'John Deere', '5075E', 2020, 'ABC123', 'Activo', '2024-08-15', '2024-09-15'],
                    ['Cosechadora New Holland', 'Cosechadora', 'New Holland', 'CR 10.90', 2019, 'XYZ789', 'Mantenimiento', '2024-08-10', '2024-08-25'],
                    ['Camión Iveco Daily', 'Camión', 'Iveco', 'Daily 35S15', 2021, 'DEF456', 'Activo', '2024-08-05', '2024-09-05'],
                    ['Camioneta Ford Ranger', 'Camioneta', 'Ford', 'Ranger XLT', 2022, 'GHI789', 'Activo', '2024-08-12', '2024-09-12']
                ];

                let completed = 0;
                vehicles.forEach(vehicle => {
                    this.db.run(`
                        INSERT INTO vehicles (name, type, brand, model, year, plate, status, last_maintenance, next_maintenance)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, vehicle, (err) => {
                        if (err) reject(err);
                        completed++;
                        if (completed === vehicles.length) {
                            this.insertParts();
                        }
                    });
                });
            });
        });
    }

    insertParts() {
        const parts = [
            ['Filtro de Aceite', 'FO-001', 'Filtros', 25, 5, 1500, 'AutoParts SA'],
            ['Aceite Motor 15W40', 'AM-002', 'Lubricantes', 50, 10, 2500, 'LubriMax'],
            ['Pastillas de Freno', 'PF-003', 'Frenos', 8, 15, 8000, 'FrenosPro'],
            ['Filtro de Aire', 'FA-004', 'Filtros', 15, 8, 1200, 'AutoParts SA'],
            ['Aceite Hidráulico', 'AH-005', 'Lubricantes', 30, 12, 3500, 'LubriMax']
        ];

        let completed = 0;
        parts.forEach(part => {
            this.db.run(`
                INSERT INTO parts (name, code, category, stock, min_stock, price, supplier)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, part, (err) => {
                if (err) console.error(err);
                completed++;
                if (completed === parts.length) {
                    this.insertMaintenance();
                }
            });
        });
    }

    insertMaintenance() {
        const maintenance = [
            [1, 'Mantenimiento Preventivo', 'Cambio de aceite y filtros', '2024-08-20', '2024-08-21', 'Completado', 'Carlos Rodríguez', 45000, 'Normal'],
            [3, 'Reparación', 'Reparación del sistema de frenos', '2024-08-19', null, 'En Proceso', 'Miguel López', 85000, 'Alta']
        ];

        let completed = 0;
        maintenance.forEach(maint => {
            this.db.run(`
                INSERT INTO maintenance (vehicle_id, type, description, start_date, end_date, status, technician, cost, priority)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, maint, (err) => {
                if (err) console.error(err);
                completed++;
                if (completed === maintenance.length) {
                    console.log('Datos de ejemplo insertados');
                }
            });
        });
    }

    // Métodos para vehículos
    getAllVehicles() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM vehicles ORDER BY name', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getVehicleById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM vehicles WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    addVehicle(vehicle) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                INSERT INTO vehicles (name, type, brand, model, year, plate, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [vehicle.name, vehicle.type, vehicle.brand, vehicle.model, vehicle.year, vehicle.plate, vehicle.status], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    updateVehicle(id, vehicle) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                UPDATE vehicles 
                SET name = ?, type = ?, brand = ?, model = ?, year = ?, plate = ?, status = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [vehicle.name, vehicle.type, vehicle.brand, vehicle.model, vehicle.year, vehicle.plate, vehicle.status, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    deleteVehicle(id) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM vehicles WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // Métodos para repuestos
    getAllParts() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM parts ORDER BY name', (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getPartById(id) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM parts WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    addPart(part) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                INSERT INTO parts (name, code, category, stock, min_stock, price, supplier)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [part.name, part.code, part.category, part.stock, part.minStock, part.price, part.supplier], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    updatePart(id, part) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                UPDATE parts 
                SET name = ?, code = ?, category = ?, stock = ?, min_stock = ?, price = ?, supplier = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [part.name, part.code, part.category, part.stock, part.minStock, part.price, part.supplier, id], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // Métodos para mantenimientos
    getAllMaintenance() {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT m.*, v.name as vehicle_name 
                FROM maintenance m 
                JOIN vehicles v ON m.vehicle_id = v.id 
                ORDER BY m.start_date DESC
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    getMaintenanceById(id) {
        return new Promise((resolve, reject) => {
            this.db.get(`
                SELECT m.*, v.name as vehicle_name 
                FROM maintenance m 
                JOIN vehicles v ON m.vehicle_id = v.id 
                WHERE m.id = ?
            `, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    addMaintenance(maintenance) {
        return new Promise((resolve, reject) => {
            this.db.run(`
                INSERT INTO maintenance (vehicle_id, type, description, start_date, end_date, status, technician, cost, priority)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                maintenance.vehicleId, 
                maintenance.type, 
                maintenance.description, 
                maintenance.startDate, 
                maintenance.endDate, 
                maintenance.status, 
                maintenance.technician, 
                maintenance.cost, 
                maintenance.priority
            ], function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID });
            });
        });
    }

    // Métodos para estadísticas
    getDashboardStats() {
        return new Promise((resolve, reject) => {
            const stats = {};
            
            this.db.get('SELECT COUNT(*) as count FROM vehicles', (err, row) => {
                if (err) {
                    reject(err);
                    return;
                }
                stats.totalVehicles = row.count;
                
                this.db.get("SELECT COUNT(*) as count FROM maintenance WHERE status = 'En Proceso'", (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    stats.activeMaintenance = row.count;
                    
                    this.db.get('SELECT COUNT(*) as count FROM parts WHERE stock <= min_stock', (err, row) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        stats.pendingParts = row.count;
                        
                        this.db.get(`
                            SELECT SUM(cost) as total 
                            FROM maintenance 
                            WHERE start_date >= date('now', 'start of month')
                        `, (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            stats.monthlyCost = row.total || 0;
                            resolve(stats);
                        });
                    });
                });
            });
        });
    }

    // Cerrar la base de datos
    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = TallerDatabase;
