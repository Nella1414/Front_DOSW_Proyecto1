import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
} from '@heroui/react';
import type React from 'react';
import { useEffect, useState } from 'react';

export interface ClassroomDetail {
	id: string;
	name: string;
	capacity: number;
	type: 'aula' | 'laboratorio' | 'auditorio' | 'taller';
	location: string;
	description: string;
}

export interface ScheduleItem {
	id: string;
	subject: string;
	group: string;
	classroom: ClassroomDetail;
	day: string;
	startTime: string;
	endTime: string;
	status: 'occupied' | 'available' | 'conflict';
	teacher: string;
	credits: number;
	finalGrade?: number;
}

export interface ScheduleData {
	week: string;
	weekStart: string;
	items: ScheduleItem[];
}

export interface AcademicSemester {
	year: number;
	semester: number;
	label: string;
	enrollmentStart: string;
	enrollmentEnd: string;
	classesStart: string;
	classesEnd: string;
}

export interface ScheduleGridProps {
	semester: AcademicSemester;
	isCurrentSemester: boolean;
}

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const timeSlots = [
	'6:00 AM',
	'7:00 AM',
	'8:00 AM',
	'9:00 AM',
	'10:00 AM',
	'11:00 AM',
	'12:00 PM',
	'1:00 PM',
	'2:00 PM',
	'3:00 PM',
	'4:00 PM',
	'5:00 PM',
	'6:00 PM',
	'7:00 PM',
	'8:00 PM',
	'9:00 PM',
];

const getWeekStart = (date: Date): Date => {
	const day = date.getDay();
	const diff = date.getDate() - day + (day === 0 ? -6 : 1);
	return new Date(date.setDate(diff));
};

// Materias en progreso del plan académico
const subjectsInProgress = [
	{
		id: '9',
		name: 'Probabilidad y Estadística',
		credits: 3,
		status: 'en_progreso',
	},
	{
		id: '18',
		name: 'Arquitectura y Servicios de Red',
		credits: 3,
		status: 'en_progreso',
	},
	{
		id: '19',
		name: 'Fundamentos de Seguridad de la Información',
		credits: 3,
		status: 'en_progreso',
	},
	{
		id: '21',
		name: 'Desarrollo y Operaciones Software',
		credits: 4,
		status: 'en_progreso',
	},
];

