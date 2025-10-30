import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Input,
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
import { CreateRequestView } from '../../components/schedule-change-request/create-request-view';
import { type CurrentView, Sidebar, type User } from '../../components/sidebar';
import { StudentRequests } from '../../components/student-requests';

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
					title="Progreso Académico"
					value="68%"
					color="success"
					note="Avance académico"
				/>
				<StudentStatCard
					title="Materias Completadas"
					value="24/43"
					color="primary"
					note="Completadas"
				/>
				<StudentStatCard
					title="Créditos Obtenidos"
					value="95/139"
					color="secondary"
					note="Obtenidos"
				/>
				<StudentStatCard
					title="Promedio Acumulado"
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
const ProfileView: React.FC<{ user: User }> = ({ user }) => {
	const [isEditing, setIsEditing] = React.useState(false);
	const [profileData, setProfileData] = React.useState({
		name: user.name,
		email: user.email,
		phone: '+57 310 555 4567',
		studentId: user.studentId || '1234567890',
		program: 'Ingeniería de Sistemas',
		semester: '8',
		address: 'Calle 72 # 45-23, Bogotá',
		emergencyContact: 'María García - +57 310 555 7890',
	});

	const handleSave = () => {
		console.log('Guardando cambios:', profileData);
		setIsEditing(false);
		alert('Perfil actualizado exitosamente');
	};

	const handleCancel = () => {
		setProfileData({
			name: user.name,
			email: user.email,
			phone: '+57 310 555 4567',
			studentId: user.studentId || '1234567890',
			program: 'Ingeniería de Sistemas',
			semester: '8',
			address: 'Calle 72 # 45-23, Bogotá',
			emergencyContact: 'María García - +57 310 555 7890',
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
							Información personal y académica
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
								aria-label="Icono decorativo"
								role="img"
							>
								{isEditing ? (
									<>
										<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
										<polyline points="17 21 17 13 7 13 7 21" />
										<polyline points="7 3 7 8 15 8" />
									</>
								) : (
									<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
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
						{/* Avatar y estado */}
						<div className="flex flex-col items-center gap-4 md:w-1/3">
							<div className="relative">
								<div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
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
										aria-label="Icono decorativo"
										role="img"
									>
										<path
											fillRule="evenodd"
											d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
							</div>
							<div className="text-center space-y-2">
								<Chip color="success" variant="flat" size="lg" className="mb-2">
									<span className="font-semibold">Estudiante Activo</span>
								</Chip>
								<div className="flex flex-col gap-1">
									<p className="text-sm font-semibold text-default-700">
										ID: {profileData.studentId}
									</p>
									<p className="text-sm text-default-600">
										{profileData.program}
									</p>
									<Chip color="primary" variant="bordered" size="sm">
										Semestre {profileData.semester}
									</Chip>
								</div>
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
									<div className="text-sm font-semibold text-default-700 mb-1 block">
										Nombre Completo
									</div>
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
									<span className="text-sm font-semibold text-default-700 mb-1 block">
										Correo Electrónico
									</span>
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
											aria-label="Icono decorativo"
											role="img"
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
									<div className="text-sm font-semibold text-default-700 mb-1 block">
										Teléfono
									</div>
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
													aria-label="Icono decorativo"
													role="img"
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
												aria-label="Icono decorativo"
												role="img"
											>
												<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
											</svg>
											{profileData.phone}
										</p>
									)}
								</div>

								<div>
									<span className="text-sm font-semibold text-default-700 mb-1 block">
										Programa Académico
									</span>
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
											aria-label="Icono decorativo"
											role="img"
										>
											<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
											<path d="M6 12v5c3 3 9 3 12 0v-5" />
										</svg>
										{profileData.program}
									</p>
								</div>

								<div className="md:col-span-2">
									<div className="text-sm font-semibold text-default-700 mb-1 block">
										Dirección
									</div>
									{isEditing ? (
										<Input
											value={profileData.address}
											onChange={(e) =>
												setProfileData({
													...profileData,
													address: e.target.value,
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
													aria-label="Icono decorativo"
													role="img"
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
												aria-label="Icono decorativo"
												role="img"
											>
												<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
												<circle cx="12" cy="10" r="3" />
											</svg>
											{profileData.address}
										</p>
									)}
								</div>

								<div className="md:col-span-2">
									<div className="text-sm font-semibold text-default-700 mb-1 block">
										Contacto de Emergencia
									</div>
									{isEditing ? (
										<Input
											value={profileData.emergencyContact}
											onChange={(e) =>
												setProfileData({
													...profileData,
													emergencyContact: e.target.value,
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
													aria-label="Icono decorativo"
													role="img"
												>
													<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
													<circle cx="9" cy="7" r="4" />
													<line x1="19" x2="19" y1="8" y2="14" />
													<line x1="22" x2="16" y1="11" y2="11" />
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
												aria-label="Icono decorativo"
												role="img"
											>
												<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
												<circle cx="9" cy="7" r="4" />
												<line x1="19" x2="19" y1="8" y2="14" />
												<line x1="22" x2="16" y1="11" y2="11" />
											</svg>
											{profileData.emergencyContact}
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

			{/* Tarjeta de información académica */}
			<Card className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
				<CardHeader>
					<div className="flex items-center gap-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-5 h-5 text-primary"
							aria-label="Icono decorativo"
							role="img"
						>
							<path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
							<path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
							<path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
						</svg>
						<h3 className="text-lg font-bold text-primary">
							Información Académica
						</h3>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
								<span className="text-2xl font-bold text-primary">
									{profileData.semester}
								</span>
							</div>
							<div>
								<p className="text-xs text-default-600">Semestre Actual</p>
								<p className="text-sm font-semibold text-default-900">
									Octavo Semestre
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center">
								<span className="text-xl font-bold text-success">3.9</span>
							</div>
							<div>
								<p className="text-xs text-default-600">Promedio Acumulado</p>
								<p className="text-sm font-semibold text-default-900">
									Rendimiento Alto
								</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<div className="w-12 h-12 rounded-lg bg-warning/20 flex items-center justify-center">
								<span className="text-xl font-bold text-warning">68%</span>
							</div>
							<div>
								<p className="text-xs text-default-600">Progreso</p>
								<p className="text-sm font-semibold text-default-900">
									95/139 Créditos
								</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Tarjeta de estadísticas */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card className="bg-gradient-to-br from-secondary-50 to-secondary-100 border border-secondary-200">
					<CardBody className="flex flex-row items-center gap-4 p-5">
						<div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6 text-white"
								aria-label="Icono decorativo"
								role="img"
							>
								<path d="M11.25 4.533A9.707 9.707 0 006 3a9.735 9.735 0 00-3.25.555.75.75 0 00-.5.707v14.25a.75.75 0 001 .707A8.237 8.237 0 016 18.75c1.995 0 3.823.707 5.25 1.886V4.533zM12.75 20.636A8.214 8.214 0 0118 18.75c.966 0 1.89.166 2.75.47a.75.75 0 001-.708V4.262a.75.75 0 00-.5-.707A9.735 9.735 0 0018 3a9.707 9.707 0 00-5.25 1.533v16.103z" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-default-600">
								Materias Inscritas
							</p>
							<p className="text-2xl font-bold text-secondary">6</p>
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
								aria-label="Icono decorativo"
								role="img"
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
								Materias Aprobadas
							</p>
							<p className="text-2xl font-bold text-success">24</p>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
					<CardBody className="flex flex-row items-center gap-4 p-5">
						<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								className="w-6 h-6 text-white"
								aria-label="Icono decorativo"
								role="img"
							>
								<path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" />
								<path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-default-600">
								Solicitudes Activas
							</p>
							<p className="text-2xl font-bold text-primary">2</p>
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
							aria-label="Icono decorativo"
							role="img"
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
									Última actualización: Hace 2 meses
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
									Protege tu cuenta con seguridad adicional
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
}; // Vistas placeholder
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
			content = <StudentRequests studentId={studentUser.studentId} />;
			break;
		case 'create-request':
			content = <CreateRequestView />;
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
