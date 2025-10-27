import {
	Accordion,
	AccordionItem,
	Alert,
	Button,
	Card,
	CardBody,
	Chip,
	Progress,
	Select,
	SelectItem,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
} from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

interface Subject {
	id: string;
	name: string;
	credits: number;
	status: 'aprobada' | 'pendiente' | 'en_progreso';
	grade?: number;
}

interface AcademicProgress {
	percentage: number;
	totalSubjects: number;
	completedSubjects: number;
	totalCredits: number;
	completedCredits: number;
	subjects: Subject[];
	inconsistent?: boolean;
	lastUpdated: string;
}

// Materias de Ingeniería de Sistemas
const systemsEngineeringSubjects: Subject[] = [
	// Matemáticas
	{
		id: '1',
		name: 'Matemáticas Básicas',
		credits: 4,
		status: 'aprobada',
		grade: 4.1,
	},
	{
		id: '2',
		name: 'Cálculo Diferencial',
		credits: 4,
		status: 'aprobada',
		grade: 3.8,
	},
	{
		id: '3',
		name: 'Cálculo Integral',
		credits: 4,
		status: 'aprobada',
		grade: 4.0,
	},
	{
		id: '4',
		name: 'Cálculo Vectorial',
		credits: 4,
		status: 'aprobada',
		grade: 3.9,
	},
	{
		id: '5',
		name: 'Ecuaciones Diferenciales',
		credits: 3,
		status: 'aprobada',
		grade: 3.7,
	},
	{
		id: '6',
		name: 'Álgebra Lineal',
		credits: 3,
		status: 'aprobada',
		grade: 4.2,
	},
	{
		id: '7',
		name: 'Matemáticas para Informática',
		credits: 3,
		status: 'aprobada',
		grade: 4.3,
	},
	{
		id: '8',
		name: 'Lógica y Matemáticas Discretas',
		credits: 3,
		status: 'aprobada',
		grade: 4.0,
	},
	{
		id: '9',
		name: 'Probabilidad y Estadística',
		credits: 3,
		status: 'en_progreso',
	},

	// Física
	{
		id: '10',
		name: 'Física Básica',
		credits: 4,
		status: 'aprobada',
		grade: 3.6,
	},
	{ id: '11', name: 'Física 1', credits: 4, status: 'aprobada', grade: 3.8 },
	{ id: '12', name: 'Física 2', credits: 4, status: 'aprobada', grade: 3.5 },

	// Programación y Sistemas
	{
		id: '13',
		name: 'Introducción a la Programación',
		credits: 4,
		status: 'aprobada',
		grade: 4.5,
	},
	{
		id: '14',
		name: 'Desarrollo Orientado por Objetos',
		credits: 4,
		status: 'aprobada',
		grade: 4.2,
	},
	{
		id: '15',
		name: 'Diseño de Datos y Algoritmos',
		credits: 4,
		status: 'aprobada',
		grade: 4.0,
	},
	{
		id: '16',
		name: 'Teoría de la Programación y la Computación',
		credits: 3,
		status: 'aprobada',
		grade: 3.9,
	},
	{
		id: '17',
		name: 'Organización de los Sistemas de Cómputo',
		credits: 3,
		status: 'aprobada',
		grade: 3.7,
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

	// Ingeniería de Software
	{
		id: '20',
		name: 'Modelos y Servicios de Datos',
		credits: 4,
		status: 'aprobada',
		grade: 4.1,
	},
	{
		id: '21',
		name: 'Desarrollo y Operaciones Software',
		credits: 4,
		status: 'en_progreso',
	},
	{
		id: '22',
		name: 'Arquitecturas de Software',
		credits: 4,
		status: 'pendiente',
	},
	{
		id: '23',
		name: 'Transformación Digital y Soluciones Empresariales',
		credits: 3,
		status: 'pendiente',
	},

	// Proyectos Integradores
	{
		id: '24',
		name: 'Proyecto Integrador 1 – Introducción a la Ingeniería de Sistemas',
		credits: 2,
		status: 'aprobada',
		grade: 4.3,
	},
	{
		id: '25',
		name: 'Proyecto Integrador 2 – Estrategia de Organizaciones y Procesos',
		credits: 3,
		status: 'pendiente',
	},
	{
		id: '26',
		name: 'Proyecto Integrador 3 – Innovación Software Apoyada en Nuevas Tecnologías',
		credits: 3,
		status: 'pendiente',
	},

	// Humanidades y Sociales
	{
		id: '27',
		name: 'Fundamentos de la Comunicación 1',
		credits: 2,
		status: 'aprobada',
		grade: 4.0,
	},
	{
		id: '28',
		name: 'Colombia: Realidad, Instituciones Políticas y Paz',
		credits: 2,
		status: 'aprobada',
		grade: 3.8,
	},
	{
		id: '29',
		name: 'Historia y Geografía de Colombia',
		credits: 2,
		status: 'aprobada',
		grade: 3.9,
	},
	{
		id: '30',
		name: 'Fundamentos Económicos',
		credits: 3,
		status: 'aprobada',
		grade: 3.6,
	},
	{
		id: '31',
		name: 'Fundamentos de Proyectos',
		credits: 3,
		status: 'aprobada',
		grade: 4.1,
	},

	// Inteligencia Artificial
	{
		id: '32',
		name: 'Principios y Tecnologías de Inteligencia Artificial',
		credits: 4,
		status: 'pendiente',
	},

	// Opción de Grado
	{
		id: '33',
		name: 'Seminario de Opción de Grado',
		credits: 2,
		status: 'pendiente',
	},
	{ id: '34', name: 'Opción de Grado 1', credits: 3, status: 'pendiente' },
	{ id: '35', name: 'Opción de Grado 2', credits: 3, status: 'pendiente' },
	{ id: '36', name: 'Opción de Grado 3', credits: 3, status: 'pendiente' },
	{ id: '37', name: 'Opción de Grado 4', credits: 3, status: 'pendiente' },

	// Electivas
	{ id: '38', name: 'Electiva Técnica 1', credits: 3, status: 'pendiente' },
	{ id: '39', name: 'Electiva Técnica 2', credits: 3, status: 'pendiente' },
	{ id: '40', name: 'Electiva Técnica 3', credits: 3, status: 'pendiente' },

	// Cursos de Libre Elección (solo algunos como ejemplo)
	{ id: '41', name: 'CLE 1', credits: 2, status: 'aprobada', grade: 4.0 },
	{ id: '42', name: 'CLE 2', credits: 2, status: 'aprobada', grade: 3.8 },
	{ id: '43', name: 'CLE 3', credits: 2, status: 'pendiente' },
];

// Mock data actualizado
const mockProgress: AcademicProgress = {
	percentage: 68,
	totalSubjects: systemsEngineeringSubjects.length,
	completedSubjects: systemsEngineeringSubjects.filter(
		(s) => s.status === 'aprobada',
	).length,
	totalCredits: systemsEngineeringSubjects.reduce(
		(sum, s) => sum + s.credits,
		0,
	),
	completedCredits: systemsEngineeringSubjects
		.filter((s) => s.status === 'aprobada')
		.reduce((sum, s) => sum + s.credits, 0),
	inconsistent: Math.random() > 0.7, // 30% probabilidad de inconsistencia para testing
	lastUpdated: new Date().toISOString(),
	subjects: systemsEngineeringSubjects,
};

// FEAT-004 US-0016 – Vista Semáforo
function SemaphoreIndicator({
	percentage,
	isLoading,
}: {
	percentage: number;
	isLoading: boolean;
}) {
	const getColor = () => {
		if (percentage >= 80) return 'success';
		if (percentage >= 60) return 'warning';
		if (percentage >= 40) return 'danger';
		return 'default';
	};

	const getDescription = () => {
		if (percentage >= 80) return 'Excelente progreso académico';
		if (percentage >= 60) return 'Buen progreso, mantén el ritmo';
		if (percentage >= 40) return 'Progreso moderado, puedes mejorar';
		return 'Necesitas acelerar tu progreso';
	};

	if (isLoading) {
		return (
			<div className="flex items-center gap-2">
				<Spinner size="sm" />
				<span className="text-sm text-default-500">Calculando...</span>
			</div>
		);
	}
	return (
		<Tooltip content={`${percentage}% completado. ${getDescription()}`}>
			<div className="flex items-center gap-3">
				<Chip
					color={getColor()}
					variant="dot"
					size="lg"
					classNames={{
						base: 'gap-3',
						content: 'font-medium text-base',
					}}
				>
					{percentage}%
				</Chip>
			</div>
		</Tooltip>
	);
}

// FEAT-004 US-0017 – Detalle Componentes
function SubjectDetails({
	subjects,
	totalCredits,
	completedCredits,
}: {
	subjects: Subject[];
	totalCredits: number;
	completedCredits: number;
}) {
	const [filter, setFilter] = useState<string>('todas');

	const filteredSubjects = subjects.filter((subject) => {
		if (filter === 'todas') return true;
		return subject.status === filter;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'aprobada':
				return 'success';
			case 'en_progreso':
				return 'primary'; // Primary (azul) es semánticamente correcto para "en progreso"
			case 'pendiente':
				return 'default';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'aprobada':
				return 'Aprobada';
			case 'en_progreso':
				return 'En Progreso';
			case 'pendiente':
				return 'Pendiente';
			default:
				return status;
		}
	};

	return (
		<Accordion>
			<AccordionItem key="details" title="Ver detalles de materias">
				<div className="space-y-4">
					{/* Progress Bar y Contadores */}
					<div className="space-y-2">
						<Progress
							value={(completedCredits / totalCredits) * 100}
							color="primary"
							label="Progreso de créditos"
							showValueLabel
						/>
						<div className="flex justify-between text-sm text-default-600">
							<span>
								{subjects.filter((s) => s.status === 'aprobada').length}/
								{subjects.length} materias
							</span>
							<span>
								{completedCredits}/{totalCredits} créditos
							</span>
						</div>
					</div>

					{/* Filtros */}
					<Select
						label="Filtrar por estado"
						selectedKeys={[filter]}
						onSelectionChange={(keys) =>
							setFilter(Array.from(keys)[0] as string)
						}
						className="max-w-xs"
					>
						<SelectItem key="todas">Todas</SelectItem>
						<SelectItem key="aprobada">Aprobadas</SelectItem>
						<SelectItem key="en_progreso">En Progreso</SelectItem>
						<SelectItem key="pendiente">Pendientes</SelectItem>
					</Select>

					{/* Tabla de Materias */}
					<Table aria-label="Tabla de materias">
						<TableHeader>
							<TableColumn>MATERIA</TableColumn>
							<TableColumn>CRÉDITOS</TableColumn>
							<TableColumn>ESTADO</TableColumn>
							<TableColumn>NOTA</TableColumn>
						</TableHeader>
						<TableBody>
							{filteredSubjects.map((subject) => (
								<TableRow key={subject.id}>
									<TableCell>{subject.name}</TableCell>
									<TableCell>{subject.credits}</TableCell>
									<TableCell>
										<Chip color={getStatusColor(subject.status)} variant="flat">
											{getStatusLabel(subject.status)}
										</Chip>
									</TableCell>
									<TableCell>
										{subject.grade ? subject.grade.toFixed(1) : '-'}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</AccordionItem>
		</Accordion>
	);
}

// FEAT-004 US-0018 – AutoRefresh Semáforo
function useAutoRefresh(refetch: () => void, intervalMinutes = 5) {
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				// Reanudar auto-refresh cuando la página vuelve a estar activa
				startInterval();
			} else {
				// Pausar auto-refresh cuando la página está en background
				stopInterval();
			}
		};

		const startInterval = () => {
			stopInterval(); // Limpiar intervalo anterior
			intervalRef.current = setInterval(
				() => {
					refetch();
					setLastUpdated(new Date());
				},
				intervalMinutes * 60 * 1000,
			);
		};

		const stopInterval = () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};

		// Iniciar auto-refresh
		startInterval();
		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Cleanup
		return () => {
			stopInterval();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [refetch, intervalMinutes]);

	const manualRefresh = () => {
		refetch();
		setLastUpdated(new Date());
	};

	return { lastUpdated, manualRefresh };
}

// FEAT-004 US-0019 – Guard Semáforo (Mejorado)
function AccessGuard({
	userRole,
	studentId,
	targetStudentId,
	children,
}: {
	userRole: string;
	studentId?: string;
	targetStudentId?: string;
	children: React.ReactNode;
}) {
	const hasAccess = ['STUDENT', 'ADMIN', 'DEAN'].includes(userRole);

	if (!hasAccess) {
		return (
			<Alert color="danger" title="Acceso Denegado">
				No tienes permisos para ver esta información académica.
				<div className="mt-2">
					<Button
						size="sm"
						color="primary"
						variant="bordered"
						onPress={() => {
							window.location.href = '/login';
						}}
					>
						Iniciar Sesión
					</Button>
				</div>
			</Alert>
		);
	}

	// Estudiante solo puede ver su propio semáforo
	if (
		userRole === 'STUDENT' &&
		targetStudentId &&
		studentId !== targetStudentId
	) {
		return (
			<Alert color="warning" title="Acceso Restringido">
				Solo puedes ver tu propio progreso académico.
				<div className="mt-2">
					<Button
						size="sm"
						color="primary"
						variant="bordered"
						onPress={() => {
							window.location.href = '/student-dashboard';
						}}
					>
						Ver Mi Progreso
					</Button>
				</div>
			</Alert>
		);
	}

	return <>{children}</>;
}

// FEAT-004 US-0020 – Banner Inconsistencias (Mejorado)
function InconsistencyBanner({ show }: { show: boolean }) {
	if (!show) return null;

	return (
		<Alert
			color="warning"
			title="Detectamos inconsistencias en tu información académica"
			className="mb-4"
		>
			<div className="space-y-3">
				<p className="text-sm">
					Algunos datos de tu historial académico no coinciden entre nuestros
					sistemas. Esto puede deberse a actualizaciones recientes o
					transferencias de créditos.
				</p>
				<div className="flex flex-col sm:flex-row gap-2">
					<Button
						size="sm"
						color="warning"
						variant="solid"
						onPress={() =>
							window.open(
								'mailto:registro@escuelaing.edu.co?subject=Inconsistencia en Información Académica&body=Hola, he detectado inconsistencias en mi información académica en el sistema SIRHA. Mi código de estudiante es: [TU_CODIGO]. Por favor, ayuda a revisar y corregir esta información.',
								'_blank',
							)
						}
					>
						Contactar Registro Académico
					</Button>
					<Button
						size="sm"
						color="warning"
						variant="bordered"
						onPress={() =>
							window.open(
								'https://wa.me/573001234567?text=Hola, necesito ayuda con inconsistencias en mi información académica en SIRHA',
								'_blank',
							)
						}
					>
						Soporte WhatsApp
					</Button>
				</div>
				<p className="text-xs text-default-600">
					<strong>Qué hacer:</strong> Contacta al registro académico con tu
					código de estudiante. Ellos verificarán y corregirán cualquier
					inconsistencia en 1-2 días hábiles.
				</p>
			</div>
		</Alert>
	);
}

// Componente Principal
export function AcademicSemaphore({
	userRole = 'STUDENT',
	studentId,
	targetStudentId,
}: {
	userRole?: string;
	studentId?: string;
	targetStudentId?: string;
}) {
	const queryClient = useQueryClient();

	const {
		data: progress,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['academic-progress'],
		queryFn: async (): Promise<AcademicProgress> => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return mockProgress;
		},
	});

	const { lastUpdated, manualRefresh } = useAutoRefresh(refetch);

	const refreshMutation = useMutation({
		mutationFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return mockProgress;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['academic-progress'] });
		},
	});

	return (
		<AccessGuard
			userRole={userRole}
			studentId={studentId}
			targetStudentId={targetStudentId}
		>
			<div className="space-y-4">
				{progress?.inconsistent && <InconsistencyBanner show={true} />}

				<Card>
					<CardBody className="space-y-4">
						<div className="flex justify-between items-center">
							<h3 className="text-lg font-semibold">Progreso Académico</h3>
							<div className="flex items-center gap-2">
								<Button
									size="sm"
									variant="light"
									onPress={manualRefresh}
									isLoading={refreshMutation.isPending}
									startContent={
										!refreshMutation.isPending && (
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-label="Refresh icon"
											>
												<title>Refresh icon</title>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
												/>
											</svg>
										)
									}
								>
									Actualizar
								</Button>
							</div>
						</div>

						{progress && (
							<>
								<SemaphoreIndicator
									percentage={progress.percentage}
									isLoading={isLoading}
								/>

								<SubjectDetails
									subjects={progress.subjects}
									totalCredits={progress.totalCredits}
									completedCredits={progress.completedCredits}
								/>
							</>
						)}

						<div className="text-xs text-default-500">
							Última actualización: {lastUpdated.toLocaleString()}
						</div>
					</CardBody>
				</Card>
			</div>
		</AccessGuard>
	);
}
