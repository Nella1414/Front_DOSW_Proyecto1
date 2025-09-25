import { index, type RouteConfig, route } from '@react-router/dev/routes';

// Configuración de todas las rutas de la app
// index() es para la ruta raíz (/), route() para rutas específicas
export default [
	index('routes/home/home.tsx'), // La página principal
	route('/admin', 'routes/admin/admin.tsx'), // El panel de administración
	route('/login', 'routes/login/login.tsx'), // La página de inicio de sesión
	route('/register', 'routes/register/register.tsx'), // Registro de estudiantes
	route('/admin-dashboard', 'routes/admin-dashboard/admin-dashboard.tsx'), // El dashboard del admin
] satisfies RouteConfig;
