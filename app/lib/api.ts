// Datos de prueba para simular una API
// En producción esto se reemplazaría con llamadas reales al backend

// Lista de usuarios fake para probar la gestión de roles
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
// Usa timestamp + número random para que sea único
export const generateRadicado = () => {
	return `RAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
