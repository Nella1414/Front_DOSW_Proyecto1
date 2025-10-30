import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Input,
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
import { Reports } from '../../components/reports';
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

const DashboardHome: React.FC = () => {
	return (
		<div className="space-y-6">
			<div className="flex flex-col sm:flex-row gap-4">
				<StatCard
					title="Usuarios Activos"
					value={428}
					note="Activos este mes"
				/>
				<StatCard
					title="Solicitudes Pendientes"
					value={73}
					color="secondary"
					note="Pendientes de revisión"
				/>
				<StatCard
					title="Solicitudes Aprobadas"
					value={58}
					color="success"
					note="Últimos 7 días"
				/>
				<StatCard
					title="Solicitudes Rechazadas"
					value={15}
					color="danger"
					note="Últimos 7 días"
				/>
			</div>
			<Card shadow="sm" radius="sm">
				<CardHeader className="flex flex-col items-start gap-1">
					<h2 className="text-xl font-bold text-default-900">
						Actividad Reciente
					</h2>
					<p className="text-sm text-default-700">
						Resumen de las últimas acciones del sistema
					</p>
				</CardHeader>
				<Divider />
				<CardBody className="overflow-x-auto">
					<Table
						aria-label="Actividad reciente"
						removeWrapper
						className="min-w-[560px]"
						classNames={{
							th: 'text-sm font-bold',
							td: 'text-base',
						}}
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
									<TableCell className="text-sm font-medium text-default-700">
										{r.d}
									</TableCell>
									<TableCell className="text-base font-semibold text-default-900">
										{r.act}
									</TableCell>
									<TableCell className="text-sm text-default-600">
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

const ProfileView: React.FC<{ user: User }> = ({ user }) => {
	const [isEditing, setIsEditing] = React.useState(false);
	const [profileData, setProfileData] = React.useState({
		name: user.name,
		email: user.email,
		phone: '+57 310 555 0123',
		department: 'Administración General',
		position: 'Administrador del Sistema',
		location: 'Edificio Principal, Oficina 101',
	});

	const handleSave = () => {
		// Aquí iría la lógica para guardar los cambios
		console.log('Guardando cambios:', profileData);
		setIsEditing(false);
		// Simular guardado
		alert('Perfil actualizado exitosamente');
	};

	const handleCancel = () => {
		// Restaurar datos originales
		setProfileData({
			name: user.name,
			email: user.email,
			phone: '+57 310 555 0123',
			department: 'Administración General',
			position: 'Administrador del Sistema',
			location: 'Edificio Principal, Oficina 101',
		});
		setIsEditing(false);
	};

	return (
		<div className="space-y-6">
			{/* Tarjeta principal de perfil */}
			<Card radius="sm" shadow="sm">
				<CardHeader className="flex justify-between items-start">
					<div>
						<h2 className="text-2xl font-bold text-default-900">Mi Perfil</h2>
						<p className="text-sm text-default-600 mt-1">
							Información personal y de contacto
						</p>
					</div>
					<Button
						color={isEditing ? 'success' : 'primary'}
						variant="flat"
						size="md"
						onPress={() => {
							if (isEditing) {
								handleSave();
							} else {
								setIsEditing(true);
							}
						}}
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
							>
								{isEditing ? (
									<>
										<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
										<polyline points="17 21 17 13 7 13 7 21" />
										<polyline points="7 3 7 8 15 8" />
									</>
								) : (
									<>
										<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
									</>
								)}
							</svg>
						}
					>
						{isEditing ? 'Guardar Cambios' : 'Editar Perfil'}
					</Button>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="flex flex-col md:flex-row gap-8">
						{/* Avatar y rol */}
						<div className="flex flex-col items-center gap-4 md:w-1/3">
							<div className="relative">
								<div className="w-32 h-32 rounded-full bg-gradient-to-br from-danger-400 to-danger-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
									{user.name
										.split(' ')
										.map((n) => n[0])
										.join('')
										.toUpperCase()}
								</div>
								<div className="absolute bottom-0 right-0 w-10 h-10 bg-success rounded-full border-4 border-white flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="currentColor"
										className="w-5 h-5 text-white"
									>
										<path
											fillRule="evenodd"
											d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>
							<div className="text-center">
								<Chip color="danger" variant="flat" size="lg" className="mb-2">
									<span className="font-semibold">Administrador</span>
								</Chip>
								<p className="text-sm text-default-600">
									Acceso completo al sistema
								</p>
							</div>
							{isEditing && (
								<Button
									size="sm"
									variant="bordered"
									color="primary"
									className="w-full"
								>
									Cambiar Foto
								</Button>
							)}
						</div>

						{/* Información del perfil */}
						<div className="flex-1 space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-semibold text-default-700 mb-1 block">
										Nombre Completo
									</label>
									{isEditing ? (
										<Input
											value={profileData.name}
											onChange={(e) =>
												setProfileData({ ...profileData, name: e.target.value })
											}
											size="lg"
											variant="bordered"
										/>
									) : (
										<p className="text-base text-default-900 font-medium py-2">
											{profileData.name}
										</p>
									)}
								</div>

								<div>
									<label className="text-sm font-semibold text-default-700 mb-1 block">
										Correo Electrónico
									</label>
									<p className="text-base text-default-900 font-medium py-2 flex items-center gap-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
											className="w-4 h-4 text-default-500"
										>
											<rect width="20" height="16" x="2" y="4" rx="2" />
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
										</svg>
										{profileData.email}
									</p>
									<p className="text-xs text-default-500 mt-1">
										El correo institucional no se puede modificar
									</p>
								</div>

								<div>
									<label className="text-sm font-semibold text-default-700 mb-1 block">
										Teléfono
									</label>
									{isEditing ? (
										<Input
											value={profileData.phone}
											onChange={(e) =>
												setProfileData({
													...profileData,
													phone: e.target.value,
												})
											}
											size="lg"
											variant="bordered"
											startContent={
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
													className="w-4 h-4 text-default-400"
												>
													<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
												</svg>
											}
										/>
									) : (
										<p className="text-base text-default-900 font-medium py-2 flex items-center gap-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
												className="w-4 h-4 text-default-500"
											>
												<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
											</svg>
											{profileData.phone}
										</p>
									)}
								</div>

								<div>
									<label className="text-sm font-semibold text-default-700 mb-1 block">
										Departamento
									</label>
									{isEditing ? (
										<Input
											value={profileData.department}
											onChange={(e) =>
												setProfileData({
													...profileData,
													department: e.target.value,
												})
											}
											size="lg"
											variant="bordered"
										/>
									) : (
										<p className="text-base text-default-900 font-medium py-2">
											{profileData.department}
										</p>
									)}
								</div>

								<div>
									<label className="text-sm font-semibold text-default-700 mb-1 block">
										Cargo
									</label>
									{isEditing ? (
										<Input
											value={profileData.position}
											onChange={(e) =>
												setProfileData({
													...profileData,
													position: e.target.value,
												})
											}
											size="lg"
											variant="bordered"
										/>
									) : (
										<p className="text-base text-default-900 font-medium py-2">
											{profileData.position}
										</p>
									)}
								</div>

								<div>
									<label className="text-sm font-semibold text-default-700 mb-1 block">
										Ubicación
									</label>
									{isEditing ? (
										<Input
											value={profileData.location}
											onChange={(e) =>
												setProfileData({
													...profileData,
													location: e.target.value,
												})
											}
											size="lg"
											variant="bordered"
											startContent={
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
													className="w-4 h-4 text-default-400"
												>
													<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
													<circle cx="12" cy="10" r="3" />
												</svg>
											}
										/>
									) : (
										<p className="text-base text-default-900 font-medium py-2 flex items-center gap-2">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
												className="w-4 h-4 text-default-500"
											>
												<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
												<circle cx="12" cy="10" r="3" />
											</svg>
											{profileData.location}
										</p>
									)}
								</div>
							</div>

							{isEditing && (
								<div className="flex gap-2 pt-4">
									<Button
										color="default"
										variant="flat"
										size="md"
										onPress={handleCancel}
									>
										Cancelar
									</Button>
									<Button
										color="success"
										variant="shadow"
										size="md"
										onPress={handleSave}
									>
										Guardar Cambios
									</Button>
								</div>
							)}
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Tarjeta de estadísticas de actividad */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
					<CardBody className="flex flex-row items-center gap-4 p-5">
						<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6 text-white"
							>
								<path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-default-600">
								Usuarios Gestionados
							</p>
							<p className="text-2xl font-bold text-primary">428</p>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-success-50 to-success-100 border border-success-200">
					<CardBody className="flex flex-row items-center gap-4 p-5">
						<div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6 text-white"
							>
								<path
									fillRule="evenodd"
									d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
									clipRule="evenodd"
								/>
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-default-600">
								Solicitudes Aprobadas
							</p>
							<p className="text-2xl font-bold text-success">156</p>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-warning-50 to-warning-100 border border-warning-200">
					<CardBody className="flex flex-row items-center gap-4 p-5">
						<div className="w-12 h-12 rounded-full bg-warning flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6 text-white"
							>
								<path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-default-600">
								Reportes Generados
							</p>
							<p className="text-2xl font-bold text-warning">47</p>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Tarjeta de seguridad */}
			<Card className="border-2 border-danger-200 bg-danger-50/50">
				<CardHeader>
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-5 h-5 text-danger"
						>
							<path
								fillRule="evenodd"
								d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
								clipRule="evenodd"
							/>
						</svg>
						<h3 className="text-lg font-bold text-danger">
							Configuración de Seguridad
						</h3>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="space-y-4">
						<div className="flex justify-between items-center">
							<div>
								<p className="font-semibold text-default-900">
									Cambiar Contraseña
								</p>
								<p className="text-sm text-default-600">
									Última actualización: Hace 3 meses
								</p>
							</div>
							<Button color="danger" variant="flat" size="md">
								Cambiar
							</Button>
						</div>
						<Divider />
						<div className="flex justify-between items-center">
							<div>
								<p className="font-semibold text-default-900">
									Autenticación de Dos Factores
								</p>
								<p className="text-sm text-default-600">
									Añade una capa extra de seguridad
								</p>
							</div>
							<Chip color="warning" variant="flat">
								Desactivada
							</Chip>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

// Vistas placeholder ligeras
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
			content = <Reports />;
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
							<h1 className="text-3xl font-bold tracking-tight text-default-900">
								{view === 'dashboard'
									? 'Panel de Inicio'
									: view === 'role-management'
										? 'Gestión de Roles'
										: view === 'student-registration'
											? 'Registro de Estudiantes'
											: view === 'profile'
												? 'Mi Perfil'
												: view === 'requests'
													? 'Solicitudes'
													: view === 'create-request'
														? 'Nueva Solicitud'
														: view === 'management'
															? 'Gestión General'
															: view === 'reports'
																? 'Reportes'
																: view === 'academic-progress'
																	? 'Progreso Académico'
																	: view === 'academic-plan'
																		? 'Períodos Académicos'
																		: view.replace('-', ' ')}
							</h1>
							<p className="text-base text-default-700 mt-1">
								{view === 'dashboard'
									? 'Resumen general del sistema y métricas principales.'
									: 'Gestión de la sección seleccionada.'}
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								size="md"
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
										role="img"
										aria-label="Home icon"
									>
										<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
										<polyline points="9 22 9 12 15 12 15 22" />
									</svg>
								}
							>
								Inicio
							</Button>
							<Button
								size="md"
								variant="flat"
								color="primary"
								onPress={() => navigate('reports')}
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
										role="img"
										aria-label="Reports icon"
									>
										<path d="M3 3v18h18" />
										<path d="m19 9-5 5-4-4-3 3" />
									</svg>
								}
							>
								Reportes
							</Button>
						</div>
					</header>
					{content}
					<Spacer y={12} />
					<footer className="pt-8 pb-6 text-center text-[11px] text-default-400">
						SIRHA &middot; Panel Administrativo &middot;{' '}
						{new Date().getFullYear()}
					</footer>
				</div>
			</main>
		</div>
	);
}
