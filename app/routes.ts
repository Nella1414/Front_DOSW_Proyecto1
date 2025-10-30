import { index, type RouteConfig, route } from '@react-router/dev/routes';

// Configuración de todas las rutas de la app
// index() es para la ruta raíz (/), route() para rutas específicas
export default [
	index('routes/home/home.tsx'), // La página principal
	route('/admin', 'routes/admin/admin.tsx'), // El panel de administración
	route('/login', 'routes/login/login.tsx'), // La página de inicio de sesión
	route('/register', 'routes/register/register.tsx'), // Registro de estudiantes
	route('/auth/callback', 'routes/auth/callback.tsx'), // Callback de Google OAuth
	route('/complete-profile', 'routes/complete-profile/complete-profile.tsx'), // Completar perfil después de Google OAuth
	route('/academic-progress', 'routes/academic-progress/academic-progress.tsx'), // Progreso académico
	route('/student-dashboard', 'routes/student-dashboard/student-dashboard.tsx'), // Dashboard del estudiante
	route('/admin-dashboard', 'routes/admin-dashboard/admin-dashboard.tsx'), // El dashboard del admin
	route('/faculty-dashboard', 'routes/faculty-dashboard/faculty-dashboard.tsx'), // Dashboard de profesores
] satisfies RouteConfig;
