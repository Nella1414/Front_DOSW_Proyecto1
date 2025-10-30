import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Input,
	Spacer,
	Spinner,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { AcademicGrid } from '../../components/academic-grid';
import { AcademicSchedule } from '../../components/academic-schedule';
import { AcademicSemaphore } from '../../components/academic-semaphore';
import {
	useCurrentPeriod,
	usePeriodForSemester,
	useSelectedSemester,
} from '../../components/informative-message';
import { RequestsWrapper } from '../../components/schedule-change-request/requests-wrapper';
import { type CurrentView, Sidebar, type User } from '../../components/sidebar';
import { authApi, studentApi } from '../../lib/api';

// Hook para manejar la vista activa
function useStudentViews(initial: CurrentView = 'dashboard') {
	const [view, setView] = React.useState<CurrentView>(initial);
	const navigate = (next: CurrentView) => setView(next);
	return { view, navigate };
}

// Hook para manejar el semestre seleccionado
function useStudentSemester() {
	const [selectedSemester, setSelectedSemester] = useSelectedSemester();
	const currentPeriod = useCurrentPeriod();
	const semesterPeriod = usePeriodForSemester(selectedSemester);

	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;
	const currentSemester = currentMonth <= 6 ? 1 : 2;
	const isCurrentSemester =
		selectedSemester.year === currentYear &&
		selectedSemester.semester === currentSemester;

	return {
		selectedSemester,
		setSelectedSemester,
		currentPeriod,
		semesterPeriod,
		isCurrentSemester,
	};
}

// Utilidad local
function clsx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

// Componente de estadísticas del estudiante
const StudentStatCard: React.FC<{
	title: string;
	value: string | number;
	color?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'default';
	note?: string;
}> = ({ title, value, color = 'primary', note }) => {
	const colorClass =
		color === 'primary'
			? 'text-primary'
			: color === 'secondary'
				? 'text-secondary'
				: color === 'success'
					? 'text-success'
					: color === 'warning'
						? 'text-warning'
						: color === 'danger'
							? 'text-danger'
							: 'text-default-700';
	return (
		<Card className="min-w-[160px] flex-1" radius="sm" shadow="sm">
			<CardBody className="gap-1 py-4">
				<p className="text-xs text-default-500 font-medium tracking-wide uppercase">
					{title}
				</p>
				<p className={clsx('text-2xl font-semibold', colorClass)}>{value}</p>
				{note && <p className="text-[11px] text-default-400">{note}</p>}
			</CardBody>
		</Card>
	);
};

interface StudentProfile {
	_id?: string;
	id?: string;
	code: string;
	firstName: string;
	lastName: string;
	currentSemester: number;
	programId: string;
	externalId: string;
}

