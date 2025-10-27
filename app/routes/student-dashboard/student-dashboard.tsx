import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Spacer,
} from '@heroui/react';
import React from 'react';
import { AcademicGrid } from '../../components/academic-grid';
import { AcademicSchedule } from '../../components/academic-schedule';
import { AcademicSemaphore } from '../../components/academic-semaphore';
import {
	InformativeMessage,
	SemesterInfo,
	SemesterSelector,
	useCurrentPeriod,
	usePeriodForSemester,
	useSelectedSemester,
} from '../../components/informative-message';
import { type CurrentView, Sidebar, type User } from '../../components/sidebar';

// Usuario estudiante simulado
const studentUser: User = {
	id: 'student-1',
	name: 'Juan Pérez García',
	email: 'juan.perez@escuelaing.edu.co',
	role: 'student',
	studentId: '1234567890',
	academicStatus: 'normal',
};

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
							: 'text-default-900';
	return (
		<Card className="min-w-[160px] flex-1" radius="sm" shadow="sm">
			<CardBody className="gap-1 py-4">
				<p className="text-sm text-default-700 font-bold tracking-wide uppercase">
					{title}
				</p>
				<p className={clsx('text-3xl font-bold', colorClass)}>{value}</p>
				{note && <p className="text-sm text-default-600 font-medium">{note}</p>}
			</CardBody>
		</Card>
	);
};

// Dashboard principal del estudiante
const StudentDashboardHome: React.FC = () => {
	return (
		<div className="space-y-6">
			{/* Estadísticas rápidas */}
			<div className="flex flex-col sm:flex-row gap-4">
				<StudentStatCard
					title="Progreso"
					value="68%"
					color="success"
					note="Avance académico"
				/>
				<StudentStatCard
					title="Materias"
					value="24/43"
					color="primary"
					note="Completadas"
				/>
				<StudentStatCard
					title="Créditos"
					value="95/139"
					color="secondary"
					note="Obtenidos"
				/>
				<StudentStatCard
					title="Promedio"
					value="3.9"
					color="warning"
					note="Acumulado"
				/>
			</div>

			{/* Semáforo académico */}
			<AcademicSemaphore userRole="STUDENT" studentId={studentUser.studentId} />

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
						<span className="text-sm">{studentUser.studentId}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-sm font-medium">Estado:</span>
						<Chip color="success" variant="flat" size="sm">
							Activo
						</Chip>
					</div>
					<div className="flex justify-between">
						<span className="text-sm font-medium">Semestre actual:</span>
						<span className="text-sm">2024-2</span>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

// Vista de perfil del estudiante
const ProfileView: React.FC<{ user: User }> = ({ user }) => (
	<Card radius="sm" shadow="sm">
		<CardHeader>
			<div>
				<h2 className="text-xl font-bold text-default-900">Perfil</h2>
				<p className="text-sm text-default-700">
					Información básica del estudiante
				</p>
			</div>
		</CardHeader>
		<Divider />
		<CardBody className="space-y-2 text-base">
			<p>
				<span className="font-bold text-default-900">Nombre:</span>{' '}
				<span className="text-default-700">{user.name}</span>
			</p>
			<p>
				<span className="font-bold text-default-900">Correo:</span>{' '}
				<span className="text-default-700">{user.email}</span>
			</p>
			<p>
				<span className="font-bold text-default-900">ID Estudiante:</span>{' '}
				<span className="text-default-700">{user.studentId}</span>
			</p>
			<p>
				<span className="font-bold text-default-900">Estado:</span>{' '}
				<Chip color="success" variant="flat" size="md">
					Activo
				</Chip>
			</p>
			<Button size="md" color="primary" variant="flat" className="mt-2 w-fit">
				Editar perfil
			</Button>
		</CardBody>
	</Card>
); // Vistas placeholder
const SimplePlaceholder: React.FC<{ title: string; description?: string }> = ({
	title,
	description,
}) => (
	<Card radius="sm" shadow="sm">
		<CardHeader>
			<h2 className="text-xl font-bold text-default-900">{title}</h2>
		</CardHeader>
		<Divider />
		<CardBody>
			<p className="text-base text-default-700">
				{description ||
					'Sección en construcción. Próximamente funcionalidades completas.'}
			</p>
		</CardBody>
	</Card>
);

export default function StudentDashboardRoute() {
	const { view, navigate } = useStudentViews('dashboard');
	const {
		selectedSemester,
		setSelectedSemester,
		semesterPeriod,
		isCurrentSemester,
	} = useStudentSemester();

	let content: React.ReactNode;
	switch (view) {
		case 'dashboard':
			content = <StudentDashboardHome />;
			break;
		case 'academic-progress':
			content = (
				<AcademicSemaphore
					userRole="STUDENT"
					studentId={studentUser.studentId}
				/>
			);
			break;
		case 'profile':
			content = <ProfileView user={studentUser} />;
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
			content = (
				<SimplePlaceholder
					title="Nueva Solicitud"
					description="Formulario para crear una nueva solicitud."
				/>
			);
			break;
		case 'academic-plan':
			content = <AcademicGrid />;
			break;
		case 'schedule':
			content = (
				<div className="space-y-6">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						{isCurrentSemester && (
							<InformativeMessage
								period={semesterPeriod}
								onCtaClick={() => {
									console.log('CTA clicked for period:', semesterPeriod);
								}}
							/>
						)}
						<div className="sm:ml-4 min-w-[200px]">
							<SemesterSelector
								selectedSemester={selectedSemester}
								onSemesterChange={setSelectedSemester}
							/>
						</div>
					</div>

					<SemesterInfo semester={selectedSemester} />

					<AcademicSchedule />
				</div>
			);
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
									? 'Mi Dashboard'
									: view === 'academic-progress'
										? 'Progreso Académico'
										: view === 'schedule'
											? 'Mi Horario Académico'
											: view.replace('-', ' ')}
							</h1>
							<p className="text-xs text-default-500">
								{view === 'dashboard'
									? 'Resumen de tu información académica.'
									: view === 'schedule'
										? 'Consulta tu horario de clases y materias.'
										: 'Gestión de la sección seleccionada.'}
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="flat"
								color="secondary"
								onPress={() => navigate('dashboard')}
							>
								Inicio
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="primary"
								onPress={() => navigate('academic-progress')}
							>
								Mi Progreso
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="success"
								onPress={() => navigate('schedule')}
							>
								Mi Horario
							</Button>
						</div>
					</header>
					{content}
					<Spacer y={12} />
					<footer className="pt-8 pb-6 text-center text-[11px] text-default-400">
						SIRHA &middot; Dashboard Estudiantil &middot;{' '}
						{new Date().getFullYear()}
					</footer>
				</div>
			</main>
		</div>
	);
}
