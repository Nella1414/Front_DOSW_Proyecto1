import {
	Alert,
	Card,
	CardBody,
	CardHeader,
	Select,
	SelectItem,
	Spinner,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { studentApi } from '../lib/api';

interface ClassBlock {
	id: string;
	courseName: string;
	classroom: string;
	teacher: string;
	startTime: string;
	endTime: string;
	day: string;
}

interface ScheduleData {
	[day: string]: {
		[timeSlot: string]: ClassBlock | null;
	};
}

interface ScheduleFromBackend {
	_id?: string;
	id?: string;
	courseName?: string;
	courseCode?: string;
	courseId?: string;
	course?: { name: string };
	classroom?: string;
	room?: string;
	teacher?: string;
	instructor?: string;
	professorName?: string;
	startTime: string;
	endTime: string;
	day: string;
}

interface HistoricalPeriod {
	periodId: string;
	periodCode: string;
	enrollmentCount: number;
}

interface HistoricalClass {
	_id?: string;
	courseCode?: string;
	courseId?: string;
	courseName: string;
	groupNumber: string;
	instructor?: string;
	professorName?: string;
	startTime: string;
	endTime: string;
	room?: string;
}

interface DaySchedule {
	dayName: string;
	dayOfWeek: number;
	classes: ScheduleFromBackend[] | HistoricalClass[];
}

const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];

// Función para convertir horario de 24h a formato legible
function formatTime(time: string): string {
	const [hours, minutes] = time.split(':');
	return `${hours}:${minutes}`;
}

// Función para generar slots de tiempo dinámicos
function generateTimeSlots(schedules: ScheduleFromBackend[]): string[] {
	const times = new Set<string>();

	schedules.forEach((schedule) => {
		times.add(schedule.startTime);
		times.add(schedule.endTime);
	});

	const sortedTimes = Array.from(times).sort();
	const slots: string[] = [];

	for (let i = 0; i < sortedTimes.length - 1; i++) {
		slots.push(
			`${formatTime(sortedTimes[i])}–${formatTime(sortedTimes[i + 1])}`,
		);
	}

	return slots.length > 0
		? slots
		: ['07:00–08:30', '08:30–10:00', '10:00–11:30'];
}

// Mapeo de nombres de días en inglés a español
const DAY_NAME_MAP: Record<string, string> = {
	Monday: 'LUNES',
	Tuesday: 'MARTES',
	Wednesday: 'MIÉRCOLES',
	Thursday: 'JUEVES',
	Friday: 'VIERNES',
	Saturday: 'SÁBADO',
	Sunday: 'DOMINGO',
};

// Función para convertir datos del backend a formato de horario
function transformScheduleData(schedules: ScheduleFromBackend[]): {
	data: ScheduleData;
	timeSlots: string[];
} {
	const scheduleData: ScheduleData = {};

	// Inicializar días
	DAYS.forEach((day) => {
		scheduleData[day] = {};
	});

	// Generar slots de tiempo dinámicamente
	const timeSlots = generateTimeSlots(schedules);

	// Llenar con datos del backend
	schedules.forEach((schedule) => {
		// Convertir día del inglés al español si es necesario
		let dayKey = schedule.day.toUpperCase();
		if (DAY_NAME_MAP[schedule.day]) {
			dayKey = DAY_NAME_MAP[schedule.day];
		}

		const timeSlot = `${formatTime(schedule.startTime)}–${formatTime(schedule.endTime)}`;
		console.log(
			`[transformScheduleData] Mapping ${schedule.day} → ${dayKey}, timeSlot: ${timeSlot}`,
		);

		if (scheduleData[dayKey]) {
			scheduleData[dayKey][timeSlot] = {
				id: schedule._id || schedule.id || 'unknown',
				courseName:
					schedule.courseName || schedule.course?.name || 'Sin nombre',
				classroom: schedule.classroom || 'Por definir',
				teacher: schedule.teacher || schedule.instructor || 'Por asignar',
				startTime: schedule.startTime,
				endTime: schedule.endTime,
				day: schedule.day,
			};
			console.log(
				`[transformScheduleData] Added class to ${dayKey}[${timeSlot}]:`,
				scheduleData[dayKey][timeSlot],
			);
		} else {
			console.warn(
				`[transformScheduleData] Day ${dayKey} not found in scheduleData`,
			);
		}
	});

	return { data: scheduleData, timeSlots };
}