const fetchSchedule = async (
	weekStart?: string,
	semesterLabel?: string,
): Promise<ScheduleData> => {
	await new Promise((resolve) => setTimeout(resolve, 1500));

	const selectedWeek =
		weekStart || getWeekStart(new Date()).toISOString().split('T')[0];
	const weekStartDate = new Date(selectedWeek);
	const weekEndDate = new Date(weekStartDate);
	weekEndDate.setDate(weekStartDate.getDate() + 6);

	const generateSemesterData = (semester: string) => {
		const currentYear = new Date().getFullYear();
		const isCurrentSemester =
			semester === `${currentYear}-${new Date().getMonth() <= 6 ? 1 : 2}`;

		const semesterYear = parseInt(semester.split('-')[0], 10);
		const hasHistoricalRecords = semesterYear >= currentYear - 2;

		if (isCurrentSemester) {
			// Generar horario basado en las materias en progreso
			const scheduleItems: ScheduleItem[] = [];

			// Horarios base para distribuir las materias
			const timeSlots = [
				{ day: 'Lunes', startTime: '8:00 AM', endTime: '10:00 AM' },
				{ day: 'Lunes', startTime: '10:00 AM', endTime: '12:00 PM' },
				{ day: 'Martes', startTime: '8:00 AM', endTime: '10:00 AM' },
				{ day: 'Martes', startTime: '2:00 PM', endTime: '4:00 PM' },
				{ day: 'Miércoles', startTime: '8:00 AM', endTime: '10:00 AM' },
				{ day: 'Miércoles', startTime: '2:00 PM', endTime: '4:00 PM' },
				{ day: 'Jueves', startTime: '10:00 AM', endTime: '12:00 PM' },
				{ day: 'Jueves', startTime: '4:00 PM', endTime: '6:00 PM' },
				{ day: 'Viernes', startTime: '8:00 AM', endTime: '10:00 AM' },
			];

			// Aulas disponibles
			const classrooms = [
				{
					id: 'A-101',
					name: 'A-101',
					capacity: 40,
					type: 'aula' as const,
					location: 'Edificio A, Piso 1',
					description: 'Aula estándar con capacidad para 40 estudiantes',
				},
				{
					id: 'L-201',
					name: 'L-201',
					capacity: 30,
					type: 'laboratorio' as const,
					location: 'Edificio L, Piso 2',
					description: 'Laboratorio de computación con 30 equipos',
				},
				{
					id: 'A-301',
					name: 'A-301',
					capacity: 50,
					type: 'aula' as const,
					location: 'Edificio A, Piso 3',
					description: 'Aula amplia con capacidad para 50 estudiantes',
				},
				{
					id: 'A-201',
					name: 'A-201',
					capacity: 35,
					type: 'aula' as const,
					location: 'Edificio A, Piso 2',
					description: 'Aula estándar con capacidad para 35 estudiantes',
				},
			];

			// Profesores disponibles
			const teachers = [
				'Dr. García',
				'Ing. Martínez',
				'Dra. López',
				'Dr. Rodríguez',
				'Prof. Smith',
			];

			// Crear horario para cada materia en progreso
			subjectsInProgress.forEach((subject, index) => {
				const timeSlot = timeSlots[index % timeSlots.length];
				const classroom = classrooms[index % classrooms.length];
				const teacher = teachers[index % teachers.length];

				scheduleItems.push({
					id: subject.id,
					subject: subject.name,
					group: 'A',
					classroom,
					day: timeSlot.day,
					startTime: timeSlot.startTime,
					endTime: timeSlot.endTime,
					status: 'occupied' as const,
					teacher,
					credits: subject.credits,
				});
			});

			// Agregar algunas materias adicionales para completar el horario
			scheduleItems.push(
				{
					id: 'extra-1',
					subject: 'Cálculo Diferencial',
					group: 'A',
					classroom: {
						id: 'A-102',
						name: 'A-102',
						capacity: 40,
						type: 'aula' as const,
						location: 'Edificio A, Piso 1',
						description: 'Aula estándar con capacidad para 40 estudiantes',
					},
					day: 'Lunes',
					startTime: '8:00 AM',
					endTime: '10:00 AM',
					status: 'conflict' as const,
					teacher: 'Dr. García',
					credits: 4,
				},
				{
					id: 'extra-2',
					subject: 'Inglés I',
					group: 'A',
					classroom: {
						id: 'A-401',
						name: 'A-401',
						capacity: 25,
						type: 'aula' as const,
						location: 'Edificio A, Piso 4',
						description: 'Aula de idiomas con capacidad para 25 estudiantes',
					},
					day: 'Viernes',
					startTime: '8:00 AM',
					endTime: '10:00 AM',
					status: 'occupied' as const,
					teacher: 'Prof. Smith',
					credits: 2,
				},
			);

			return scheduleItems;
		} else if (hasHistoricalRecords) {
			return [
				{
					id: '1',
					subject: 'Matemáticas Básicas',
					group: 'A',
					classroom: {
						id: 'A-101',
						name: 'A-101',
						capacity: 35,
						type: 'aula' as const,
						location: 'Edificio A, Piso 1',
						description: 'Aula estándar con capacidad para 35 estudiantes',
					},
					day: 'Lunes',
					startTime: '8:00 AM',
					endTime: '10:00 AM',
					status: 'occupied' as const,
					teacher: 'Prof. López',
					credits: 3,
					finalGrade: 4.2,
				},
				{
					id: '2',
					subject: 'Introducción a la Programación',
					group: 'A',
					classroom: {
						id: 'L-101',
						name: 'L-101',
						capacity: 25,
						type: 'laboratorio' as const,
						location: 'Edificio L, Piso 1',
						description: 'Laboratorio básico con 25 equipos',
					},
					day: 'Martes',
					startTime: '10:00 AM',
					endTime: '12:00 PM',
					status: 'occupied' as const,
					teacher: 'Ing. García',
					credits: 2,
					finalGrade: 4.5,
				},
				{
					id: '3',
					subject: 'Fundamentos de Física',
					group: 'A',
					classroom: {
						id: 'A-201',
						name: 'A-201',
						capacity: 40,
						type: 'aula' as const,
						location: 'Edificio A, Piso 2',
						description: 'Aula estándar con capacidad para 40 estudiantes',
					},
					day: 'Miércoles',
					startTime: '2:00 PM',
					endTime: '4:00 PM',
					status: 'occupied' as const,
					teacher: 'Dra. Martínez',
					credits: 3,
					finalGrade: 3.8,
				},
			];
		} else {
			return [];
		}
	};

	return {
		week: `${weekStartDate.toLocaleDateString('es-ES')} a ${weekEndDate.toLocaleDateString('es-ES')}`,
		weekStart: selectedWeek,
		items: generateSemesterData(
			semesterLabel ||
				`${new Date().getFullYear()}-${new Date().getMonth() <= 6 ? 1 : 2}`,
		),
	};
};

