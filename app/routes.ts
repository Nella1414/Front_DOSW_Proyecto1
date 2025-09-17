import { index, route, type RouteConfig } from '@react-router/dev/routes';

// Configuración de todas las rutas de la app
// index() es para la ruta raíz (/), route() para rutas específicas
export default [
  index('routes/home.tsx'),        // La página principal
  route('/admin', 'routes/admin.tsx')  // El panel de administración
] satisfies RouteConfig;
