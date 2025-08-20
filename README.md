# Sistema Taller Forzani

Sistema de gestión de taller para Grupo Forzani, desarrollado como aplicación de escritorio usando Electron y React.

## 🚀 Características

- **Gestión de Vehículos**: Registro y control de la flota (tractores, cosechadoras, camiones, camionetas)
- **Mantenimientos**: Control de mantenimientos preventivos y reparaciones
- **Inventario de Repuestos**: Gestión de stock y proveedores
- **Reportes**: Generación de informes y estadísticas
- **Base de Datos Local**: SQLite para almacenamiento persistente
- **Interfaz Moderna**: Diseño responsive y fácil de usar

## 🛠️ Tecnologías Utilizadas

- **Electron**: Framework para aplicaciones de escritorio
- **React**: Biblioteca para la interfaz de usuario
- **SQLite**: Base de datos local
- **Node.js**: Runtime de JavaScript
- **CSS3**: Estilos modernos y responsive

## 📋 Requisitos del Sistema

- Windows 10 o superior
- Node.js 16+ (se instala automáticamente)
- 4GB RAM mínimo
- 500MB espacio en disco

## 🚀 Instalación y Uso

### Desarrollo

1. **Clonar el repositorio**:
   ```bash
   git clone [url-del-repositorio]
   cd taller-app
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**:
   ```bash
   npm run dev
   ```

### Producción

1. **Construir la aplicación**:
   ```bash
   npm run build
   ```

2. **Crear instalador**:
   ```bash
   npm run dist
   ```

3. **Ejecutar la aplicación**:
   ```bash
   npm start
   ```

## 📁 Estructura del Proyecto

```
taller-app/
├── src/
│   ├── main/           # Proceso principal de Electron
│   ├── renderer/       # Aplicación React
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Páginas de la aplicación
│   │   └── styles/     # Archivos CSS
│   ├── database/       # Configuración de base de datos
│   └── shared/         # Lógica compartida
├── assets/             # Iconos e imágenes
├── dist/               # Build de producción
└── package.json        # Configuración del proyecto
```

## 🗄️ Base de Datos

La aplicación utiliza SQLite con las siguientes tablas principales:

- **vehicles**: Información de vehículos
- **parts**: Inventario de repuestos
- **maintenance**: Registro de mantenimientos
- **maintenance_parts**: Repuestos usados en mantenimientos
- **suppliers**: Proveedores

## 🎯 Funcionalidades Principales

### Dashboard
- Vista general del taller
- Estadísticas en tiempo real
- Alertas de mantenimientos pendientes
- Acciones rápidas

### Gestión de Vehículos
- Registro de nuevos vehículos
- Control de estado y mantenimientos
- Historial de reparaciones
- Programación de mantenimientos

### Mantenimientos
- Creación de órdenes de trabajo
- Asignación de técnicos
- Control de costos
- Seguimiento de estado

### Repuestos
- Control de inventario
- Alertas de stock mínimo
- Gestión de proveedores
- Movimientos de stock

### Reportes
- Reportes mensuales
- Análisis de costos
- Estadísticas por vehículo
- Exportación de datos

## 🔧 Configuración

### Variables de Entorno
- `NODE_ENV`: Entorno de ejecución (development/production)
- `ELECTRON_IS_DEV`: Modo desarrollo de Electron

### Configuración de Base de Datos
La base de datos se crea automáticamente en:
- Windows: `%APPDATA%/taller-app/taller.db`

## 📊 Datos de Ejemplo

La aplicación incluye datos de ejemplo para demostración:
- 4 vehículos (tractores, cosechadoras, camiones)
- 5 tipos de repuestos
- 2 mantenimientos de ejemplo

## 🚀 Próximas Funcionalidades

- [ ] Sincronización con servidor central
- [ ] App móvil complementaria
- [ ] Integración con sistemas contables
- [ ] Notificaciones push
- [ ] Backup automático en la nube
- [ ] Módulo de facturación
- [ ] Gestión de personal

## 👥 Roles del Sistema

### Encargado del Taller
- Gestión diaria de vehículos
- Control de mantenimientos
- Administración de repuestos

### Dueño de la Empresa
- Reportes de costos
- Análisis de eficiencia
- Toma de decisiones estratégicas

### Encargado de Sistemas
- Mantenimiento técnico
- Actualizaciones del sistema
- Soporte técnico

## 📞 Soporte

Para soporte técnico o consultas:
- Email: [email-del-soporte]
- Teléfono: [número-de-soporte]
- Horario: Lunes a Viernes 8:00 - 18:00

## 📄 Licencia

Este proyecto es propiedad de Grupo Forzani y está destinado para uso interno de la empresa.

## 🤝 Contribución

Para contribuir al desarrollo:
1. Crear una rama para la nueva funcionalidad
2. Desarrollar y probar los cambios
3. Crear un Pull Request
4. Revisión y aprobación del equipo

---

**Desarrollado para Grupo Forzani** 🏭
*Sistema de Gestión de Taller v1.0.0*