const detectConflicts = (items: ScheduleItem[]): ScheduleItem[][] => {
	const conflicts: ScheduleItem[][] = [];
	const timeMap = new Map<string, ScheduleItem[]>();

	items.forEach((item) => {
		const key = `${item.day}-${item.startTime}`;
		if (!timeMap.has(key)) {
			timeMap.set(key, []);
		}
		timeMap.get(key)?.push(item);
	});

	timeMap.forEach((items) => {
		if (items.length > 1) {
			conflicts.push(items);
		}
	});

	return conflicts;
};

export const ScheduleGrid: React.FC<ScheduleGridProps> = ({
	semester,
	isCurrentSemester,
}) => {
	const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
	const [loading, setLoading] = useState(true);
	const [selectedWeek, setSelectedWeek] = useState<string>('');
	const [selectedClassroom, setSelectedClassroom] =
		useState<ClassroomDetail | null>(null);
	const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
	const [isConflictsModalOpen, setIsConflictsModalOpen] = useState(false);
	const [hasNoHistoricalRecords, setHasNoHistoricalRecords] = useState(false);

	const conflicts = scheduleData ? detectConflicts(scheduleData.items) : [];
	const totalConflicts = conflicts.length;

	useEffect(() => {
		const loadSchedule = async () => {
			setLoading(true);
			try {
				const weekStart =
					selectedWeek || getWeekStart(new Date()).toISOString().split('T')[0];
				const data = await fetchSchedule(weekStart, semester.label);

				const semesterYear = parseInt(semester.label.split('-')[0], 10);
				const currentYear = new Date().getFullYear();
				setHasNoHistoricalRecords(semesterYear < currentYear - 2);

				setScheduleData(data);
			} catch (error) {
				console.error('Error loading schedule:', error);
			} finally {
				setLoading(false);
			}
		};

		loadSchedule();
	}, [selectedWeek, semester.label]);

	const handleWeekChange = (direction: 'prev' | 'next') => {
		if (!scheduleData) return;

		const currentWeek = new Date(scheduleData.weekStart);
		const newWeek = new Date(currentWeek);

		if (direction === 'prev') {
			newWeek.setDate(currentWeek.getDate() - 7);
		} else {
			newWeek.setDate(currentWeek.getDate() + 7);
		}

		setSelectedWeek(newWeek.toISOString().split('T')[0]);
	};

	const _getTimeSlotIndex = (time: string): number => {
		return timeSlots.indexOf(time);
	};

	const getClassroomColor = (status: string) => {
		switch (status) {
			case 'occupied':
				return 'bg-primary-100 text-primary-800 border-primary-200';
			case 'conflict':
				return 'bg-danger-50 text-danger-800 border-danger-200';
			case 'available':
				return 'bg-success-100 text-success-800 border-success-200';
			default:
				return 'bg-default-100 text-default-800 border-default-200';
		}
	};

	const _getStatusChip = (status: string) => {
		switch (status) {
			case 'occupied':
				return (
					<Chip size="sm" color="primary" variant="flat">
						Ocupado
					</Chip>
				);
			case 'conflict':
				return (
					<Chip size="sm" color="danger" variant="flat">
						Conflicto
					</Chip>
				);
			case 'available':
				return (
					<Chip size="sm" color="success" variant="flat">
						Disponible
					</Chip>
				);
			default:
				return (
					<Chip size="sm" color="default" variant="flat">
						N/A
					</Chip>
				);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<Spinner size="lg" label="Cargando horario académico..." />
			</div>
		);
	}

	if (hasNoHistoricalRecords) {
		return (
			<Card radius="sm" shadow="sm">
				<CardBody className="text-center py-12">
					<p className="text-lg text-default-500">
						No hay registros históricos disponibles para este período.
					</p>
					<p className="text-sm text-default-400 mt-2">
						Los registros están disponibles para los últimos 2 años.
					</p>
				</CardBody>
			</Card>
		);
	}

	if (!scheduleData || scheduleData.items.length === 0) {
		return (
			<Card radius="sm" shadow="sm">
				<CardBody className="text-center py-12">
					<p className="text-lg text-default-500">
						No hay clases programadas para esta semana.
					</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			{isCurrentSemester && (
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h2 className="text-xl font-semibold">Horario Académico</h2>
						<p className="text-sm text-default-500">{scheduleData.week}</p>
					</div>
					<div className="flex items-center gap-2">
						{totalConflicts > 0 && (
							<Badge
								content={totalConflicts}
								color="danger"
								placement="top-right"
								className="cursor-pointer"
								onClick={() => setIsConflictsModalOpen(true)}
							>
								<Button
									size="sm"
									variant="flat"
									color="danger"
									onPress={() => setIsConflictsModalOpen(true)}
								>
									Conflictos de Horario
								</Button>
							</Badge>
						)}
						<Button
							size="sm"
							variant="flat"
							onPress={() => handleWeekChange('prev')}
						>
							← Semana Anterior
						</Button>
						<Button
							size="sm"
							variant="flat"
							onPress={() => handleWeekChange('next')}
						>
							Semana Siguiente →
						</Button>
					</div>
				</div>
			)}

			<div className="w-full">
				<Card radius="sm" shadow="sm">
					<CardHeader>
						<h3 className="text-lg font-semibold">Horario Académico</h3>
					</CardHeader>
					<CardBody>
						<div className="overflow-x-auto">
							<table className="w-full border-collapse">
								<thead>
									<tr>
										<th className="w-20 p-2 text-xs font-medium text-left border-b">
											Hora
										</th>
										{days.map((day) => (
											<th
												key={day}
												className="w-24 p-2 text-xs font-medium text-center border-b"
											>
												{day}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{timeSlots.map((time) => (
										<tr key={time}>
											<td className="p-2 text-xs font-medium text-center border-b">
												{time}
											</td>
											{days.map((day) => {
												const classItem = scheduleData.items.find(
													(item) => item.day === day && item.startTime === time,
												);
												return (
													<td key={`${day}-${time}`} className="p-1 border-b">
														{classItem ? (
															<div
																className={`p-2 rounded text-xs cursor-pointer transition-colors ${getClassroomColor(classItem.status)}`}
																onClick={() => {
																	setSelectedClassroom(classItem.classroom);
																	setIsClassroomModalOpen(true);
																}}
															>
																<div className="font-medium">
																	{classItem.subject}
																</div>
																<div className="text-xs opacity-75">
																	{classItem.classroom.name}
																</div>
																<div className="text-xs opacity-75">
																	{classItem.teacher}
																</div>
															</div>
														) : (
															<div className="h-12"></div>
														)}
													</td>
												);
											})}
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardBody>
				</Card>
			</div>

			<Modal
				isOpen={isClassroomModalOpen}
				onClose={() => setIsClassroomModalOpen(false)}
				placement="center"
			>
				<ModalContent>
					<ModalHeader>Detalles del Aula</ModalHeader>
					<ModalBody>
						{selectedClassroom && (
							<div className="space-y-4">
								<div>
									<h4 className="font-semibold">{selectedClassroom.name}</h4>
									<p className="text-sm text-default-500">
										{selectedClassroom.location}
									</p>
								</div>
								<div className="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span className="font-medium">Capacidad:</span>{' '}
										{selectedClassroom.capacity}
									</div>
									<div>
										<span className="font-medium">Tipo:</span>{' '}
										{selectedClassroom.type}
									</div>
								</div>
								<div>
									<span className="font-medium">Descripción:</span>
									<p className="text-sm text-default-600 mt-1">
										{selectedClassroom.description}
									</p>
								</div>
							</div>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>

			<Modal
				isOpen={isConflictsModalOpen}
				onClose={() => setIsConflictsModalOpen(false)}
				placement="center"
				size="2xl"
			>
				<ModalContent>
					<ModalHeader>Conflictos de Horario</ModalHeader>
					<ModalBody>
						{conflicts.length === 0 ? (
							<p className="text-center text-default-500 py-4">
								No se encontraron conflictos de horario.
							</p>
						) : (
							<div className="space-y-4">
								{conflicts.map((conflictGroup, index) => (
									<Card key={index} radius="sm" className="border-danger-200">
										<CardBody>
											<div className="space-y-2">
												<h4 className="font-semibold text-danger-700">
													Conflicto {index + 1}: {conflictGroup[0].day}{' '}
													{conflictGroup[0].startTime}
												</h4>
												{conflictGroup.map((item) => (
													<div
														key={item.id}
														className="flex justify-between items-center p-2 bg-danger-50 rounded"
													>
														<div>
															<span className="font-medium">
																{item.subject}
															</span>{' '}
															- {item.group}
														</div>
														<div className="text-sm text-danger-600">
															{item.classroom.name} - {item.teacher}
														</div>
													</div>
												))}
											</div>
										</CardBody>
									</Card>
								))}
							</div>
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
};
