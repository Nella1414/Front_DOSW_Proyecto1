import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	Spacer,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { type CurrentView, Sidebar, type User } from '../../components/sidebar';

// Usuario facultad simulado
const facultyUser: User = {
	id: 'faculty-1',
	name: 'Dra. María González',
	email: 'maria.gonzalez@escuelaing.edu.co',
	role: 'faculty',
};

// Hook para manejar la vista activa
function useFacultyViews(initial: CurrentView = 'dashboard') {
	const [view, setView] = useState<CurrentView>(initial);
	const navigate = (next: CurrentView) => setView(next);
	return { view, navigate };
}

// Interfaz para las solicitudes de cambio de horario
interface ScheduleRequest {
	id: string;
	radicado: string;
	studentCode: string;
	studentName: string;
	subject: string;
	currentSchedule: string;
	requestedSchedule: string;
	reason: string;
	status: 'pendiente' | 'aprobada' | 'rechazada';
	submittedDate: string;
	reviewedDate?: string;
	reviewerComment?: string;
}

// Mock data de solicitudes pendientes
const mockRequests: ScheduleRequest[] = [
	{
		id: '1',
		radicado: 'RAD-2025-001',
		studentCode: '2019101234',
		studentName: 'Ana María González',
		subject: 'Desarrollo Orientado por Objetos',
		currentSchedule: 'Lunes 8:00-10:00',
		requestedSchedule: 'Miércoles 14:00-16:00',
		reason:
			'Tengo un trabajo de medio tiempo en las mañanas y me es difícil asistir a la clase actual.',
		status: 'pendiente',
		submittedDate: '2025-01-15',
	},
	{
		id: '2',
		radicado: 'RAD-2025-002',
		studentCode: '2020205678',
		studentName: 'Carlos Andrés Rodríguez',
		subject: 'Cálculo Diferencial',
		currentSchedule: 'Martes 10:00-12:00',
		requestedSchedule: 'Jueves 8:00-10:00',
		reason:
			'Traslape con otra materia obligatoria de mi carrera que no tiene otro horario disponible.',
		status: 'pendiente',
		submittedDate: '2025-01-16',
	},
	{
		id: '3',
		radicado: 'RAD-2025-003',
		studentCode: '2021309876',
		studentName: 'María Paula Sánchez',
		subject: 'Probabilidad y Estadística',
		currentSchedule: 'Viernes 14:00-16:00',
		requestedSchedule: 'Lunes 10:00-12:00',
		reason:
			'Vivo lejos de la universidad y los viernes en la tarde hay poco transporte público.',
		status: 'pendiente',
		submittedDate: '2025-01-17',
	},
	{
		id: '4',
		radicado: 'RAD-2024-189',
		studentCode: '2019101234',
		studentName: 'Ana María González',
		subject: 'Física 1',
		currentSchedule: 'Jueves 8:00-10:00',
		requestedSchedule: 'Martes 14:00-16:00',
		reason: 'Solicitud previa del semestre anterior.',
		status: 'aprobada',
		submittedDate: '2024-12-10',
		reviewedDate: '2024-12-12',
		reviewerComment: 'Aprobado por disponibilidad de cupos.',
	},
	{
		id: '5',
		radicado: 'RAD-2024-198',
		studentCode: '2020205678',
		studentName: 'Carlos Andrés Rodríguez',
		subject: 'Desarrollo Web',
		currentSchedule: 'Lunes 14:00-16:00',
		requestedSchedule: 'Miércoles 8:00-10:00',
		reason: 'Solicitud del semestre pasado.',
		status: 'rechazada',
		submittedDate: '2024-12-11',
		reviewedDate: '2024-12-13',
		reviewerComment: 'No hay cupos disponibles en el horario solicitado.',
	},
];

