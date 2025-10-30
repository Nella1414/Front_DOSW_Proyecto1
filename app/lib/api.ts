import axios from 'axios';

// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Instancia de axios configurada
export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
	const token = localStorage.getItem('accessToken');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Tipos
export interface LoginResponse {
	user: {
		id: string;
		email: string;
		displayName: string;
		roles: string[];
		active: boolean;
	};
	accessToken: string;
	tokenType: string;
}

export interface RegisterData {
	email: string;
	password: string;
	name: string;
	displayName: string;
	programId?: string;
}

export interface LoginData {
	email: string;
	password: string;
}

// Funciones de autenticación
export const authApi = {
	login: async (data: LoginData): Promise<LoginResponse> => {
		const response = await api.post('/auth/login', data);
		return response.data;
	},

	register: async (data: RegisterData) => {
		const response = await api.post('/auth/register', data);
		return response.data;
	},

	googleLogin: () => {
		window.location.href = `${API_URL}/auth/google`;
	},

	getCurrentUser: async () => {
		const response = await api.get('/auth/me');
		return response.data;
	},

	logout: () => {
		localStorage.removeItem('accessToken');
		window.location.href = '/login';
	},
};

// Funciones de facultad/programas
export const facultyApi = {
	getAll: async () => {
		const response = await api.get('/faculty');
		return response.data;
	},

	getPrograms: async (facultyId: string) => {
		const response = await api.get(`/programs?facultyId=${facultyId}`);
		return response.data;
	},
};

// Funciones de inscripciones
export const enrollmentApi = {
	unenroll: async (studentCode: string, groupId: string) => {
		const response = await api.delete(
			`/enrollments/${studentCode}/unenroll/${groupId}`,
		);
		return response.data;
	},
};

// Funciones de estudiantes
export const studentApi = {
	// Obtener perfil del estudiante desde /auth/me (incluye student profile)
	getProfile: async () => {
		try {
			console.log(
				'[StudentAPI] Getting user with student profile from /auth/me...',
			);

			// El endpoint /auth/me ahora devuelve { user, student, tokenType }
			const response = await api.get('/auth/me');
			console.log('[StudentAPI] Response from /auth/me:', response.data);

			if (!response.data.student) {
				console.error('[StudentAPI] No student profile found in response');
				console.error('[StudentAPI] User data:', response.data.user);
				throw new Error(
					'Student profile not found for this user. Please contact administrator.',
				);
			}

			console.log('[StudentAPI] Student profile found:', response.data.student);
			return response.data.student;
		} catch (error) {
			console.error('[StudentAPI] Error getting profile:', error);
			throw error;
		}
	},

	// Obtener horario del estudiante
	getSchedule: async () => {
		try {
			console.log('[StudentAPI] Getting student schedule...');

			// Primero obtener el perfil del estudiante para tener su código
			const student = await studentApi.getProfile();
			console.log(
				'[StudentAPI] Getting schedule for student code:',
				student.code,
			);

			// Luego obtener el horario usando el código del estudiante
			const response = await api.get(`/students/${student.code}/schedule`);
			console.log('[StudentAPI] Schedule data:', response.data);

			return response.data;
		} catch (error) {
			console.error('[StudentAPI] Error getting schedule:', error);
			throw error;
		}
	},

	getEnrollments: async () => {
		try {
			console.log('[StudentAPI] Getting enrollments...');
			const response = await api.get('/enrollments/my-enrollments');
			console.log('[StudentAPI] Enrollments data:', response.data);
			return response.data;
		} catch (error) {
			console.error('[StudentAPI] Error getting enrollments:', error);
			throw error;
		}
	},

	getAcademicProgress: async () => {
		try {
			console.log('[StudentAPI] Getting academic progress...');

			// Primero obtener el perfil del estudiante
			const student = await studentApi.getProfile();
			console.log('[StudentAPI] Student for progress:', student);

			// Obtener el semáforo académico usando el externalId del estudiante
			// El backend verifica permisos con externalId, no con code
			const response = await api.get(
				`/academic-traffic-light/${student.externalId}`,
			);
			console.log('[StudentAPI] Progress data:', response.data);
			return response.data;
		} catch (error) {
			console.error('[StudentAPI] Error getting progress:', error);
			throw error;
		}
	},

	getHistoricalSchedules: async () => {
		try {
			console.log('[StudentAPI] Getting historical schedules...');
			const response = await api.get('/schedules/historical');
			console.log('[StudentAPI] Historical schedules data:', response.data);
			return response.data;
		} catch (error) {
			console.error('[StudentAPI] Error getting historical schedules:', error);
			throw error;
		}
	},

	getHistoricalScheduleByPeriod: async (periodId: string) => {
		try {
			console.log(
				'[StudentAPI] Getting historical schedule for period:',
				periodId,
			);
			const response = await api.get(
				`/schedules/historical/period?periodId=${periodId}`,
			);
			console.log('[StudentAPI] Historical schedule data:', response.data);
			return response.data;
		} catch (error) {
			console.error(
				'[StudentAPI] Error getting historical schedule by period:',
				error,
			);
			throw error;
		}
	},
};

// Datos de prueba para simular una API (mantener para demo)
export const mockUsers = [
	{
		id: '1',
		name: 'Juan Pérez García',
		email: 'juan.perez@escuelaing.edu.co',
		role: 'STUDENT',
	},
	{
		id: '2',
		name: 'María González López',
		email: 'maria.gonzalez@escuelaing.edu.co',
		role: 'DEAN',
	},
	{
		id: '3',
		name: 'Carlos Rodríguez Silva',
		email: 'carlos.rodriguez@escuelaing.edu.co',
		role: 'ADMIN',
	},
	{
		id: '4',
		name: 'Ana Martínez Torres',
		email: 'ana.martinez@escuelaing.edu.co',
		role: 'STUDENT',
	},
];

// Genera un número de radicado único para cada registro
export const generateRadicado = () => {
	return `RAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
