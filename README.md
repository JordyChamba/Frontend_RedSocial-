# SocialHub Frontend

Frontend de la aplicación SocialHub desarrollado con React 18, TypeScript, Vite y Tailwind CSS.

## 🚀 Tecnologías

- **React 18** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management
- **React Query** - Server state management
- **Axios** - HTTP client
- **Socket.io Client** - Real-time notifications
- **React Hot Toast** - Notifications
- **React Icons** - Icons

## 📋 Requisitos

- Node.js 18+ 
- npm o yarn
- Backend corriendo en `http://localhost:8080`

## 🔧 Instalación

```bash
# Instalar dependencias
npm install

# o con yarn
yarn install
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# o con yarn
yarn dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 🏗️ Build

```bash
# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/         # Componentes React
│   │   ├── auth/          # Componentes de autenticación
│   │   ├── layout/        # Layout components
│   │   ├── post/          # Componentes de posts
│   │   ├── user/          # Componentes de usuario
│   │   └── common/        # Componentes reutilizables
│   │
│   ├── pages/             # Páginas de la aplicación
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── ExplorePage.tsx
│   │   └── NotificationsPage.tsx
│   │
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── userService.ts
│   │   ├── postService.ts
│   │   └── notificationService.ts
│   │
│   ├── store/             # Zustand stores
│   │   └── authStore.ts
│   │
│   ├── types/             # TypeScript types
│   │   ├── user.ts
│   │   ├── post.ts
│   │   ├── notification.ts
│   │   └── api.ts
│   │
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Punto de entrada
│   └── index.css          # Estilos globales
│
├── public/                # Assets públicos
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔐 Autenticación

El frontend maneja automáticamente:
- Almacenamiento de JWT en localStorage
- Refresh automático de tokens
- Redirección a login si el token expira
- Rutas protegidas

## 🌐 Proxy Configuration

Vite está configurado para hacer proxy de las peticiones API al backend:

```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  },
}
```

## 🎨 Estilos

### Clases Personalizadas

```css
.btn              /* Botón base */
.btn-primary      /* Botón primario */
.btn-secondary    /* Botón secundario */
.btn-outline      /* Botón outline */
.input            /* Input de formulario */
.card             /* Card container */
```

### Colores Primarios

```
primary-50  a primary-900
```

## 📦 Scripts Disponibles

```bash
npm run dev       # Desarrollo
npm run build     # Build producción
npm run lint      # Lint código
npm run preview   # Preview build
```

## 🔗 Variables de Entorno

Crear archivo `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

## 🚀 Estado Actual

### ✅ Implementado:
- Configuración base de Vite + React + TypeScript
- Tailwind CSS configurado
- React Router con rutas protegidas
- Zustand store para autenticación
- React Query para caché
- Axios client con interceptors
- Types TypeScript completos
- Servicios API para todas las entidades

### 🔜 Por Implementar:
- Páginas completas (Login, Register, Home, etc.)
- Componentes de UI (Post, Comment, User)
- WebSocket para notificaciones en tiempo real
- Upload de imágenes
- Formularios y validaciones
- Infinite scroll para posts
- Sistema de búsqueda
- Dark mode

## 🧪 Testing

```bash
# Ejecutar tests (cuando se implementen)
npm run test
```

## 📚 Recursos

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://github.com/pmndrs/zustand)

## 👨‍💻 Desarrollo

Creado como parte del proyecto Full Stack SocialHub.