// Componente de gestión de solicitudes
function RequestsManagementView() {
	const [selectedRequest, setSelectedRequest] =
		useState<ScheduleRequest | null>(null);
	const [filterStatus, setFilterStatus] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [reviewComment, setReviewComment] = useState('');
	const [isReadOnly, setIsReadOnly] = useState(false); // Estado para modo solo lectura

	const { isOpen, onOpen, onClose } = useDisclosure();
	const queryClient = useQueryClient();

	// Query para obtener solicitudes
	const { data: requests = mockRequests, isLoading } = useQuery({
		queryKey: ['scheduleRequests'],
		queryFn: async (): Promise<ScheduleRequest[]> => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return mockRequests;
		},
	});

	// Mutation para aprobar/rechazar solicitudes
	const reviewRequestMutation = useMutation({
		mutationFn: async ({
			requestId,
			status,
			comment,
		}: {
			requestId: string;
			status: 'aprobada' | 'rechazada';
			comment: string;
		}) => {
			// Simulación más rápida de la petición
			await new Promise((resolve) => setTimeout(resolve, 300));
			return { requestId, status, comment };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['scheduleRequests'] });
			onClose();
			setReviewComment('');
			setSelectedRequest(null);
		},
	});

	// Filtrar solicitudes
	const filteredRequests = requests.filter((req) => {
		const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
		const matchesSearch =
			req.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			req.studentCode.includes(searchTerm) ||
			req.radicado.toLowerCase().includes(searchTerm.toLowerCase()) ||
			req.subject.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	// Estadísticas
	const stats = {
		pending: requests.filter((r) => r.status === 'pendiente').length,
		approved: requests.filter((r) => r.status === 'aprobada').length,
		rejected: requests.filter((r) => r.status === 'rechazada').length,
		total: requests.length,
	};

	// Abrir modal de revisión (modo editable)
	const handleReviewRequest = (request: ScheduleRequest) => {
		setSelectedRequest(request);
		setReviewComment('');
		setIsReadOnly(false);
		onOpen();
	};

	// Abrir modal de detalles (modo solo lectura)
	const handleViewDetails = (request: ScheduleRequest) => {
		setSelectedRequest(request);
		setReviewComment(request.reviewerComment || '');
		setIsReadOnly(true);
		onOpen();
	};

	// Aprobar solicitud
	const handleApprove = () => {
		if (selectedRequest) {
			reviewRequestMutation.mutate({
				requestId: selectedRequest.id,
				status: 'aprobada',
				comment: reviewComment,
			});
		}
	};

	// Rechazar solicitud
	const handleReject = () => {
		if (selectedRequest && reviewComment.trim()) {
			reviewRequestMutation.mutate({
				requestId: selectedRequest.id,
				status: 'rechazada',
				comment: reviewComment,
			});
		}
	};

	// Función para obtener el color del chip según el estado
	const getStatusColor = (
		status: string,
	): 'default' | 'primary' | 'success' | 'warning' | 'danger' => {
		switch (status) {
			case 'pendiente':
				return 'warning';
			case 'aprobada':
				return 'success';
			case 'rechazada':
				return 'danger';
			default:
				return 'default';
		}
	};

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-foreground mb-2">
					Panel de Profesores
				</h1>
				<p className="text-lg text-default-600">
					Gestiona las solicitudes de cambio de horario de tus estudiantes
				</p>
			</div>

			{/* Estadísticas */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
				<Card shadow="sm" className="bg-warning/10 border border-warning/20">
					<CardBody className="text-center py-6">
						<p className="text-sm font-semibold text-default-600 mb-2">
							Pendientes
						</p>
						<h3 className="text-4xl font-bold text-warning">{stats.pending}</h3>
					</CardBody>
				</Card>

				<Card shadow="sm" className="bg-success/10 border border-success/20">
					<CardBody className="text-center py-6">
						<p className="text-sm font-semibold text-default-600 mb-2">
							Aprobadas
						</p>
						<h3 className="text-4xl font-bold text-success">
							{stats.approved}
						</h3>
					</CardBody>
				</Card>

				<Card shadow="sm" className="bg-danger/10 border border-danger/20">
					<CardBody className="text-center py-6">
						<p className="text-sm font-semibold text-default-600 mb-2">
							Rechazadas
						</p>
						<h3 className="text-4xl font-bold text-danger">{stats.rejected}</h3>
					</CardBody>
				</Card>

				<Card shadow="sm" className="bg-primary/10 border border-primary/20">
					<CardBody className="text-center py-6">
						<p className="text-sm font-semibold text-default-600 mb-2">Total</p>
						<h3 className="text-4xl font-bold text-primary">{stats.total}</h3>
					</CardBody>
				</Card>
			</div>

			<Spacer y={4} />

			{/* Filtros y búsqueda */}
			<Card shadow="md" className="mb-6">
				<CardBody>
					<div className="flex flex-col md:flex-row gap-4">
						<Input
							placeholder="Buscar por nombre, código, radicado o materia..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							startContent={
								<span className="text-default-400 text-xl">🔍</span>
							}
							size="lg"
							className="flex-1"
							classNames={{
								input: 'text-base',
							}}
						/>

						<Select
							label="Filtrar por estado"
							selectedKeys={[filterStatus]}
							onChange={(e) => setFilterStatus(e.target.value)}
							size="lg"
							className="md:w-64"
						>
							<SelectItem key="all">Todas las solicitudes</SelectItem>
							<SelectItem key="pendiente">Pendientes</SelectItem>
							<SelectItem key="aprobada">Aprobadas</SelectItem>
							<SelectItem key="rechazada">Rechazadas</SelectItem>
						</Select>
					</div>
				</CardBody>
			</Card>

			{/* Tabla de solicitudes */}
			<Card shadow="md">
				<CardHeader className="flex justify-between items-center pb-4">
					<div>
						<h2 className="text-2xl font-bold text-foreground">
							Solicitudes de Cambio de Horario
						</h2>
						<p className="text-sm text-default-500 mt-1">
							{filteredRequests.length} solicitud(es) encontrada(s)
						</p>
					</div>
					<Chip color="primary" variant="flat" size="lg">
						{stats.pending} pendientes
					</Chip>
				</CardHeader>
				<Divider />
				<CardBody>
					<Table
						aria-label="Tabla de solicitudes de cambio de horario"
						shadow="none"
						classNames={{
							wrapper: 'p-0',
							th: 'bg-default-100 text-default-700 font-bold text-sm',
							td: 'text-base',
						}}
					>
						<TableHeader>
							<TableColumn>RADICADO</TableColumn>
							<TableColumn>ESTUDIANTE</TableColumn>
							<TableColumn>MATERIA</TableColumn>
							<TableColumn>HORARIOS</TableColumn>
							<TableColumn>FECHA</TableColumn>
							<TableColumn>ESTADO</TableColumn>
							<TableColumn>ACCIONES</TableColumn>
						</TableHeader>
						<TableBody
							items={filteredRequests}
							isLoading={isLoading}
							emptyContent="No hay solicitudes para mostrar"
						>
							{(request) => (
								<TableRow key={request.id}>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-mono text-sm font-semibold text-primary">
												{request.radicado}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex flex-col">
											<span className="font-semibold text-foreground">
												{request.studentName}
											</span>
											<span className="text-sm text-default-500">
												{request.studentCode}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<span className="text-default-700">{request.subject}</span>
									</TableCell>
									<TableCell>
										<div className="flex flex-col gap-1">
											<div className="flex items-center gap-2">
												<span className="text-xs text-default-500">
													Actual:
												</span>
												<Chip size="sm" variant="flat" color="default">
													{request.currentSchedule}
												</Chip>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-xs text-default-500">
													Solicitado:
												</span>
												<Chip size="sm" variant="flat" color="primary">
													{request.requestedSchedule}
												</Chip>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<span className="text-sm text-default-600">
											{new Date(request.submittedDate).toLocaleDateString(
												'es-ES',
												{
													year: 'numeric',
													month: 'short',
													day: 'numeric',
												},
											)}
										</span>
									</TableCell>
									<TableCell>
										<Chip
											color={getStatusColor(request.status)}
											variant="flat"
											size="md"
											className="font-semibold"
										>
											{request.status.charAt(0).toUpperCase() +
												request.status.slice(1)}
										</Chip>
									</TableCell>
									<TableCell>
										{request.status === 'pendiente' ? (
											<Button
												size="sm"
												color="primary"
												variant="flat"
												onPress={() => handleReviewRequest(request)}
											>
												Revisar
											</Button>
										) : (
											<Button
												size="sm"
												variant="light"
												color="default"
												onPress={() => handleViewDetails(request)}
											>
												Ver detalles
											</Button>
										)}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{/* Modal de revisión */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size="2xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<h3 className="text-2xl font-bold">
									{isReadOnly ? 'Detalles de Solicitud' : 'Revisar Solicitud'}
								</h3>
								{selectedRequest && (
									<p className="text-sm text-default-500 font-normal">
										Radicado: {selectedRequest.radicado}
									</p>
								)}
							</ModalHeader>
							<Divider />
							<ModalBody className="py-6">
								{selectedRequest && (
									<div className="space-y-4">
										{/* Información del estudiante */}
										<Card shadow="sm" className="bg-default-50">
											<CardBody>
												<h4 className="text-lg font-bold text-foreground mb-3">
													📚 Información del Estudiante
												</h4>
												<div className="grid grid-cols-2 gap-3">
													<div>
														<p className="text-sm text-default-500 mb-1">
															Nombre:
														</p>
														<p className="text-base font-semibold text-foreground">
															{selectedRequest.studentName}
														</p>
													</div>
													<div>
														<p className="text-sm text-default-500 mb-1">
															Código:
														</p>
														<p className="text-base font-semibold text-foreground">
															{selectedRequest.studentCode}
														</p>
													</div>
												</div>
											</CardBody>
										</Card>

										{/* Detalles de la solicitud */}
										<Card shadow="sm" className="bg-primary/5">
											<CardBody>
												<h4 className="text-lg font-bold text-foreground mb-3">
													📅 Detalles de la Solicitud
												</h4>
												<div className="space-y-3">
													<div>
														<p className="text-sm text-default-500 mb-1">
															Materia:
														</p>
														<p className="text-base font-semibold text-foreground">
															{selectedRequest.subject}
														</p>
													</div>
													<div>
														<p className="text-sm text-default-500 mb-2">
															Horario Actual:
														</p>
														<Chip color="default" variant="flat" size="lg">
															{selectedRequest.currentSchedule}
														</Chip>
													</div>
													<div>
														<p className="text-sm text-default-500 mb-2">
															Horario Solicitado:
														</p>
														<Chip color="primary" variant="flat" size="lg">
															{selectedRequest.requestedSchedule}
														</Chip>
													</div>
													<div>
														<p className="text-sm text-default-500 mb-1">
															Fecha de Solicitud:
														</p>
														<p className="text-base text-foreground">
															{new Date(
																selectedRequest.submittedDate,
															).toLocaleDateString('es-ES', {
																weekday: 'long',
																year: 'numeric',
																month: 'long',
																day: 'numeric',
															})}
														</p>
													</div>
												</div>
											</CardBody>
										</Card>

										{/* Razón de la solicitud */}
										<Card shadow="sm" className="bg-warning/5">
											<CardBody>
												<h4 className="text-lg font-bold text-foreground mb-2">
													💬 Razón de la Solicitud
												</h4>
												<p className="text-base text-default-700 leading-relaxed">
													{selectedRequest.reason}
												</p>
											</CardBody>
										</Card>

										{/* Comentario del revisor */}
										<div>
											<Textarea
												label={
													isReadOnly
														? 'Comentario del Revisor'
														: 'Comentario de Revisión'
												}
												placeholder={
													isReadOnly
														? ''
														: 'Escribe un comentario explicando tu decisión (requerido para rechazar)'
												}
												value={reviewComment}
												onChange={(e) => setReviewComment(e.target.value)}
												isReadOnly={isReadOnly}
												minRows={4}
												size="lg"
												description={
													isReadOnly
														? 'Comentario dejado por el revisor'
														: 'Este comentario será visible para el estudiante'
												}
												classNames={{
													input: 'text-base',
													label: 'text-base font-semibold',
												}}
											/>
										</div>
									</div>
								)}
							</ModalBody>
							<Divider />
							<ModalFooter className="gap-2">
								{isReadOnly ? (
									<Button
										color="primary"
										variant="flat"
										onPress={onClose}
										size="lg"
									>
										Cerrar
									</Button>
								) : (
									<>
										<Button
											color="default"
											variant="light"
											onPress={onClose}
											size="lg"
										>
											Cancelar
										</Button>
										<Button
											color="danger"
											variant="flat"
											onPress={handleReject}
											isDisabled={!reviewComment.trim()}
											isLoading={reviewRequestMutation.isPending}
											size="lg"
										>
											Rechazar
										</Button>
										<Button
											color="success"
											variant="shadow"
											onPress={handleApprove}
											isLoading={reviewRequestMutation.isPending}
											size="lg"
										>
											Aprobar
										</Button>
									</>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}

// Componente placeholder para otras vistas
function SimplePlaceholder({ title }: { title: string }) {
	return (
		<Card>
			<CardBody className="text-center py-12">
				<p className="text-lg text-default-500">Vista de {title}</p>
				<p className="text-sm text-default-400 mt-2">
					Esta sección está en desarrollo
				</p>
			</CardBody>
		</Card>
	);
}

// Componente de Reportes para Faculty
function FacultyReportsView() {
	const [selectedPeriod, setSelectedPeriod] = useState('2024-2');

	// Query para obtener datos de reportes
	const { data: requests = mockRequests } = useQuery({
		queryKey: ['scheduleRequests'],
		queryFn: async (): Promise<ScheduleRequest[]> => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return mockRequests;
		},
	});

	// Calcular estadísticas
	const stats = {
		total: requests.length,
		pending: requests.filter((r) => r.status === 'pendiente').length,
		approved: requests.filter((r) => r.status === 'aprobada').length,
		rejected: requests.filter((r) => r.status === 'rechazada').length,
		approvalRate:
			requests.length > 0
				? Math.round(
						(requests.filter((r) => r.status === 'aprobada').length /
							requests.length) *
							100,
					)
				: 0,
	};

	// Agrupar solicitudes por materia
	const requestsBySubject = requests.reduce(
		(acc, req) => {
			const subject = req.subject;
			if (!acc[subject]) {
				acc[subject] = { total: 0, approved: 0, rejected: 0, pending: 0 };
			}
			acc[subject].total++;
			if (req.status === 'aprobada') acc[subject].approved++;
			if (req.status === 'rechazada') acc[subject].rejected++;
			if (req.status === 'pendiente') acc[subject].pending++;
			return acc;
		},
		{} as Record<
			string,
			{ total: number; approved: number; rejected: number; pending: number }
		>,
	);

	const subjectStats = Object.entries(requestsBySubject)
		.map(([name, data]) => ({
			name,
			...data,
			approvalRate:
				data.total > 0 ? Math.round((data.approved / data.total) * 100) : 0,
		}))
		.sort((a, b) => b.total - a.total);

	// Exportar a CSV
	const handleExportCSV = () => {
		const csvContent = [
			['Métrica', 'Valor'],
			['Total de Solicitudes', stats.total],
			['Solicitudes Aprobadas', stats.approved],
			['Solicitudes Rechazadas', stats.rejected],
			['Solicitudes Pendientes', stats.pending],
			['Tasa de Aprobación', `${stats.approvalRate}%`],
			['', ''],
			[
				'Materia',
				'Total',
				'Aprobadas',
				'Rechazadas',
				'Pendientes',
				'Tasa de Aprobación',
			],
			...subjectStats.map((s) => [
				s.name,
				s.total,
				s.approved,
				s.rejected,
				s.pending,
				`${s.approvalRate}%`,
			]),
		]
			.map((row) => row.join(','))
			.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute(
			'download',
			`reporte_faculty_${selectedPeriod}_${Date.now()}.csv`,
		);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<div className="space-y-6">
			{/* Header con controles */}
			<Card>
				<CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<h2 className="text-2xl font-bold text-default-900">
							Reportes de Solicitudes
						</h2>
						<p className="text-base text-default-600 mt-1">
							Análisis y métricas de las solicitudes gestionadas
						</p>
					</div>
					<div className="flex gap-2">
						<Select
							label="Período"
							selectedKeys={[selectedPeriod]}
							onChange={(e) => setSelectedPeriod(e.target.value)}
							className="w-40"
							size="sm"
						>
							<SelectItem key="2024-1">2024-1</SelectItem>
							<SelectItem key="2024-2">2024-2</SelectItem>
							<SelectItem key="2025-1">2025-1</SelectItem>
						</Select>
						<Button
							color="success"
							variant="flat"
							size="lg"
							onPress={handleExportCSV}
						>
							📥 Exportar CSV
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Tarjetas de estadísticas generales */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card className="bg-gradient-to-br from-primary/10 to-primary/5">
					<CardBody className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm text-default-600 font-medium">
									Total Solicitudes
								</p>
								<p className="text-3xl font-bold text-primary mt-2">
									{stats.total}
								</p>
							</div>
							<Chip color="primary" variant="flat" size="sm">
								100%
							</Chip>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-success/10 to-success/5">
					<CardBody className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm text-default-600 font-medium">
									Aprobadas
								</p>
								<p className="text-3xl font-bold text-success mt-2">
									{stats.approved}
								</p>
							</div>
							<Chip color="success" variant="flat" size="sm">
								{stats.approvalRate}%
							</Chip>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-danger/10 to-danger/5">
					<CardBody className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm text-default-600 font-medium">
									Rechazadas
								</p>
								<p className="text-3xl font-bold text-danger mt-2">
									{stats.rejected}
								</p>
							</div>
							<Chip color="danger" variant="flat" size="sm">
								{stats.total > 0
									? Math.round((stats.rejected / stats.total) * 100)
									: 0}
								%
							</Chip>
						</div>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-warning/10 to-warning/5">
					<CardBody className="p-6">
						<div className="flex justify-between items-start">
							<div>
								<p className="text-sm text-default-600 font-medium">
									Pendientes
								</p>
								<p className="text-3xl font-bold text-warning mt-2">
									{stats.pending}
								</p>
							</div>
							<Chip color="warning" variant="flat" size="sm">
								{stats.total > 0
									? Math.round((stats.pending / stats.total) * 100)
									: 0}
								%
							</Chip>
						</div>
					</CardBody>
				</Card>
			</div>

			{/* Tabla de estadísticas por materia */}
			<Card>
				<CardHeader>
					<h3 className="text-xl font-bold text-default-900">
						Solicitudes por Materia
					</h3>
				</CardHeader>
				<Divider />
				<CardBody>
					<Table aria-label="Estadísticas por materia">
						<TableHeader>
							<TableColumn>MATERIA</TableColumn>
							<TableColumn>TOTAL</TableColumn>
							<TableColumn>APROBADAS</TableColumn>
							<TableColumn>RECHAZADAS</TableColumn>
							<TableColumn>PENDIENTES</TableColumn>
							<TableColumn>TASA APROBACIÓN</TableColumn>
						</TableHeader>
						<TableBody>
							{subjectStats.map((subject) => (
								<TableRow key={subject.name}>
									<TableCell>
										<p className="font-semibold text-default-900">
											{subject.name}
										</p>
									</TableCell>
									<TableCell>
										<Chip color="primary" variant="flat" size="sm">
											{subject.total}
										</Chip>
									</TableCell>
									<TableCell>
										<Chip color="success" variant="flat" size="sm">
											{subject.approved}
										</Chip>
									</TableCell>
									<TableCell>
										<Chip color="danger" variant="flat" size="sm">
											{subject.rejected}
										</Chip>
									</TableCell>
									<TableCell>
										<Chip color="warning" variant="flat" size="sm">
											{subject.pending}
										</Chip>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<div className="w-20 bg-default-200 rounded-full h-2">
												<div
													className="bg-success h-2 rounded-full"
													style={{ width: `${subject.approvalRate}%` }}
												/>
											</div>
											<span className="text-sm font-semibold text-default-700">
												{subject.approvalRate}%
											</span>
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{/* Tarjeta de resumen */}
			<Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
				<CardBody className="p-6">
					<h3 className="text-lg font-bold text-default-900 mb-4">
						📈 Resumen del Período {selectedPeriod}
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
						<div>
							<p className="text-default-600">
								<span className="font-semibold">
									Tasa de Aprobación Global:
								</span>{' '}
								<Chip color="success" variant="flat" size="sm" className="ml-2">
									{stats.approvalRate}%
								</Chip>
							</p>
						</div>
						<div>
							<p className="text-default-600">
								<span className="font-semibold">Materias con Solicitudes:</span>{' '}
								<Chip color="primary" variant="flat" size="sm" className="ml-2">
									{subjectStats.length}
								</Chip>
							</p>
						</div>
						<div>
							<p className="text-default-600">
								<span className="font-semibold">Solicitudes Procesadas:</span>{' '}
								<Chip
									color="secondary"
									variant="flat"
									size="sm"
									className="ml-2"
								>
									{stats.approved + stats.rejected}
								</Chip>
							</p>
						</div>
						<div>
							<p className="text-default-600">
								<span className="font-semibold">Por Revisar:</span>{' '}
								<Chip color="warning" variant="flat" size="sm" className="ml-2">
									{stats.pending}
								</Chip>
							</p>
						</div>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

// Componente de Perfil para Faculty
function FacultyProfileView() {
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		name: facultyUser.name,
		email: facultyUser.email,
		phone: '+57 310 555 1234',
		office: 'Edificio H, Oficina 305',
		department: 'Ingeniería de Sistemas',
		specialization: 'Desarrollo de Software, Ingeniería Web',
		yearsExperience: '12 años',
		biography:
			'Doctora en Ingeniería de Sistemas con énfasis en desarrollo de software y arquitecturas web. Experiencia en docencia universitaria y proyectos de investigación en el área de sistemas distribuidos.',
	});

	const [assignedSubjects] = useState([
		{
			code: 'DOSW',
			name: 'Desarrollo Orientado por Servicios Web',
			students: 42,
			schedule: 'Lunes y Miércoles 2:00 PM - 4:00 PM',
			semester: '2024-2',
		},
		{
			code: 'ARQSOFT',
			name: 'Arquitectura de Software',
			students: 38,
			schedule: 'Martes y Jueves 10:00 AM - 12:00 PM',
			semester: '2024-2',
		},
		{
			code: 'INGWEB',
			name: 'Ingeniería Web',
			students: 35,
			schedule: 'Viernes 8:00 AM - 12:00 PM',
			semester: '2024-2',
		},
	]);

	const [availability] = useState([
		{ day: 'Lunes', hours: '2:00 PM - 6:00 PM' },
		{ day: 'Martes', hours: '10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM' },
		{ day: 'Miércoles', hours: '2:00 PM - 6:00 PM' },
		{ day: 'Jueves', hours: '10:00 AM - 2:00 PM' },
		{ day: 'Viernes', hours: '8:00 AM - 2:00 PM' },
	]);

	const handleSaveProfile = () => {
		// Simulación de guardado
		setTimeout(() => {
			setIsEditing(false);
			alert('Perfil actualizado exitosamente');
		}, 500);
	};

	return (
		<div className="space-y-6">
			{/* Tarjeta de información personal */}
			<Card>
				<CardHeader className="flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-default-900">
							👤 Información Personal
						</h2>
						<p className="text-base text-default-600 mt-1">
							Datos personales y de contacto
						</p>
					</div>
					<Button
						color={isEditing ? 'success' : 'primary'}
						variant="flat"
						onPress={() => {
							if (isEditing) {
								handleSaveProfile();
							} else {
								setIsEditing(true);
							}
						}}
					>
						{isEditing ? '💾 Guardar' : '✏️ Editar'}
					</Button>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex items-center gap-4">
							<div className="w-24 h-24 rounded-full bg-warning/20 flex items-center justify-center">
								<span className="text-4xl font-bold text-warning">
									{profileData.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</span>
							</div>
							<div>
								<p className="text-xl font-bold text-default-900">
									{profileData.name}
								</p>
								<Chip color="warning" variant="flat" size="sm" className="mt-1">
									Profesor
								</Chip>
							</div>
						</div>

						<div className="space-y-4">
							<Input
								label="Nombre Completo"
								value={profileData.name}
								onChange={(e) =>
									setProfileData({ ...profileData, name: e.target.value })
								}
								isReadOnly={!isEditing}
								size="lg"
								classNames={{ input: 'text-base' }}
							/>
							<Input
								label="Correo Electrónico"
								value={profileData.email}
								isReadOnly
								size="lg"
								classNames={{ input: 'text-base' }}
								description="El correo institucional no se puede modificar"
							/>
						</div>

						<Input
							label="Teléfono"
							value={profileData.phone}
							onChange={(e) =>
								setProfileData({ ...profileData, phone: e.target.value })
							}
							isReadOnly={!isEditing}
							size="lg"
							classNames={{ input: 'text-base' }}
						/>

						<Input
							label="Oficina"
							value={profileData.office}
							onChange={(e) =>
								setProfileData({ ...profileData, office: e.target.value })
							}
							isReadOnly={!isEditing}
							size="lg"
							classNames={{ input: 'text-base' }}
						/>

						<Input
							label="Departamento"
							value={profileData.department}
							isReadOnly={!isEditing}
							size="lg"
							classNames={{ input: 'text-base' }}
						/>

						<Input
							label="Especialización"
							value={profileData.specialization}
							onChange={(e) =>
								setProfileData({
									...profileData,
									specialization: e.target.value,
								})
							}
							isReadOnly={!isEditing}
							size="lg"
							classNames={{ input: 'text-base' }}
						/>

						<div className="md:col-span-2">
							<Textarea
								label="Biografía"
								value={profileData.biography}
								onChange={(e) =>
									setProfileData({ ...profileData, biography: e.target.value })
								}
								isReadOnly={!isEditing}
								minRows={4}
								size="lg"
								classNames={{ input: 'text-base' }}
							/>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Materias asignadas */}
			<Card>
				<CardHeader>
					<div>
						<h3 className="text-xl font-bold text-default-900">
							📚 Materias Asignadas
						</h3>
						<p className="text-sm text-default-600 mt-1">
							Período académico actual: 2024-2
						</p>
					</div>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						{assignedSubjects.map((subject) => (
							<Card
								key={subject.code}
								shadow="sm"
								className="bg-gradient-to-br from-primary/5 to-primary/10"
							>
								<CardBody className="p-4">
									<div className="flex justify-between items-start mb-3">
										<Chip color="primary" variant="flat" size="sm">
											{subject.code}
										</Chip>
										<Chip color="success" variant="flat" size="sm">
											{subject.students} estudiantes
										</Chip>
									</div>
									<h4 className="text-lg font-bold text-default-900 mb-2">
										{subject.name}
									</h4>
									<div className="space-y-2 text-sm">
										<p className="text-default-600">
											<span className="font-semibold">Horario:</span>{' '}
											{subject.schedule}
										</p>
									</div>
								</CardBody>
							</Card>
						))}
					</div>
				</CardBody>
			</Card>

			{/* Horario de disponibilidad */}
			<Card>
				<CardHeader>
					<h3 className="text-xl font-bold text-default-900">
						🕐 Horario de Atención
					</h3>
				</CardHeader>
				<Divider />
				<CardBody>
					<Table aria-label="Horario de disponibilidad">
						<TableHeader>
							<TableColumn>DÍA</TableColumn>
							<TableColumn>HORARIO DE ATENCIÓN</TableColumn>
						</TableHeader>
						<TableBody>
							{availability.map((item) => (
								<TableRow key={item.day}>
									<TableCell>
										<p className="font-semibold text-default-900">{item.day}</p>
									</TableCell>
									<TableCell>
										<Chip color="secondary" variant="flat">
											{item.hours}
										</Chip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{/* Estadísticas rápidas */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<Card className="bg-gradient-to-br from-warning/10 to-warning/5">
					<CardBody className="text-center p-6">
						<p className="text-sm text-default-600 font-medium">
							Años de Experiencia
						</p>
						<p className="text-3xl font-bold text-warning mt-2">
							{profileData.yearsExperience}
						</p>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-primary/10 to-primary/5">
					<CardBody className="text-center p-6">
						<p className="text-sm text-default-600 font-medium">
							Materias Activas
						</p>
						<p className="text-3xl font-bold text-primary mt-2">
							{assignedSubjects.length}
						</p>
					</CardBody>
				</Card>

				<Card className="bg-gradient-to-br from-success/10 to-success/5">
					<CardBody className="text-center p-6">
						<p className="text-sm text-default-600 font-medium">
							Total Estudiantes
						</p>
						<p className="text-3xl font-bold text-success mt-2">
							{assignedSubjects.reduce((sum, s) => sum + s.students, 0)}
						</p>
					</CardBody>
				</Card>
			</div>

			{/* Configuración de cuenta */}
			<Card className="bg-gradient-to-br from-danger/5 to-danger/10">
				<CardHeader>
					<h3 className="text-xl font-bold text-default-900">
						🔐 Configuración de Seguridad
					</h3>
				</CardHeader>
				<Divider />
				<CardBody>
					<div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
						<div>
							<p className="text-base font-semibold text-default-900">
								Cambiar Contraseña
							</p>
							<p className="text-sm text-default-600 mt-1">
								Actualiza tu contraseña periódicamente para mayor seguridad
							</p>
						</div>
						<Button color="danger" variant="flat">
							Cambiar Contraseña
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}

// Componente principal del Dashboard de Facultad
export default function FacultyDashboardPage() {
	const { view, navigate } = useFacultyViews();

	// Renderizar contenido según la vista actual
	let content: React.ReactNode;
	switch (view) {
		case 'dashboard':
			// Vista principal con estadísticas y resumen
			content = <RequestsManagementView />;
			break;
		case 'requests':
			// Vista detallada de gestión de solicitudes
			content = <RequestsManagementView />;
			break;
		case 'reports':
			content = <FacultyReportsView />;
			break;
		case 'profile':
			content = <FacultyProfileView />;
			break;
		default:
			content = <SimplePlaceholder title="Vista" />;
	}

	return (
		<div className="flex h-dvh w-dvw bg-content2 text-content2-foreground">
			<Sidebar user={facultyUser} currentView={view} onNavigate={navigate} />
			<main className="flex-1 h-full overflow-y-auto p-6">
				<div className="max-w-7xl mx-auto">
					<header className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h1 className="text-2xl font-semibold tracking-tight">
								{view === 'dashboard'
									? 'Dashboard de Facultad'
									: view === 'requests'
										? 'Gestión de Solicitudes'
										: view === 'reports'
											? 'Reportes'
											: view === 'profile'
												? 'Mi Perfil'
												: view.replace('-', ' ')}
							</h1>
							<p className="text-xs text-default-500">
								{view === 'dashboard'
									? 'Gestiona las solicitudes de cambio de horario de los estudiantes.'
									: view === 'requests'
										? 'Revisa, aprueba o rechaza las solicitudes de cambio de horario.'
										: view === 'reports'
											? 'Visualiza reportes y estadísticas de solicitudes.'
											: view === 'profile'
												? 'Información personal y académica.'
												: 'Gestión de la sección seleccionada.'}
							</p>
						</div>
						<div className="flex gap-2">
							<Button
								size="sm"
								variant="flat"
								color="primary"
								onPress={() => navigate('dashboard')}
							>
								Inicio
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="warning"
								onPress={() => navigate('requests')}
							>
								Solicitudes
							</Button>
							<Button
								size="sm"
								variant="flat"
								color="secondary"
								onPress={() => navigate('reports')}
							>
								Reportes
							</Button>
						</div>
					</header>
					{content}
					<Spacer y={12} />
					<footer className="pt-8 pb-6 text-center text-[11px] text-default-400">
						SIRHA &middot; Dashboard de Facultad &middot;{' '}
						{new Date().getFullYear()}
					</footer>
				</div>
			</main>
		</div>
	);
}
