import type { CapacityStatus, Group, Subject } from './types';

// Utilidad para combinar clases CSS
export function clsx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

// Calcular el estado de capacidad del grupo
export function calculateCapacityStatus(
	currentEnrollments: number,
	maxStudents: number,
): CapacityStatus {
	const percentage = Math.round((currentEnrollments / maxStudents) * 100);

	if (currentEnrollments >= maxStudents) {
		return { color: 'danger', label: 'Lleno', percentage };
	}
	if (percentage >= 90) {
		return { color: 'warning', label: 'Casi Lleno', percentage };
	}
	return { color: 'success', label: 'Disponible', percentage };
}

// Datos mock de materias
export const mockSubjects: Subject[] = [
	{ id: '1', name: 'Cálculo Diferencial', code: 'MAT101', currentGroup: 'B' },
	{ id: '2', name: 'Programación I', code: 'SIS101', currentGroup: 'A' },
	{ id: '3', name: 'Física I', code: 'FIS101', currentGroup: 'C' },
	{ id: '4', name: 'Algoritmos', code: 'SIS102', currentGroup: 'B' },
];

// Datos mock de grupos
export const mockGroups: Group[] = [
	{
		id: '1',
		name: 'Grupo A',
		schedule: 'Lun-Mié 10:00-11:30',
		professor: 'Dr. García',
		currentEnrollments: 32,
		maxStudents: 35,
	},
	{
		id: '2',
		name: 'Grupo B',
		schedule: 'Mar-Jue 14:00-15:30',
		professor: 'Dra. Martínez',
		currentEnrollments: 20,
		maxStudents: 35,
	},
	{
		id: '3',
		name: 'Grupo C',
		schedule: 'Mié-Vie 08:00-09:30',
		professor: 'Dr. López',
		currentEnrollments: 35,
		maxStudents: 35,
	},
];