export function AcademicSchedule() {
	const [viewMode, setViewMode] = useState<'current' | 'historical'>('current');
	const [selectedPeriod, setSelectedPeriod] = useState<string>('');

	// Obtener horario actual del backend
	const {
		data: currentScheduleResponse,
		isLoading: currentLoading,
		error: currentError,
	} = useQuery({
		queryKey: ['student-schedule'],
		queryFn: studentApi.getSchedule,
		retry: 1,
		enabled: viewMode === 'current',
	});

	// Obtener horarios históricos
	const {
		data: historicalData,
		isLoading: historicalLoading,
		error: historicalError,
	} = useQuery({
		queryKey: ['historical-schedules'],
		queryFn: studentApi.getHistoricalSchedules,
		retry: 1,
		enabled: viewMode === 'historical',
	});

	// Obtener horario específico de un período
	const {
		data: periodScheduleResponse,
		isLoading: periodLoading,
		error: periodError,
	} = useQuery({
		queryKey: ['historical-schedule-period', selectedPeriod],
		queryFn: () => studentApi.getHistoricalScheduleByPeriod(selectedPeriod),
		retry: 1,
		enabled: viewMode === 'historical' && !!selectedPeriod,
	});

	const isLoading =
		viewMode === 'current'
			? currentLoading
			: selectedPeriod
				? periodLoading
				: historicalLoading;
	const error =
		viewMode === 'current'
			? currentError
			: selectedPeriod
				? periodError
				: historicalError;

	// Determinar qué horario mostrar y transformar si es necesario
	let schedulesResponse = currentScheduleResponse;

	// Verificar si la respuesta tiene estructura {schedule: Array} (nuevo formato backend)
	if (
		currentScheduleResponse &&
		typeof currentScheduleResponse === 'object' &&
		'schedule' in currentScheduleResponse
	) {
		const scheduleData = (
			currentScheduleResponse as { schedule: DaySchedule[] | undefined }
		).schedule;
		console.log('[AcademicSchedule] Processing schedule data:', scheduleData);
		if (scheduleData && Array.isArray(scheduleData)) {
			schedulesResponse = scheduleData.flatMap((day) => {
				console.log('[AcademicSchedule] Processing day:', day);
				return (day.classes || []).map((cls) => {
					console.log('[AcademicSchedule] Processing class:', cls);
					return {
						courseName: cls.courseName || '',
						course: { name: cls.courseName || '' },
						classroom: cls.room || 'Por asignar',
						teacher: cls.instructor || cls.professorName || 'Por asignar',
						startTime: cls.startTime || '',
						endTime: cls.endTime || '',
						day: day.dayName || String(day.dayOfWeek),
						_id:
							cls._id || cls.courseId || `${cls.courseCode}-${day.dayOfWeek}`,
					};
				});
			});
			console.log(
				'[AcademicSchedule] Final schedulesResponse:',
				schedulesResponse,
			);
		}
	}

	if (viewMode === 'historical' && selectedPeriod && periodScheduleResponse) {
		// El backend devuelve datos estructurados, extraer el schedule
		const schedule = periodScheduleResponse.schedule as
			| DaySchedule[]
			| undefined;
		schedulesResponse =
			schedule?.flatMap(
				(day) =>
					day.classes?.map((cls) => ({
						courseName: cls.courseName,
						course: { name: cls.courseName },
						classroom: cls.room || 'Por asignar',
						teacher: 'Histórico',
						startTime: cls.startTime,
						endTime: cls.endTime,
						day: day.dayName || String(day.dayOfWeek),
						_id: `${cls.courseCode}-${day.dayOfWeek}`,
					})) || [],
			) || [];
	}

	if (isLoading) {
		return (
			<Card radius="sm" shadow="sm">
				<CardHeader>
					<h3 className="text-lg font-semibold">Horario Académico</h3>
				</CardHeader>
				<CardBody className="flex items-center justify-center min-h-[400px]">
					<Spinner size="lg" color="primary" />
					<p className="mt-4 text-default-600">Cargando horario...</p>
				</CardBody>
			</Card>
		);
	}

	if (error) {
		console.error('[AcademicSchedule] Error loading schedule:', error);
		return (
			<Card radius="sm" shadow="sm">
				<CardHeader>
					<h3 className="text-lg font-semibold">Horario Académico</h3>
				</CardHeader>
				<CardBody className="flex items-center justify-center min-h-[400px]">
					<p className="text-danger">
						Error al cargar el horario. Por favor, intenta de nuevo.
					</p>
				</CardBody>
			</Card>
		);
	}

	// Asegurarse de que schedulesResponse sea un array
	console.log('[AcademicSchedule] Schedules response:', schedulesResponse);
	const schedules = Array.isArray(schedulesResponse) ? schedulesResponse : [];
	console.log('[AcademicSchedule] Schedules array:', schedules);

	// Si está en modo histórico pero no ha seleccionado período, no procesar
	if (viewMode === 'historical' && !selectedPeriod) {
		// El mensaje ya se muestra en el header
		return (
			<Card radius="sm" shadow="sm">
				<CardHeader className="flex flex-col gap-3">
					<div className="flex justify-between items-center w-full">
						<h3 className="text-lg font-semibold">Horario Académico</h3>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => {
									setViewMode('current');
									setSelectedPeriod('');
								}}
								className="px-4 py-2 text-sm rounded-lg bg-default-100 text-default-600 hover:bg-default-200"
							>
								Actual
							</button>
							<button
								type="button"
								onClick={() => setViewMode('historical')}
								className="px-4 py-2 text-sm rounded-lg bg-primary text-white"
							>
								Histórico
							</button>
						</div>
					</div>

					{historicalData?.periods && (
						<div className="w-full">
							<Select
								label="Seleccionar Período"
								placeholder="Escoge un período académico"
								selectedKeys={[]}
								onSelectionChange={(keys) => {
									const value = Array.from(keys)[0] as string;
									setSelectedPeriod(value);
								}}
								className="max-w-xs"
							>
								{(historicalData.periods as HistoricalPeriod[]).map(
									(period) => (
										<SelectItem key={period.periodId}>
											{period.periodCode} - {period.enrollmentCount} materias
										</SelectItem>
									),
								)}
							</Select>
						</div>
					)}

					<Alert color="warning" title="Selecciona un período">
						Por favor selecciona un período académico para ver su horario.
					</Alert>
				</CardHeader>
			</Card>
		);
	}

	const { data: scheduleData, timeSlots } = transformScheduleData(schedules);

	// Si no hay horarios
	if (schedules.length === 0) {
		const message =
			viewMode === 'historical'
				? 'No hay horarios registrados para este período.'
				: 'No tienes materias registradas en este momento.';

		return (
			<Card radius="sm" shadow="sm">
				<CardHeader className="flex flex-col gap-3">
					<div className="flex justify-between items-center w-full">
						<h3 className="text-lg font-semibold">Horario Académico</h3>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => {
									setViewMode('current');
									setSelectedPeriod('');
								}}
								className={`px-4 py-2 text-sm rounded-lg ${
									viewMode === 'current'
										? 'bg-primary text-white'
										: 'bg-default-100 text-default-600 hover:bg-default-200'
								}`}
							>
								Actual
							</button>
							<button
								type="button"
								onClick={() => setViewMode('historical')}
								className={`px-4 py-2 text-sm rounded-lg ${
									viewMode === 'historical'
										? 'bg-primary text-white'
										: 'bg-default-100 text-default-600 hover:bg-default-200'
								}`}
							>
								Histórico
							</button>
						</div>
					</div>
				</CardHeader>
				<CardBody className="flex items-center justify-center min-h-[400px]">
					<p className="text-default-600">{message}</p>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<Card radius="sm" shadow="sm">
				<CardHeader className="flex flex-col gap-3">
					<div className="flex justify-between items-center w-full">
						<h3 className="text-lg font-semibold">Horario Académico</h3>
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => {
									setViewMode('current');
									setSelectedPeriod('');
								}}
								className={`px-4 py-2 text-sm rounded-lg ${
									viewMode === 'current'
										? 'bg-primary text-white'
										: 'bg-default-100 text-default-600 hover:bg-default-200'
								}`}
							>
								Actual
							</button>
							<button
								type="button"
								onClick={() => setViewMode('historical')}
								className={`px-4 py-2 text-sm rounded-lg ${
									viewMode === 'historical'
										? 'bg-primary text-white'
										: 'bg-default-100 text-default-600 hover:bg-default-200'
								}`}
							>
								Histórico
							</button>
						</div>
					</div>

					{viewMode === 'historical' && historicalData?.periods && (
						<div className="w-full">
							<Select
								label="Seleccionar Período"
								placeholder="Escoge un período académico"
								selectedKeys={selectedPeriod ? [selectedPeriod] : []}
								onSelectionChange={(keys) => {
									const value = Array.from(keys)[0] as string;
									setSelectedPeriod(value);
								}}
								className="max-w-xs"
							>
								{(historicalData.periods as HistoricalPeriod[]).map(
									(period) => (
										<SelectItem key={period.periodId}>
											{period.periodCode} - {period.enrollmentCount} materias
										</SelectItem>
									),
								)}
							</Select>
						</div>
					)}

					{viewMode === 'historical' &&
						!selectedPeriod &&
						historicalData?.periods && (
							<Alert color="warning" title="Selecciona un período">
								Por favor selecciona un período académico para ver su horario.
							</Alert>
						)}
				</CardHeader>
				<CardBody>
					<div className="overflow-x-auto">
						<div className="min-w-[800px]">
							{/* Grid Container */}
							<div className="grid grid-cols-7 border border-default-200 rounded-lg overflow-hidden">
								{/* Header Row */}
								<div className="bg-default-100 p-3 border-r border-default-200 flex items-center justify-center">
									<span className="text-sm font-medium text-default-700">
										Horario
									</span>
								</div>
								{DAYS.map((day) => (
									<div
										key={day}
										className="bg-default-100 p-3 border-r border-default-200 last:border-r-0 flex items-center justify-center"
									>
										<span className="text-sm font-medium text-default-700">
											{day}
										</span>
									</div>
								))}

								{/* Time Slots Rows */}
								{timeSlots.map((timeSlot) => (
									<>
										{/* Time Label */}
										<div
											key={`time-${timeSlot}`}
											className="bg-default-50 p-3 border-r border-t border-default-200 flex items-center justify-end pr-4"
										>
											<span className="text-xs font-medium text-default-600">
												{timeSlot}
											</span>
										</div>

										{/* Day Cells */}
										{DAYS.map((day) => {
											const classBlock = scheduleData[day]?.[timeSlot];
											return (
												<div
													key={`${day}-${timeSlot}`}
													className="border-r border-t border-default-200 last:border-r-0 min-h-[80px] p-1"
												>
													{classBlock ? (
														<div className="h-full bg-red-500 text-white rounded-md p-2 shadow-sm flex flex-col justify-center">
															<div className="text-xs font-bold leading-tight mb-1">
																{classBlock.courseName}
															</div>
															<div className="text-xs leading-tight mb-1">
																{classBlock.classroom}
															</div>
															<div className="text-xs leading-tight opacity-90">
																{classBlock.teacher}
															</div>
														</div>
													) : (
														<div className="w-full h-full min-h-[76px] bg-default-50" />
													)}
												</div>
											);
										})}
									</>
								))}
							</div>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
