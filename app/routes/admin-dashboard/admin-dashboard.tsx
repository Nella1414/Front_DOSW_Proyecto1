import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Spacer,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import React from 'react';
import { AcademicSemaphore } from '../../components/academic-semaphore';
import { PeriodsManagement } from '../../components/periods-management';
import { RoleManagement } from '../../components/role-management';
import { type CurrentView, Sidebar, type User } from '../../components/sidebar';
import { StudentRegistration } from '../../components/student-registration';
import { StudentSelector } from '../../components/student-selector';

// Usuario simulado (en producción vendrá de auth/context)
const adminUser: User = {
	id: 'admin-1',
	name: 'Administrador General',
	email: 'admin@sirha.edu',
	role: 'admin',
};

// Pequeño hook para manejar la vista activa
function useAdminViews(initial: CurrentView = 'dashboard') {
	const [view, setView] = React.useState<CurrentView>(initial);
	const navigate = (next: CurrentView) => setView(next);
	return { view, navigate };
}

// Utilidad local (evita dependencia externa)
function clsx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

// Componente de estadísticas rápidas
const StatCard: React.FC<{
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

const DashboardHome: React.FC = () => {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row gap-4">
				<StatCard title="Usuarios" value={428} note="Activos este mes" />
				<StatCard
					title="Solicitudes"
					value={73}
					color="secondary"
					note="Pendientes de revisión"
				/>
				<StatCard
					title="Aprobadas"
					value={58}
					color="success"
					note="Últimos 7 días"
				/>
				<StatCard
					title="Rechazadas"
					value={15}
					color="danger"
					note="Últimos 7 días"
				/>
			</div>
			<Card shadow="sm" radius="sm">
				<CardHeader className="flex flex-col items-start gap-1">
					<h2 className="text-lg font-semibold">Actividad reciente</h2>
					<p className="text-xs text-default-500">
						Resumen de las últimas acciones del sistema
					</p>
				</CardHeader>
				<Divider />
				<CardBody className="overflow-x-auto">
					<Table
						aria-label="Actividad reciente"
						removeWrapper
						className="min-w-[560px]"
					>
						<TableHeader>
							<TableColumn>FECHA</TableColumn>
							<TableColumn>ACCIÓN</TableColumn>
							<TableColumn>USUARIO</TableColumn>
							<TableColumn>ESTADO</TableColumn>
						</TableHeader>
						<TableBody>
							{[
								{
									id: 'a1',
									d: '2025-09-20 09:12',
									act: 'Registro estudiante',
									u: 'mperez',
									s: 'OK',
								},
								{
									id: 'a2',
									d: '2025-09-20 09:30',
									act: 'Cambio rol',
									u: 'admin',
									s: 'OK',
								},
								{
									id: 'a3',
									d: '2025-09-20 10:05',
									act: 'Solicitud sala',
									u: 'lrojas',
									s: 'Pendiente',
								},
								{
									id: 'a4',
									d: '2025-09-20 10:18',
									act: 'Solicitud equipo deportivo',
									u: 'jdiaz',
									s: 'Rechazada',
								},
							].map((r) => (
								<TableRow key={r.id}>
									<TableCell className="text-xs">{r.d}</TableCell>
									<TableCell className="text-sm font-medium">{r.act}</TableCell>
									<TableCell className="text-xs text-default-500">
										{r.u}
									</TableCell>
									<TableCell>
										{r.s === 'OK' && (
											<Chip size="sm" color="success" variant="flat">
												{r.s}
											</Chip>
										)}
										{r.s === 'Pendiente' && (
											<Chip size="sm" color="warning" variant="flat">
												{r.s}
											</Chip>
										)}
										{r.s === 'Rechazada' && (
											<Chip size="sm" color="danger" variant="flat">
												{r.s}
											</Chip>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>
		</div>
	);
};

const ProfileView: React.FC<{ user: User }> = ({ user }) => (
	<Card radius="sm" shadow="sm">
		<CardHeader>
			<div>
				<h2 className="text-lg font-semibold">Perfil</h2>
				<p className="text-xs text-default-500">
					Información básica del administrador
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
				<span className="font-medium">Rol:</span> {user.role}
			</p>
			<Button size="sm" color="primary" variant="flat" className="mt-2 w-fit">
				Editar perfil
			</Button>
		</CardBody>
	</Card>
);

// Vistas placeholder ligeras
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

export default function AdminDashboardRoute() {
	const { view, navigate } = useAdminViews('dashboard');

	let content: React.ReactNode;
	switch (view) {
		case 'dashboard':
			content = <DashboardHome />;
			break;
		case 'role-management':
			content = <RoleManagement />;
			break;
		case 'student-registration':
			content = <StudentRegistration />;
			break;
		case 'profile':
			content = <ProfileView user={adminUser} />;
			break;
		case 'requests':
			content = (
				<SimplePlaceholder
					title="Solicitudes"
					description="Listado y gestión de solicitudes entrantes."
				/>
			);
			break;
		case 'create-request':
			content = (
				<SimplePlaceholder
					title="Nueva Solicitud"
					description="Formulario para creación manual de solicitud."
				/>
			);
			break;
		case 'management':
			content = (
				<SimplePlaceholder
					title="Gestión"
					description="Panel centralizado de operaciones administrativas."
				/>
			);
			break;
		case 'reports':
			content = (
				<SimplePlaceholder
					title="Reportes"
					description="Generación y descarga de reportes analíticos."
				/>
			);
			break;
		case 'academic-progress':
			content = (
				<div className="space-y-6">
					<StudentSelector
						onSelectStudent={(student) => {
							// En una implementación real, esto actualizaría el estado
							console.log('Selected student:', student);
						}}
					/>
					<AcademicSemaphore
						userRole="ADMIN"
						studentId="admin-view"
						targetStudentId="1234567890"
					/>
				</div>
			);
			break;
		case 'academic-plan':
			content = <PeriodsManagement userRole="ADMIN" />;
			break;
		default:
			content = <SimplePlaceholder title="Vista" />;
	}

	return (
		<div className="flex h-dvh w-dvw bg-content2 text-content2-foreground">
			<Sidebar user={adminUser} currentView={view} onNavigate={navigate} />
			<main className="flex-1 h-full overflow-y-auto p-6">
				<div className="max-w-7xl mx-auto">
					<header className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-semibold tracking-tight">
								{view === 'dashboard'
									? 'Panel Administrativo'
									: view.replace('-', ' ')}
							</h1>
							<p className="text-xs text-default-500">
								{view === 'dashboard'
									? 'Resumen general del sistema y métricas principales.'
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
								onPress={() => navigate('reports')}
							>
								Reportes
							</Button>
						</div>
					</header>
					{content}
					<Spacer y={12} />
					<footer className="pt-8 pb-6 text-center text-[11px] text-default-400">
						SIRHA &middot; Dashboard Administrativo &middot;{' '}
						{new Date().getFullYear()}
					</footer>
				</div>
			</main>
		</div>
	);
}
