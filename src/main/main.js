const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev');
const TallerDatabase = require('../database/database');

// Mantener una referencia global del objeto de ventana
let mainWindow;
let database;

function createWindow() {
  // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, '../../assets/icon.ico'),
    title: 'Sistema Taller Forzani'
  });

  // Cargar el archivo index.html de la aplicación
  if (isDev) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    // Abrir las herramientas de desarrollador en modo desarrollo
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Emitido cuando la ventana es cerrada
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador
app.whenReady().then(async () => {
    // Inicializar la base de datos
    database = new TallerDatabase();
    await database.init();
    createWindow();
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', () => {
  // En macOS es común para aplicaciones y sus barras de menú
  // permanecer activas hasta que el usuario salga explícitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // En macOS es común recrear una ventana en la aplicación cuando el
  // icono del dock es clickeado y no hay otras ventanas abiertas
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Crear menú personalizado
const template = [
  {
    label: 'Archivo',
    submenu: [
      {
        label: 'Nuevo Vehículo',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          mainWindow.webContents.send('menu-new-vehicle');
        }
      },
      {
        label: 'Nuevo Mantenimiento',
        accelerator: 'CmdOrCtrl+M',
        click: () => {
          mainWindow.webContents.send('menu-new-maintenance');
        }
      },
      { type: 'separator' },
      {
        label: 'Salir',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Ver',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Ayuda',
    submenu: [
      {
        label: 'Acerca de',
        click: () => {
          mainWindow.webContents.send('menu-about');
        }
      }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// Manejar eventos IPC
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('get-app-name', () => {
  return app.getName();
});

// Eventos de la base de datos
ipcMain.handle('db-get-vehicles', () => {
  return database.getAllVehicles();
});

ipcMain.handle('db-get-parts', () => {
  return database.getAllParts();
});

ipcMain.handle('db-get-maintenance', () => {
  return database.getAllMaintenance();
});

ipcMain.handle('db-get-dashboard-stats', () => {
  return database.getDashboardStats();
});

ipcMain.handle('db-add-vehicle', (event, vehicle) => {
  return database.addVehicle(vehicle);
});

ipcMain.handle('db-add-part', (event, part) => {
  return database.addPart(part);
});

ipcMain.handle('db-add-maintenance', (event, maintenance) => {
  return database.addMaintenance(maintenance);
});
