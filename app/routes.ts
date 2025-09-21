import { index, type RouteConfig, route } from '@react-router/dev/routes';

// Configuración de todas las rutas de la app
// index() es para la ruta raíz (/), route() para rutas específicas
export default [
	index('routes/home.tsx'), // La página principal
	route('/admin', 'routes/admin.tsx'), // El panel de administración
	route('/login', 'routes/login.tsx'), // La página de inicio de sesión
] satisfies RouteConfig;