// Dashboard principal del estudiante
const StudentDashboardHome: React.FC<{ studentProfile: StudentProfile }> = ({
	studentProfile,
}) => {
	return (
		<div className="space-y-6">
			{/* Información del estudiante */}
			<Card shadow="sm" radius="sm">
				<CardHeader>
					<div className="flex flex-col gap-1">
						<h2 className="text-xl font-bold">
							{studentProfile.firstName} {studentProfile.lastName}
						</h2>
						<p className="text-sm text-default-500">
							Código: {studentProfile.code} | Semestre:{' '}
							{studentProfile.currentSemester}
						</p>
					</div>
				</CardHeader>
			</Card>

			{/* Estadísticas rápidas */}
			<div className="flex flex-col sm:flex-row gap-4">
				<StudentStatCard
					title="Semestre Actual"
					value={studentProfile.currentSemester || 'N/A'}
					color="primary"
					note="Semestre en curso"
				/>
				<StudentStatCard
					title="Código"
					value={studentProfile.code}
					color="secondary"
					note="Identificación"
				/>
				<StudentStatCard
					title="Estado"
					value="Activo"
					color="success"
					note="Estado académico"
				/>
			</div>

			{/* Semáforo académico */}
			<AcademicSemaphore userRole="STUDENT" studentId={studentProfile.code} />

			{/* Información adicional */}
			<Card shadow="sm" radius="sm">
				<CardHeader className="flex flex-col items-start gap-1">
					<h2 className="text-lg font-semibold">Información Académica</h2>
					<p className="text-xs text-default-500">
						Detalles de tu programa académico
					</p>
				</CardHeader>
				<Divider />
				<CardBody className="space-y-3">
					<div className="flex justify-between">
						<span className="text-sm font-medium">Programa:</span>
						<span className="text-sm">Ingeniería de Sistemas</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm font-medium">Código:</span>
						<span className="text-sm">{studentProfile.code}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm font-medium">Estado:</span>
						<Chip color="success" variant="flat" size="sm">
							Activo
						</Chip>
					</div>
					<div className="flex justify-between">
						<span className="text-sm font-medium">Semestre actual:</span>
						<span className="text-sm">{studentProfile.currentSemester}</span>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

// Vista de perfil del estudiante
const StudentProfileView: React.FC<{ user: User }> = ({ user }) => {
	// Fetch academic progress to get GPA
	const { data: academicData, isLoading: academicLoading } = useQuery({
		queryKey: ['academic-progress-profile'],
		queryFn: studentApi.getAcademicProgress,
	});

	return (
		<Card radius="sm" shadow="sm">
			<CardHeader>
				<div>
					<h2 className="text-lg font-semibold">Mi Perfil</h2>
					<p className="text-xs text-default-500">
						Información personal y académica
					</p>
				</div>
			</CardHeader>
			<Divider />
			<CardBody className="space-y-2 text-sm">
				<p>
					<span className="font-medium">Nombre:</span> {user.name}
				</p>
				<p>
					<span className="font-medium">Correo:</span> {user.email}
				</p>
				<p>
					<span className="font-medium">Código:</span> {user.studentId}
				</p>
				<p>
					<span className="font-medium">Programa:</span> Ingeniería de Sistemas
				</p>
				<Divider className="my-3" />
				<div className="space-y-2">
					<h3 className="text-sm font-semibold text-primary">
						Rendimiento Académico
					</h3>
					{academicLoading ? (
						<div className="flex items-center gap-2">
							<Spinner size="sm" />
							<span className="text-xs text-default-500">Cargando...</span>
						</div>
					) : academicData?.studentInfo?.gpa !== undefined ? (
						<div className="flex items-center gap-2">
							<span className="font-medium">Promedio Acumulado (GPA):</span>
							<Chip color="primary" variant="flat" size="lg">
								{academicData.studentInfo.gpa.toFixed(2)}
							</Chip>
						</div>
					) : (
						<p className="text-xs text-default-500">
							No hay información de promedio disponible
						</p>
					)}
					{academicData?.studentInfo && (
						<p className="text-xs text-default-500">
							Créditos aprobados: {academicData.studentInfo.passedCredits} /{' '}
							{academicData.studentInfo.totalCredits}
						</p>
					)}
				</div>
				<Button size="sm" color="primary" variant="flat" className="mt-2 w-fit">
					Editar perfil
				</Button>
			</CardBody>
		</Card>
	);
};

// Vistas placeholder
const SimplePlaceholder: React.FC<{ title: string; description?: string }> = ({
	title,
	description,
}) => (
	<Card radius="sm" shadow="sm">
		<CardHeader>
			<h2 className="text-lg font-semibold">{title}</h2>
		</CardHeader>
		<Divider />
		<CardBody>
			<p className="text-sm text-default-600">
				{description ||
					'Sección en construcción. Próximamente funcionalidades completas.'}
			</p>
		</CardBody>
	</Card>
);

export default function StudentDashboardRoute() {
	const { view, navigate } = useStudentViews('dashboard');
	useStudentSemester(); // Initialize semester context

	// Prevent navigation back to login/landing page
	React.useEffect(() => {
		const handlePopState = (e: PopStateEvent) => {
			// Prevent going back
			e.preventDefault();
			window.history.pushState(null, '', window.location.href);
		};

		// Push initial state
		window.history.pushState(null, '', window.location.href);

		// Add listener
		window.addEventListener('popstate', handlePopState);

		return () => {
			window.removeEventListener('popstate', handlePopState);
		};
	}, []);

	// Obtener datos del usuario autenticado
	const { data: currentUser, isLoading: userLoading } = useQuery({
		queryKey: ['current-user'],
		queryFn: authApi.getCurrentUser,
	});

	// Obtener perfil del estudiante
	const {
		data: studentProfile,
		isLoading: profileLoading,
		error: profileError,
	} = useQuery({
		queryKey: ['student-profile'],
		queryFn: studentApi.getProfile,
		enabled: !!currentUser,
	});

	// Mostrar loading mientras se cargan los datos
	if (userLoading || profileLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<Spinner size="lg" color="primary" />
			</div>
		);
	}

	// Mostrar error si no se encuentra el perfil del estudiante
	if (profileError || !studentProfile) {
		console.error('[Dashboard] Profile error:', profileError);
		console.error('[Dashboard] Student profile:', studentProfile);
		console.error('[Dashboard] Current user:', currentUser);

		const errorMessage =
			profileError instanceof Error
				? profileError.message
				: 'Error desconocido al cargar el perfil';

		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				<Card className="max-w-md">
					<CardBody className="text-center space-y-4">
						<h2 className="text-xl font-bold text-danger mb-2">Error</h2>
						<p className="text-default-600">
							No se pudo cargar el perfil del estudiante.
						</p>
						<details className="text-left text-xs bg-danger-50 p-3 rounded">
							<summary className="cursor-pointer font-semibold mb-2">
								Detalles del error (para el administrador)
							</summary>
							<p className="text-danger-800 mb-2">
								<strong>Mensaje:</strong> {errorMessage}
							</p>
							{currentUser && (
								<p className="text-danger-800">
									<strong>Usuario:</strong> {currentUser.user?.email}
									<br />
									<strong>ExternalId:</strong> {currentUser.user?.externalId}
								</p>
							)}
						</details>
						<Button
							color="primary"
							onPress={() => {
								localStorage.removeItem('accessToken');
								window.location.href = '/login';
							}}
						>
							Volver al login
						</Button>
					</CardBody>
				</Card>
			</div>
		);
	}

	// Crear objeto User para el Sidebar
	const studentUser: User = {
		id: studentProfile._id || studentProfile.id,
		name: `${studentProfile.firstName} ${studentProfile.lastName}`,
		email: currentUser?.user?.email || '',
		role: 'student',
		studentId: studentProfile.code,
		academicStatus: 'normal',
	};

	let content: React.ReactNode;
	switch (view) {
		case 'dashboard':
			content = <StudentDashboardHome studentProfile={studentProfile} />;
			break;
		case 'academic-progress':
			content = (
				<AcademicSemaphore userRole="STUDENT" studentId={studentProfile.code} />
			);
			break;
		case 'profile':
			content = <StudentProfileView user={studentUser} />;
			break;
		case 'requests':
			content = (
				<SimplePlaceholder
					title="Mis Solicitudes"
					description="Historial de solicitudes realizadas."
				/>
			);
			break;
		case 'create-request':
			content = <RequestsWrapper />;
			break;
		case 'academic-plan':
			content = <AcademicGrid />;
			break;
		case 'schedule':
			// Schedule view has its own period selector (Actual vs Histórico)
			// No need for global semester selector here
			content = <AcademicSchedule />;
			break;
		default:
			content = <SimplePlaceholder title="Vista" />;
	}

	return (
		<div className="flex h-dvh w-dvw bg-content2 text-content2-foreground">
			<Sidebar user={studentUser} currentView={view} onNavigate={navigate} />
			<main className="flex-1 h-full overflow-y-auto p-6">
				<div className="max-w-7xl mx-auto">
					<header className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-semibold tracking-tight">
								{view === 'dashboard'
									? 'Panel de Inicio'
									: view === 'academic-progress'
										? 'Progreso Académico'
										: view === 'schedule'
											? 'Mi Horario Académico'
											: view === 'create-request'
												? 'Nueva Solicitud'
												: view === 'requests'
													? 'Mis Solicitudes'
													: view === 'profile'
														? 'Mi Perfil'
														: view === 'academic-plan'
															? 'Plan Académico'
															: view.replace('-', ' ')}
							</h1>
							<p className="text-xs text-default-500">
								{view === 'dashboard'
									? 'Resumen de tu información académica.'
									: view === 'schedule'
										? 'Consulta tu horario de clases y materias.'
										: view === 'create-request'
											? 'Gestión de solicitudes de cambio de horario.'
											: 'Gestión de la sección seleccionada.'}
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="flat"
								color="secondary"
								onPress={() => navigate('dashboard')}
								startContent={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-4 h-4"
										aria-label="Home icon"
										role="img"
									>
										<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
										<polyline points="9 22 9 12 15 12 15 22" />
									</svg>
								}
							>
								Inicio
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="primary"
								onPress={() => navigate('academic-progress')}
								startContent={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-4 h-4"
										aria-label="Academic progress icon"
										role="img"
									>
										<path d="M3 3v18h18" />
										<path d="m19 9-5 5-4-4-3 3" />
									</svg>
								}
							>
								Progreso
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="success"
								onPress={() => navigate('schedule')}
								startContent={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="w-4 h-4"
										aria-label="Schedule icon"
										role="img"
									>
										<circle cx="12" cy="12" r="10" />
										<polyline points="12 6 12 12 16 14" />
									</svg>
								}
							>
								Horario
							</Button>
						</div>
					</header>
					{content}
					<Spacer y={12} />
					<footer className="pt-8 pb-6 text-center text-[11px] text-default-400">
						SIRHA &middot; Panel Estudiantil &middot; {new Date().getFullYear()}
					</footer>
				</div>
			</main>
		</div>
	);
}
