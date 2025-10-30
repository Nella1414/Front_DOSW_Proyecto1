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
import { studentApi } from '../lib/api';

interface Subject {
	id: string;
	name: string;
	credits: number;
	status: 'aprobada' | 'pendiente' | 'en_progreso' | 'reprobada';
	grade?: number;
}

interface AcademicProgress {
	percentage: number;
	totalSubjects: number;
	completedSubjects: number;
	totalCredits: number;
	completedCredits: number;
	subjects: Subject[];
	gpa?: number;
	inconsistent?: boolean;
	lastUpdated: string;
}

interface BackendCourse {
	courseCode: string;
	courseName: string;
	credits: number;
	grade?: number;
}

interface BackendData {
	studentInfo?: {
		gpa?: number;
		passedCredits?: number;
		totalCredits?: number;
	};
	courseStatuses?: {
		passedCourses?: BackendCourse[];
		currentCourses?: BackendCourse[];
		failedCourses?: BackendCourse[];
	};
}

// Helper function to transform backend data to frontend format
function transformBackendData(backendData: BackendData): AcademicProgress {
	const subjects: Subject[] = [];

	// Transform passed courses
	if (backendData.courseStatuses?.passedCourses) {
		backendData.courseStatuses.passedCourses.forEach((course) => {
			subjects.push({
				id: course.courseCode,
				name: course.courseName,
				credits: course.credits,
				status: 'aprobada',
				grade: course.grade,
			});
		});
	}

	// Transform current courses (en progreso)
	if (backendData.courseStatuses?.currentCourses) {
		backendData.courseStatuses.currentCourses.forEach((course) => {
			subjects.push({
				id: course.courseCode,
				name: course.courseName,
				credits: course.credits,
				status: 'en_progreso',
				grade: course.grade,
			});
		});
	}

	// Transform failed courses (reprobada - need to retake)
	if (backendData.courseStatuses?.failedCourses) {
		backendData.courseStatuses.failedCourses.forEach((course) => {
			subjects.push({
				id: course.courseCode,
				name: course.courseName,
				credits: course.credits,
				status: 'reprobada',
				grade: course.grade,
			});
		});
	}

	const totalCredits = backendData.studentInfo?.totalCredits || 0;
	const completedCredits = backendData.studentInfo?.passedCredits || 0;
	const percentage =
		totalCredits > 0 ? Math.round((completedCredits / totalCredits) * 100) : 0;

	return {
		percentage,
		totalSubjects: subjects.length,
		completedSubjects: subjects.filter((s) => s.status === 'aprobada').length,
		totalCredits,
		completedCredits,
		subjects,
		gpa: backendData.studentInfo?.gpa || 0,
		inconsistent: false,
		lastUpdated: new Date().toISOString(),
	};
}

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
				<div className={`w-6 h-6 rounded-full bg-${getColor()}`} />
				<span className="font-medium">{percentage}%</span>
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

	const getStatusColor = (
		status: string,
	): 'success' | 'primary' | 'danger' | 'default' => {
		switch (status) {
			case 'aprobada':
				return 'success';
			case 'en_progreso':
				return 'primary'; // Azul para en progreso
			case 'reprobada':
				return 'danger'; // Rojo para reprobada
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
			case 'reprobada':
				return 'Reprobada';
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
						<SelectItem key="reprobada">Reprobadas</SelectItem>
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
		data: backendData,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['academic-progress'],
		queryFn: async () => {
			try {
				console.log(
					'[AcademicSemaphore] Fetching academic progress from backend...',
				);
				const data = await studentApi.getAcademicProgress();
				console.log('[AcademicSemaphore] Backend data received:', data);
				return data;
			} catch (err) {
				console.error('[AcademicSemaphore] Error fetching progress:', err);
				throw err;
			}
		},
		retry: 1,
	});

	// Transform backend data to frontend format
	const progress = backendData ? transformBackendData(backendData) : null;

	const { lastUpdated, manualRefresh } = useAutoRefresh(refetch);

	const refreshMutation = useMutation({
		mutationFn: async () => {
			console.log('[AcademicSemaphore] Manual refresh triggered...');
			const data = await studentApi.getAcademicProgress();
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['academic-progress'] });
			console.log('[AcademicSemaphore] Progress refreshed successfully');
		},
		onError: (err) => {
			console.error('[AcademicSemaphore] Error refreshing progress:', err);
		},
	});

	// Show loading state
	if (isLoading) {
		return (
			<Card>
				<CardBody className="flex items-center justify-center p-8">
					<Spinner size="lg" />
					<p className="mt-4 text-default-500">
						Cargando progreso académico...
					</p>
				</CardBody>
			</Card>
		);
	}

	// Show error state
	if (error) {
		return (
			<Card>
				<CardBody className="p-6">
					<Alert color="danger" title="Error al cargar progreso académico">
						{error instanceof Error
							? error.message
							: 'No se pudo cargar la información académica'}
						<div className="mt-4">
							<Button size="sm" color="primary" onPress={() => refetch()}>
								Reintentar
							</Button>
						</div>
					</Alert>
				</CardBody>
			</Card>
		);
	}

	// Show empty state
	if (!progress || progress.totalSubjects === 0) {
		return (
			<Card>
				<CardBody className="p-6">
					<Alert color="warning" title="Sin registro académico">
						No se encontró información de progreso académico. Esto puede deberse
						a que aún no tienes materias registradas en el sistema.
						<div className="mt-4">
							<Button
								size="sm"
								color="primary"
								variant="bordered"
								onPress={() => refetch()}
							>
								Actualizar
							</Button>
						</div>
					</Alert>
				</CardBody>
			</Card>
		);
	}

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
									onPress={() => {
										manualRefresh();
										refreshMutation.mutate();
									}}
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

						<SemaphoreIndicator
							percentage={progress.percentage}
							isLoading={isLoading}
						/>

						{progress.gpa !== undefined && (
							<div className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-950 rounded-lg">
								<span className="text-sm font-medium">
									Promedio Acumulado (GPA):
								</span>
								<span className="text-lg font-bold text-primary">
									{progress.gpa.toFixed(2)}
								</span>
							</div>
						)}

						<SubjectDetails
							subjects={progress.subjects}
							totalCredits={progress.totalCredits}
							completedCredits={progress.completedCredits}
						/>

						<div className="text-xs text-default-500">
							Última actualización: {lastUpdated.toLocaleString()}
						</div>
					</CardBody>
				</Card>
			</div>
		</AccessGuard>
	);
}
