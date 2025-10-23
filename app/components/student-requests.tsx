import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	useDisclosure,
} from '@heroui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

// Tipos de datos para solicitudes
export interface RequestStatusHistory {
	id: string;
	status:
		| 'PENDING'
		| 'IN_REVIEW'
		| 'WAITING_INFO'
		| 'APPROVED'
		| 'REJECTED'
		| 'CANCELED';
	changedBy: string;
	changedAt: string;
	comment?: string;
}

// Información del programa asignado
export interface AssignedProgram {
	name: string;
	reason: string; // Razón del ruteo en lenguaje claro
	email: string;
	phone: string;
	officeHours: string;
	location?: string;
}

export interface StudentRequest {
	id: string;
	radicado: string;
	type: string;
	description: string;
	createdAt: string;
	currentStatus:
		| 'PENDING'
		| 'IN_REVIEW'
		| 'WAITING_INFO'
		| 'APPROVED'
		| 'REJECTED'
		| 'CANCELED';
	statusHistory: RequestStatusHistory[];
	studentId: string;
	// Nuevos campos para detalles de la solicitud
	fromSubject?: string; // De qué materia/grupo
	toSubject?: string; // A qué materia/grupo
	studentObservations?: string; // Observaciones del estudiante
	priority?: 'LOW' | 'MEDIUM' | 'HIGH'; // Prioridad asignada
	contactEmail?: string; // Email de contacto
	contactPhone?: string; // Teléfono de contacto
	// Información de ruteo
	assignedProgram?: AssignedProgram; // Programa al que fue asignada la solicitud
}

// Mock data - simula solicitudes del estudiante
const mockRequests: StudentRequest[] = [
	{
		id: '1',
		radicado: 'RAD-2024-001',
		type: 'Cancelación de Materia',
		description: 'Solicitud de cancelación de Cálculo Vectorial',
		createdAt: '2024-10-15T10:30:00Z',
		currentStatus: 'APPROVED',
		studentId: '1234567890',
		fromSubject: 'Cálculo Vectorial - Grupo 01',
		toSubject: 'N/A',
		studentObservations:
			'Solicito la cancelación debido a dificultades personales que afectan mi rendimiento académico. Planeo retomar la materia el próximo semestre.',
		priority: 'HIGH',
		contactEmail: 'estudiante@example.com',
		contactPhone: '+57 300 123 4567',
		assignedProgram: {
			name: 'Ingeniería de Sistemas',
			reason:
				'Esta solicitud fue asignada a Ingeniería de Sistemas porque la materia Cálculo Vectorial pertenece al plan de estudios de este programa.',
			email: 'sistemas@universidad.edu.co',
			phone: '+57 (1) 234 5678 ext. 101',
			officeHours: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
			location: 'Edificio de Ingenierías, Piso 3, Oficina 301',
		},
		statusHistory: [
			{
				id: 'h1',
				status: 'PENDING',
				changedBy: 'Sistema',
				changedAt: '2024-10-15T10:30:00Z',
				comment: 'Solicitud creada automáticamente',
			},
			{
				id: 'h2',
				status: 'IN_REVIEW',
				changedBy: 'Decanatura',
				changedAt: '2024-10-16T14:20:00Z',
				comment: 'En revisión por decanatura',
			},
			{
				id: 'h3',
				status: 'APPROVED',
				changedBy: 'Decanatura',
				changedAt: '2024-10-17T09:15:00Z',
				comment: 'Aprobada por motivos académicos justificados',
			},
		],
	},
	{
		id: '2',
		radicado: 'RAD-2024-002',
		type: 'Préstamo de Aula',
		description: 'Solicitud de aula para proyecto grupal',
		createdAt: '2024-10-20T15:45:00Z',
		currentStatus: 'PENDING',
		studentId: '1234567890',
		fromSubject: 'N/A',
		toSubject: 'Aula 301 - Edificio A',
		studentObservations:
			'Necesitamos el aula para trabajar en nuestro proyecto final de Desarrollo de Software. Somos un grupo de 5 personas.',
		priority: 'MEDIUM',
		contactEmail: 'estudiante@example.com',
		contactPhone: '+57 300 123 4567',
		assignedProgram: {
			name: 'Servicios Generales',
			reason:
				'Tu solicitud fue dirigida a Servicios Generales porque las reservas de aulas y espacios comunes son gestionadas por esta dependencia.',
			email: 'servicios@universidad.edu.co',
			phone: '+57 (1) 234 5678 ext. 200',
			officeHours:
				'Lunes a Viernes: 7:00 AM - 6:00 PM, Sábados: 8:00 AM - 12:00 PM',
			location: 'Edificio Administrativo, Piso 1, Oficina 105',
		},
		statusHistory: [
			{
				id: 'h4',
				status: 'PENDING',
				changedBy: 'Sistema',
				changedAt: '2024-10-20T15:45:00Z',
				comment: 'Solicitud creada',
			},
		],
	},
	{
		id: '3',
		radicado: 'RAD-2024-003',
		type: 'Homologación de Materia',
		description: 'Homologación de Programación Avanzada',
		createdAt: '2024-10-18T11:00:00Z',
		currentStatus: 'IN_REVIEW',
		studentId: '1234567890',
		fromSubject: 'Programación Avanzada - Universidad XYZ',
		toSubject: 'Programación Orientada a Objetos - Grupo 02',
		studentObservations:
			'Cursé esta materia en mi universidad anterior con una calificación de 4.5. Adjunto certificado de notas y programa académico.',
		priority: 'HIGH',
		contactEmail: 'estudiante@example.com',
		contactPhone: '+57 300 123 4567',
		assignedProgram: {
			name: 'Registro Académico',
			reason:
				'Esta solicitud se envió a Registro Académico porque todas las homologaciones de materias requieren validación de contenidos y aprobación oficial por parte de esta oficina.',
			email: 'registro@universidad.edu.co',
			phone: '+57 (1) 234 5678 ext. 150',
			officeHours: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
			location: 'Edificio Administrativo, Piso 2, Oficina 201',
		},
		statusHistory: [
			{
				id: 'h5',
				status: 'PENDING',
				changedBy: 'Sistema',
				changedAt: '2024-10-18T11:00:00Z',
			},
			{
				id: 'h6',
				status: 'IN_REVIEW',
				changedBy: 'Registro Académico',
				changedAt: '2024-10-19T10:30:00Z',
				comment: 'Documentación en revisión',
			},
		],
	},
	{
		id: '4',
		radicado: 'RAD-2024-004',
		type: 'Certificado de Notas',
		description: 'Certificado de notas para trámite de beca',
		createdAt: '2024-10-22T09:00:00Z',
		currentStatus: 'PENDING',
		studentId: '1234567890',
		fromSubject: 'N/A',
		toSubject: 'N/A',
		studentObservations:
			'Requiero el certificado para aplicar a una beca internacional. Necesito que incluya todas las materias cursadas hasta la fecha.',
		priority: 'LOW',
		contactEmail: 'estudiante@example.com',
		contactPhone: '+57 300 123 4567',
		assignedProgram: {
			name: 'Secretaría Académica',
			reason:
				'Tu solicitud fue asignada a Secretaría Académica porque la expedición de certificados y documentos oficiales es responsabilidad de esta área.',
			email: 'secretaria@universidad.edu.co',
			phone: '+57 (1) 234 5678 ext. 120',
			officeHours: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
			location: 'Edificio Administrativo, Piso 1, Ventanilla 3',
		},
		statusHistory: [
			{
				id: 'h7',
				status: 'PENDING',
				changedBy: 'Sistema',
				changedAt: '2024-10-22T09:00:00Z',
			},
		],
	},
	{
		id: '5',
		radicado: 'RAD-2024-005',
		type: 'Cambio de Grupo',
		description: 'Solicitud de cambio de grupo en Bases de Datos',
		createdAt: '2024-10-21T13:30:00Z',
		currentStatus: 'WAITING_INFO',
		studentId: '1234567890',
		fromSubject: 'Bases de Datos - Grupo 01',
		toSubject: 'Bases de Datos - Grupo 03',
		studentObservations:
			'Solicito el cambio debido a un conflicto de horarios con mi trabajo de medio tiempo.',
		priority: 'MEDIUM',
		contactEmail: 'estudiante@example.com',
		contactPhone: '+57 300 123 4567',
		assignedProgram: {
			name: 'Ingeniería de Sistemas',
			reason:
				'Tu solicitud fue asignada a Ingeniería de Sistemas porque los cambios de grupo entre materias del programa son gestionados por la coordinación del mismo.',
			email: 'sistemas@universidad.edu.co',
			phone: '+57 (1) 234 5678 ext. 101',
			officeHours: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
			location: 'Edificio de Ingenierías, Piso 3, Oficina 301',
		},
		statusHistory: [
			{
				id: 'h8',
				status: 'PENDING',
				changedBy: 'Sistema',
				changedAt: '2024-10-21T13:30:00Z',
				comment: 'Solicitud creada',
			},
			{
				id: 'h9',
				status: 'IN_REVIEW',
				changedBy: 'Coordinación Sistemas',
				changedAt: '2024-10-21T16:45:00Z',
				comment: 'Solicitud en revisión inicial',
			},
			{
				id: 'h10',
				status: 'WAITING_INFO',
				changedBy: 'Coordinación Sistemas',
				changedAt: '2024-10-22T10:15:00Z',
				comment:
					'Necesitamos que adjuntes la carta de tu empleador certificando tu horario laboral para validar el conflicto de horarios mencionado.',
			},
		],
	},
];

// Función para obtener solicitudes (simula API)
const fetchStudentRequests = async (
	_studentId: string,
): Promise<StudentRequest[]> => {
	await new Promise((resolve) => setTimeout(resolve, 800));

	// Simula cambios aleatorios en el estado (para demostrar auto-actualización)
	return mockRequests.map((req) => {
		// 10% de probabilidad de cambiar estado PENDING a IN_REVIEW
		if (req.currentStatus === 'PENDING' && Math.random() > 0.9) {
			return {
				...req,
				currentStatus: 'IN_REVIEW' as const,
				statusHistory: [
					...req.statusHistory,
					{
						id: `h${Date.now()}`,
						status: 'IN_REVIEW' as const,
						changedBy: 'Decanatura',
						changedAt: new Date().toISOString(),
						comment: 'En revisión',
					},
				],
			};
		}
		return req;
	});
};

// Hook para auto-actualización de solicitudes
function useAutoRefreshRequests(studentId: string, intervalMinutes = 2) {
	const queryClient = useQueryClient();
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'visible') {
				startInterval();
			} else {
				stopInterval();
			}
		};

		const startInterval = () => {
			stopInterval();
			intervalRef.current = setInterval(
				() => {
					queryClient.invalidateQueries({
						queryKey: ['student-requests', studentId],
					});
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

		startInterval();
		document.addEventListener('visibilitychange', handleVisibilityChange);

		return () => {
			stopInterval();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [studentId, intervalMinutes, queryClient]);

	const manualRefresh = () => {
		queryClient.invalidateQueries({
			queryKey: ['student-requests', studentId],
		});
		setLastUpdated(new Date());
	};

	return { lastUpdated, manualRefresh };
}

// Componente para detectar y mostrar solicitudes con historial mínimo
function EmptyHistoryMessage({ request }: { request: StudentRequest }) {
	const hasMinimalHistory = request.statusHistory.length === 1;

	if (!hasMinimalHistory) return null;

	const creationDate = new Date(request.createdAt).toLocaleString('es-CO', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});

	return (
		<Alert color="primary" variant="flat" className="mt-3">
			<div className="space-y-2">
				<p className="font-medium text-sm">
					📋 Esta solicitud aún no ha tenido cambios de estado
				</p>
				<p className="text-xs text-default-600">
					Fue creada el <strong>{creationDate}</strong> y está en estado{' '}
					<strong className="text-warning-600">PENDIENTE</strong>
				</p>
				<p className="text-xs text-default-500 italic">
					El estado se actualizará automáticamente cuando el personal autorizado
					revise tu solicitud.
				</p>
			</div>
		</Alert>
	);
}

// Componente para vista detallada del estado actual de la solicitud
function RequestCurrentStatusView({
	request,
	onViewHistory,
}: {
	request: StudentRequest;
	onViewHistory?: () => void;
}) {
	const [copiedRadicado, setCopiedRadicado] = useState(false);

	// Función para copiar radicado al portapapeles
	const handleCopyRadicado = async () => {
		try {
			await navigator.clipboard.writeText(request.radicado);
			setCopiedRadicado(true);
			setTimeout(() => setCopiedRadicado(false), 2000);
		} catch (_err) {
			// Fallback para navegadores antiguos o móviles
			const textArea = document.createElement('textarea');
			textArea.value = request.radicado;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand('copy');
				setCopiedRadicado(true);
				setTimeout(() => setCopiedRadicado(false), 2000);
			} catch (e) {
				console.error('Error en fallback de copiar:', e);
			}
			document.body.removeChild(textArea);
		}
	};

	const getStatusColor = (
		status: string,
	): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
		switch (status) {
			case 'PENDING':
				return 'warning';
			case 'IN_REVIEW':
				return 'primary';
			case 'WAITING_INFO':
				return 'secondary';
			case 'APPROVED':
				return 'success';
			case 'REJECTED':
				return 'danger';
			case 'CANCELED':
				return 'default';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: string): string => {
		switch (status) {
			case 'PENDING':
				return 'Pendiente';
			case 'IN_REVIEW':
				return 'En Revisión';
			case 'WAITING_INFO':
				return 'Esperando Información';
			case 'APPROVED':
				return 'Aprobada';
			case 'REJECTED':
				return 'Rechazada';
			case 'CANCELED':
				return 'Cancelada';
			default:
				return status;
		}
	};

	const getStatusIcon = (status: string): string => {
		switch (status) {
			case 'PENDING':
				return '⏳';
			case 'IN_REVIEW':
				return '🔍';
			case 'WAITING_INFO':
				return '📝';
			case 'APPROVED':
				return '✅';
			case 'REJECTED':
				return '❌';
			case 'CANCELED':
				return '🚫';
			default:
				return '📋';
		}
	};

	const getPriorityColor = (
		priority?: string,
	): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
		switch (priority) {
			case 'HIGH':
				return 'danger';
			case 'MEDIUM':
				return 'warning';
			case 'LOW':
				return 'success';
			default:
				return 'default';
		}
	};

	const getPriorityLabel = (priority?: string): string => {
		switch (priority) {
			case 'HIGH':
				return '🔴 Alta';
			case 'MEDIUM':
				return '🟡 Media';
			case 'LOW':
				return '🟢 Baja';
			default:
				return 'No asignada';
		}
	};

	const getPriorityTooltip = (priority?: string): string => {
		switch (priority) {
			case 'HIGH':
				return 'Alta prioridad: Solicitudes urgentes que requieren atención inmediata (ej: cancelaciones cerca del límite de fecha, casos especiales)';
			case 'MEDIUM':
				return 'Prioridad media: Solicitudes importantes con tiempo razonable de respuesta (mayoría de casos)';
			case 'LOW':
				return 'Baja prioridad: Solicitudes informativas o con tiempo flexible de respuesta';
			default:
				return 'La prioridad se asigna automáticamente según el tipo de solicitud y el tiempo disponible para procesarla';
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('es-CO', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const lastUpdate =
		request.statusHistory[request.statusHistory.length - 1]?.changedAt ||
		request.createdAt;

	// ⚡ LÓGICA DE BOTONES SEGÚN ESTADO
	// Define qué acciones están disponibles para cada estado
	const actionsByStatus = {
		PENDING: {
			canApprove: true,
			canReject: true,
			canRequestInfo: true,
			canCancel: true,
			canProvideInfo: false,
			canDownload: false,
		},
		IN_REVIEW: {
			canApprove: true,
			canReject: true,
			canRequestInfo: true,
			canCancel: true,
			canProvideInfo: false,
			canDownload: false,
		},
		WAITING_INFO: {
			canApprove: true,
			canReject: true,
			canRequestInfo: false,
			canCancel: false,
			canProvideInfo: true,
			canDownload: false,
		},
		APPROVED: {
			canApprove: false,
			canReject: false,
			canRequestInfo: false,
			canCancel: false,
			canProvideInfo: false,
			canDownload: true,
		},
		REJECTED: {
			canApprove: false,
			canReject: false,
			canRequestInfo: false,
			canCancel: false,
			canProvideInfo: false,
			canDownload: false,
		},
		CANCELED: {
			canApprove: false,
			canReject: false,
			canRequestInfo: false,
			canCancel: false,
			canProvideInfo: false,
			canDownload: false,
		},
	};

	const currentActions =
		actionsByStatus[request.currentStatus as keyof typeof actionsByStatus] ||
		actionsByStatus.PENDING;

	const isFinalized =
		request.currentStatus === 'APPROVED' ||
		request.currentStatus === 'REJECTED' ||
		request.currentStatus === 'CANCELED';

	return (
		<div className="space-y-6">
			{/* Header con información clave */}
			<Card shadow="md" className="border-2 border-primary">
				<CardBody className="p-6">
					<div className="space-y-4">
						{/* Radicado prominente con botón de copiar */}
						<div className="flex items-start justify-between gap-4 flex-wrap">
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<span className="text-3xl">
										{getStatusIcon(request.currentStatus)}
									</span>
									<div>
										<p className="text-xs text-default-500 font-medium">
											RADICADO
										</p>
										<div className="flex items-center gap-2">
											<Tooltip
												content="Usa este número para consultar tu solicitud"
												placement="bottom"
											>
												<h1 className="text-2xl md:text-3xl font-bold text-primary font-mono cursor-help">
													{request.radicado}
												</h1>
											</Tooltip>
											<Tooltip
												content={
													copiedRadicado ? '¡Copiado!' : 'Copiar radicado'
												}
												placement="right"
												color={copiedRadicado ? 'success' : 'default'}
											>
												<Button
													isIconOnly
													size="sm"
													variant={copiedRadicado ? 'solid' : 'light'}
													color={copiedRadicado ? 'success' : 'default'}
													onPress={handleCopyRadicado}
													className="transition-all text-lg"
													aria-label="Copiar radicado"
												>
													{copiedRadicado ? '✓' : '📋'}
												</Button>
											</Tooltip>
										</div>
									</div>
								</div>
								<Chip
									size="lg"
									color={getStatusColor(request.currentStatus)}
									variant="flat"
									className="font-semibold"
								>
									{getStatusLabel(request.currentStatus)}
								</Chip>
							</div>{' '}
							{/* Prioridad */}
							{request.priority && (
								<div className="text-right">
									<p className="text-xs text-default-500 mb-1">PRIORIDAD</p>
									<Tooltip
										content={
											<div className="px-1 py-2 max-w-sm">
												<p className="text-xs font-bold mb-1">
													{getPriorityLabel(request.priority)}
												</p>
												<p className="text-xs">
													{getPriorityTooltip(request.priority)}
												</p>
											</div>
										}
										placement="left"
										color={getPriorityColor(request.priority)}
									>
										<Chip
											size="md"
											color={getPriorityColor(request.priority)}
											variant="bordered"
											className="cursor-help"
										>
											{getPriorityLabel(request.priority)}
										</Chip>
									</Tooltip>
								</div>
							)}
						</div>{' '}
						<Divider />
						{/* Fechas */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-xs text-default-500 font-medium mb-1">
									📅 Fecha de Creación
								</p>
								<p className="text-sm font-medium text-default-700">
									{formatDate(request.createdAt)}
								</p>
							</div>
							<div>
								<p className="text-xs text-default-500 font-medium mb-1">
									🔄 Última Actualización
								</p>
								<p className="text-sm font-medium text-default-700">
									{formatDate(lastUpdate)}
								</p>
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Detalles de la solicitud */}
			<Card shadow="sm">
				<CardHeader>
					<h3 className="text-lg font-semibold flex items-center gap-2">
						📋 Detalles de la Solicitud
					</h3>
				</CardHeader>
				<Divider />
				<CardBody className="space-y-4">
					{/* Tipo de solicitud */}
					<div>
						<p className="text-xs text-default-500 font-medium mb-1">
							Tipo de Solicitud
						</p>
						<p className="text-base font-semibold text-default-800">
							{request.type}
						</p>
					</div>

					{/* Descripción */}
					<div>
						<p className="text-xs text-default-500 font-medium mb-1">
							Descripción
						</p>
						<p className="text-sm text-default-700">{request.description}</p>
					</div>

					{/* De qué a qué (si aplica) */}
					{(request.fromSubject || request.toSubject) && (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{request.fromSubject && request.fromSubject !== 'N/A' && (
								<div>
									<p className="text-xs text-default-500 font-medium mb-1">
										📚 De
									</p>
									<p className="text-sm text-default-700 font-medium">
										{request.fromSubject}
									</p>
								</div>
							)}
							{request.toSubject && request.toSubject !== 'N/A' && (
								<div>
									<p className="text-xs text-default-500 font-medium mb-1">
										📚 A
									</p>
									<p className="text-sm text-default-700 font-medium">
										{request.toSubject}
									</p>
								</div>
							)}
						</div>
					)}

					{/* Observaciones del estudiante */}
					{request.studentObservations && (
						<div>
							<p className="text-xs text-default-500 font-medium mb-2">
								💭 Observaciones del Estudiante
							</p>
							<div className="bg-default-100 rounded-lg p-3">
								<p className="text-sm text-default-700 italic">
									"{request.studentObservations}"
								</p>
							</div>
						</div>
					)}
				</CardBody>
			</Card>

			{/* Información de Ruteo - Programa Asignado */}
			{request.assignedProgram && (
				<Card shadow="sm" className="border border-primary/30 bg-primary/5">
					<CardHeader>
						<div className="flex items-center gap-2">
							<h3 className="text-lg font-semibold flex items-center gap-2">
								🎯 Programa Asignado
							</h3>
							<Tooltip
								content={
									<div className="px-1 py-2 max-w-xs">
										<div className="text-xs font-bold mb-1">
											¿Por qué fue asignada aquí?
										</div>
										<div className="text-xs">
											{request.assignedProgram.reason}
										</div>
									</div>
								}
								placement="right"
								color="primary"
							>
								<Button
									isIconOnly
									size="sm"
									variant="light"
									className="min-w-6 w-6 h-6"
								>
									<span className="text-primary text-lg">ℹ️</span>
								</Button>
							</Tooltip>
						</div>
					</CardHeader>
					<Divider />
					<CardBody className="space-y-4">
						{/* Nombre del programa con tooltip */}
						<div>
							<div className="flex items-center gap-2 mb-2">
								<p className="text-sm font-semibold text-primary-600">
									{request.assignedProgram.name}
								</p>
								<Chip size="sm" variant="flat" color="primary">
									Responsable
								</Chip>
							</div>
							<Alert color="primary" variant="flat" className="text-xs">
								<p className="font-medium mb-1">📍 Razón de la asignación:</p>
								<p>{request.assignedProgram.reason}</p>
							</Alert>
						</div>

						<Divider />

						{/* Información de contacto completa */}
						<div>
							<p className="text-sm font-semibold text-default-700 mb-3">
								📞 Información de Contacto
							</p>
							<div className="space-y-3">
								{/* Email */}
								<div className="flex items-start gap-3">
									<span className="text-lg">📧</span>
									<div className="flex-1">
										<p className="text-xs text-default-500 mb-1">
											Correo Electrónico
										</p>
										<a
											href={`mailto:${request.assignedProgram.email}`}
											className="text-sm text-primary hover:underline font-medium"
										>
											{request.assignedProgram.email}
										</a>
									</div>
								</div>

								{/* Teléfono */}
								<div className="flex items-start gap-3">
									<span className="text-lg">📱</span>
									<div className="flex-1">
										<p className="text-xs text-default-500 mb-1">Teléfono</p>
										<a
											href={`tel:${request.assignedProgram.phone.replace(/[^0-9+]/g, '')}`}
											className="text-sm text-primary hover:underline font-medium"
										>
											{request.assignedProgram.phone}
										</a>
									</div>
								</div>

								{/* Horarios de atención */}
								<div className="flex items-start gap-3">
									<span className="text-lg">🕒</span>
									<div className="flex-1">
										<p className="text-xs text-default-500 mb-1">
											Horarios de Atención
										</p>
										<p className="text-sm text-default-700 font-medium">
											{request.assignedProgram.officeHours}
										</p>
									</div>
								</div>

								{/* Ubicación física */}
								{request.assignedProgram.location && (
									<div className="flex items-start gap-3">
										<span className="text-lg">📍</span>
										<div className="flex-1">
											<p className="text-xs text-default-500 mb-1">
												Ubicación Física
											</p>
											<p className="text-sm text-default-700 font-medium">
												{request.assignedProgram.location}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Mensaje informativo */}
						<Alert color="default" variant="bordered" className="text-xs">
							💡 Si tienes preguntas sobre tu solicitud, puedes contactar
							directamente a {request.assignedProgram.name} usando cualquiera de
							los medios de contacto anteriores durante los horarios de
							atención.
						</Alert>
					</CardBody>
				</Card>
			)}

			{/* Acciones disponibles */}
			<Card shadow="sm" className="border border-primary/20">
				<CardHeader>
					<h3 className="text-lg font-semibold flex items-center gap-2">
						⚡ Acciones Disponibles
					</h3>
				</CardHeader>
				<Divider />
				<CardBody className="space-y-4">
					{/* Botones de acción según estado */}
					<div className="flex flex-wrap gap-3">
						{/* Botón Aprobar - Solo para administradores/revisores */}
						{currentActions.canApprove ? (
							<Tooltip
								content="Aprobar la solicitud después de revisión"
								placement="top"
							>
								<Button color="success" variant="solid" size="md">
									✅ Aprobar
								</Button>
							</Tooltip>
						) : (
							<Tooltip
								content={`No disponible en estado ${getStatusLabel(request.currentStatus)}`}
								placement="top"
								color="danger"
							>
								<Button color="success" variant="bordered" size="md" isDisabled>
									✅ Aprobar
								</Button>
							</Tooltip>
						)}

						{/* Botón Rechazar - Solo para administradores/revisores */}
						{currentActions.canReject ? (
							<Tooltip
								content="Rechazar la solicitud con comentarios"
								placement="top"
							>
								<Button color="danger" variant="solid" size="md">
									❌ Rechazar
								</Button>
							</Tooltip>
						) : (
							<Tooltip
								content={`No disponible en estado ${getStatusLabel(request.currentStatus)}`}
								placement="top"
								color="danger"
							>
								<Button color="danger" variant="bordered" size="md" isDisabled>
									❌ Rechazar
								</Button>
							</Tooltip>
						)}

						{/* Botón Solicitar Información */}
						{currentActions.canRequestInfo ? (
							<Tooltip
								content="Solicitar información adicional al estudiante"
								placement="top"
							>
								<Button color="warning" variant="bordered" size="md">
									� Solicitar Información
								</Button>
							</Tooltip>
						) : (
							!currentActions.canProvideInfo && (
								<Tooltip
									content={
										isFinalized
											? 'La solicitud ya está finalizada'
											: request.currentStatus === 'WAITING_INFO'
												? 'Ya se solicitó información, esperando respuesta'
												: 'Esta acción no está disponible'
									}
									placement="top"
									color="warning"
								>
									<Button
										color="warning"
										variant="bordered"
										size="md"
										isDisabled
									>
										📝 Solicitar Información
									</Button>
								</Tooltip>
							)
						)}

						{/* Botón Proporcionar Información - Solo para estudiantes */}
						{currentActions.canProvideInfo && (
							<Tooltip
								content="Proporcionar la información solicitada"
								placement="top"
							>
								<Button color="primary" variant="solid" size="md">
									📎 Proporcionar Información
								</Button>
							</Tooltip>
						)}

						{/* Botón Cancelar Solicitud */}
						{currentActions.canCancel ? (
							<Tooltip
								content="Cancelar esta solicitud permanentemente"
								placement="top"
							>
								<Button color="danger" variant="light" size="md">
									🚫 Cancelar Solicitud
								</Button>
							</Tooltip>
						) : (
							isFinalized && (
								<Tooltip
									content="No se puede cancelar una solicitud finalizada"
									placement="top"
									color="danger"
								>
									<Button color="danger" variant="light" size="md" isDisabled>
										🚫 Cancelar Solicitud
									</Button>
								</Tooltip>
							)
						)}

						{/* Botón Ver Historial Completo */}
						{onViewHistory && (
							<Button
								color="primary"
								variant="flat"
								size="md"
								onPress={onViewHistory}
							>
								📜 Ver Historial Completo
							</Button>
						)}

						{/* Botón Descargar Comprobante */}
						{currentActions.canDownload ? (
							<Tooltip
								content="Descargar comprobante de aprobación"
								placement="top"
							>
								<Button color="default" variant="solid" size="md">
									📥 Descargar Comprobante
								</Button>
							</Tooltip>
						) : (
							<Tooltip
								content="El comprobante estará disponible cuando la solicitud sea aprobada"
								placement="top"
								color="warning"
							>
								<Button color="default" variant="light" size="md" isDisabled>
									📥 Descargar Comprobante
								</Button>
							</Tooltip>
						)}
					</div>

					{/* Información de contacto */}
					{(request.contactEmail || request.contactPhone) && (
						<>
							<Divider />
							<div>
								<p className="text-sm font-semibold text-default-700 mb-3">
									📞 ¿Necesitas más información?
								</p>
								<div className="space-y-2">
									{request.contactEmail && (
										<div className="flex items-center gap-2 text-sm">
											<span className="text-default-500">📧 Email:</span>
											<a
												href={`mailto:${request.contactEmail}`}
												className="text-primary hover:underline"
											>
												{request.contactEmail}
											</a>
										</div>
									)}
									{request.contactPhone && (
										<div className="flex items-center gap-2 text-sm">
											<span className="text-default-500">📱 Teléfono:</span>
											<a
												href={`tel:${request.contactPhone}`}
												className="text-primary hover:underline"
											>
												{request.contactPhone}
											</a>
										</div>
									)}
								</div>
							</div>
						</>
					)}

					{/* Mensajes según estado */}
					{request.currentStatus === 'PENDING' && (
						<Alert color="warning" variant="flat">
							<p className="text-xs">
								⏳ Tu solicitud está pendiente de revisión. Normalmente este
								proceso toma entre 2-3 días hábiles.
							</p>
						</Alert>
					)}

					{request.currentStatus === 'IN_REVIEW' && (
						<Alert color="primary" variant="flat">
							<p className="text-xs">
								🔍 Tu solicitud está siendo revisada por el personal
								correspondiente. Te notificaremos cualquier actualización.
							</p>
						</Alert>
					)}

					{request.currentStatus === 'WAITING_INFO' && (
						<Alert color="secondary" variant="flat">
							<p className="text-xs">
								📝 Se ha solicitado información adicional para procesar tu
								solicitud. Por favor, proporciona los datos requeridos usando el
								botón de arriba para que podamos continuar con la revisión.
							</p>
						</Alert>
					)}

					{request.currentStatus === 'APPROVED' && (
						<Alert color="success" variant="flat">
							<p className="text-xs">
								✅ ¡Felicitaciones! Tu solicitud ha sido aprobada. Puedes
								descargar el comprobante usando el botón de arriba.
							</p>
						</Alert>
					)}

					{request.currentStatus === 'REJECTED' && (
						<Alert color="danger" variant="flat">
							<p className="text-xs">
								❌ Tu solicitud ha sido rechazada. Revisa los comentarios en el
								historial para conocer las razones. Si tienes dudas, contacta al
								responsable.
							</p>
						</Alert>
					)}

					{request.currentStatus === 'CANCELED' && (
						<Alert color="default" variant="flat">
							<p className="text-xs">
								🚫 Esta solicitud ha sido cancelada. Si necesitas realizar el
								mismo trámite, deberás crear una nueva solicitud.
							</p>
						</Alert>
					)}
				</CardBody>
			</Card>
		</div>
	);
}

// Componente para mostrar el historial de estados (Vista detallada expandible)
function RequestStatusHistoryView({ request }: { request: StudentRequest }) {
	const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

	const getStatusColor = (
		status: string,
	): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
		switch (status) {
			case 'PENDING':
				return 'warning';
			case 'IN_REVIEW':
				return 'primary';
			case 'WAITING_INFO':
				return 'secondary';
			case 'APPROVED':
				return 'success';
			case 'REJECTED':
				return 'danger';
			case 'CANCELED':
				return 'default';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: string): string => {
		switch (status) {
			case 'PENDING':
				return 'Pendiente';
			case 'IN_REVIEW':
				return 'En Revisión';
			case 'WAITING_INFO':
				return 'Esperando Información';
			case 'APPROVED':
				return 'Aprobada';
			case 'REJECTED':
				return 'Rechazada';
			case 'CANCELED':
				return 'Cancelada';
			default:
				return status;
		}
	};

	const getStatusIcon = (status: string): string => {
		switch (status) {
			case 'PENDING':
				return '⏳';
			case 'IN_REVIEW':
				return '🔍';
			case 'WAITING_INFO':
				return '📝';
			case 'APPROVED':
				return '✅';
			case 'REJECTED':
				return '❌';
			case 'CANCELED':
				return '🚫';
			default:
				return '📋';
		}
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleString('es-CO', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const formatDateDetailed = (dateString: string) => {
		return new Date(dateString).toLocaleString('es-CO', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	};

	const toggleExpanded = (itemId: string) => {
		setExpandedItems((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(itemId)) {
				newSet.delete(itemId);
			} else {
				newSet.add(itemId);
			}
			return newSet;
		});
	};

	// Función para calcular tiempo transcurrido entre dos fechas
	const getTimeDifference = (startDate: string, endDate: string): string => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		const diffMs = end.getTime() - start.getTime();

		const diffMinutes = Math.floor(diffMs / (1000 * 60));
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays > 0) {
			return `${diffDays} día${diffDays !== 1 ? 's' : ''}`;
		}
		if (diffHours > 0) {
			return `${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
		}
		if (diffMinutes > 0) {
			return `${diffMinutes} minuto${diffMinutes !== 1 ? 's' : ''}`;
		}
		return 'menos de 1 minuto';
	};

	// ⭐ ORDEN CRONOLÓGICO: Más reciente primero
	const sortedHistory = [...request.statusHistory].reverse();

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h4 className="text-sm font-semibold text-default-700 flex items-center gap-2">
					📜 Historial de Estados
					<Chip size="sm" variant="flat" color="default">
						{sortedHistory.length} cambio{sortedHistory.length !== 1 ? 's' : ''}
					</Chip>
				</h4>
				<p className="text-xs text-default-400">
					{sortedHistory.length > 1 ? 'Más reciente primero' : ''}
				</p>
			</div>

			{/* Resumen visual del timeline */}
			{sortedHistory.length > 1 && (
				<Card
					shadow="sm"
					className="bg-gradient-to-r from-primary/5 to-secondary/5"
				>
					<CardBody className="p-3">
						<div className="flex items-center justify-between gap-2 flex-wrap">
							<div className="text-xs text-default-600">
								<span className="font-semibold">📊 Resumen del Timeline:</span>{' '}
								La solicitud ha pasado por {sortedHistory.length} estados
							</div>
							<div className="flex items-center gap-1">
								{sortedHistory
									.slice()
									.reverse()
									.map((item, idx) => (
										<Tooltip
											key={item.id}
											content={`${getStatusLabel(item.status)} - ${formatDate(item.changedAt)}`}
											size="sm"
										>
											<div
												className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 border-white ${
													idx === sortedHistory.length - 1
														? 'bg-primary shadow-md scale-110'
														: 'bg-default-200 opacity-60'
												}`}
											>
												{getStatusIcon(item.status)}
											</div>
										</Tooltip>
									))}
							</div>
						</div>
					</CardBody>
				</Card>
			)}

			{/* Detectar historial mínimo */}
			<EmptyHistoryMessage request={request} />

			{/* Historial de asignación de radicado y prioridad */}
			<div className="mb-6 space-y-3">
				<h4 className="text-sm font-semibold text-default-700">
					📋 Metadata de la Solicitud
				</h4>

				{/* Radicado asignado */}
				<Card className="shadow-sm border-l-4 border-l-primary">
					<CardBody className="py-3 px-4">
						<div className="flex items-start gap-3">
							<div className="text-2xl">📋</div>
							<div className="flex-1">
								<div className="text-sm font-semibold text-default-700">
									Radicado asignado
								</div>
								<div className="text-sm text-default-600 mt-1">
									<span className="font-mono font-semibold">
										{request.radicado}
									</span>{' '}
									asignado el {formatDateDetailed(request.createdAt)}
								</div>
								<div className="text-xs text-default-400 mt-1">
									El radicado es el identificador único de esta solicitud
								</div>
							</div>
						</div>
					</CardBody>
				</Card>

				{/* Prioridad calculada */}
				{request.priority && (
					<Card className="shadow-sm border-l-4 border-l-warning">
						<CardBody className="py-3 px-4">
							<div className="flex items-start gap-3">
								<div className="text-2xl">🎯</div>
								<div className="flex-1">
									<div className="text-sm font-semibold text-default-700">
										Prioridad calculada
									</div>
									<div className="text-sm text-default-600 mt-1 flex items-center gap-2">
										<span>Prioridad:</span>
										<Chip
											color={
												request.priority === 'HIGH'
													? 'danger'
													: request.priority === 'MEDIUM'
														? 'warning'
														: 'success'
											}
											size="sm"
											variant="flat"
										>
											{request.priority === 'HIGH'
												? '🔴 Alta'
												: request.priority === 'MEDIUM'
													? '🟡 Media'
													: '🟢 Baja'}
										</Chip>
										<span className="text-xs">
											el {formatDateDetailed(request.createdAt)}
										</span>
									</div>
									<div className="text-xs text-default-400 mt-1">
										{request.priority === 'HIGH'
											? 'Alta prioridad: requiere atención inmediata'
											: request.priority === 'MEDIUM'
												? 'Prioridad media: atención en orden normal'
												: 'Baja prioridad: puede procesarse con mayor flexibilidad'}
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				)}
			</div>

			<Divider className="my-6" />

			{/* Timeline de estados - ORDEN CRONOLÓGICO INVERSO */}
			<div className="space-y-4 pl-4 border-l-2 border-primary/40">
				{sortedHistory.map((historyItem, index) => {
					const isExpanded = expandedItems.has(historyItem.id);
					const isLatest = index === 0;
					const hasComment = Boolean(historyItem.comment);
					const previousItem =
						index < sortedHistory.length - 1 ? sortedHistory[index + 1] : null;
					const timeDiff = previousItem
						? getTimeDifference(previousItem.changedAt, historyItem.changedAt)
						: null;

					return (
						<div key={historyItem.id} className="relative pl-6">
							{/* Tiempo transcurrido desde el estado anterior */}
							{timeDiff && (
								<div className="absolute -left-[60px] top-0 text-xs text-default-400 italic w-12 text-right">
									+{timeDiff}
								</div>
							)}

							{/* Punto en la línea de tiempo con icono */}
							<div
								className={`absolute -left-[13px] top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs transition-all ${
									isLatest
										? 'bg-primary shadow-lg scale-110 animate-pulse'
										: 'bg-default-300 shadow-sm opacity-70'
								}`}
								title={isLatest ? 'Estado actual' : 'Estado anterior'}
							>
								{getStatusIcon(historyItem.status)}
							</div>

							{/* Card con información del cambio */}
							<Card
								shadow="sm"
								className={`transition-all ${
									isLatest
										? 'border-2 border-primary shadow-md opacity-100'
										: 'opacity-75 hover:opacity-100'
								}`}
							>
								<CardBody className="p-3 space-y-2">
									{/* Cabecera del estado */}
									<div className="flex items-start justify-between gap-2">
										<div className="flex items-center gap-2 flex-wrap">
											<Chip
												size="sm"
												color={getStatusColor(historyItem.status)}
												variant="flat"
												className="font-medium"
											>
												{getStatusLabel(historyItem.status)}
											</Chip>
											{isLatest && (
												<Chip
													size="sm"
													color="primary"
													variant="dot"
													className="animate-pulse"
												>
													Estado Actual
												</Chip>
											)}
										</div>
										<span className="text-xs text-default-400 whitespace-nowrap">
											{formatDate(historyItem.changedAt)}
										</span>
									</div>

									{/* Actor del cambio */}
									<div className="flex items-center gap-2 text-xs">
										<span className="text-default-500">👤 Modificado por:</span>
										<span className="font-medium text-default-700">
											{historyItem.changedBy}
										</span>
									</div>

									{/* Comentario (si existe) */}
									{historyItem.comment && (
										<div className="bg-default-100 rounded-lg p-2">
											<p className="text-xs text-default-700 italic">
												💬 "{historyItem.comment}"
											</p>
										</div>
									)}

									{/* Tiempo transcurrido desde estado anterior */}
									{timeDiff && (
										<div className="flex items-center gap-2 text-xs text-default-500 bg-default-50 rounded px-2 py-1">
											<span>⏱️</span>
											<span>
												Transcurrieron <strong>{timeDiff}</strong> desde el
												estado anterior
											</span>
										</div>
									)}

									{/* Botón para expandir detalles */}
									<Button
										size="sm"
										variant="light"
										className="w-full mt-1"
										onPress={() => toggleExpanded(historyItem.id)}
										endContent={
											<span className="text-default-400">
												{isExpanded ? '▲' : '▼'}
											</span>
										}
									>
										<span className="text-xs">
											{isExpanded ? 'Ocultar detalles' : 'Ver más detalles'}
										</span>
									</Button>

									{/* Detalles expandibles */}
									{isExpanded && (
										<div className="mt-3 pt-3 border-t border-default-200 space-y-3">
											<div className="grid grid-cols-2 gap-3 text-xs">
												<div>
													<p className="text-default-500 font-medium">
														🆔 ID de cambio:
													</p>
													<p className="font-mono text-default-700">
														{historyItem.id}
													</p>
												</div>
												<div>
													<p className="text-default-500 font-medium">
														📅 Fecha completa:
													</p>
													<p className="text-default-700">
														{formatDateDetailed(historyItem.changedAt)}
													</p>
												</div>
											</div>

											{/* Tiempo transcurrido detallado */}
											{timeDiff && (
												<div className="bg-primary/5 border border-primary/20 rounded-lg p-2">
													<p className="text-xs text-default-600">
														<strong>⏱️ Duración del estado anterior:</strong>{' '}
														{timeDiff}
													</p>
												</div>
											)}

											<div className="bg-default-50 rounded-lg p-2">
												<p className="text-xs text-default-600">
													<strong>📝 Contexto:</strong>{' '}
													{hasComment
														? 'Este cambio incluye comentarios del responsable que explican la razón de la transición.'
														: 'Este cambio fue registrado automáticamente por el sistema.'}
												</p>
											</div>

											{/* Indicador de posición en el historial */}
											<div className="flex items-center justify-between text-xs">
												<div className="flex items-center gap-2 text-default-500">
													<span>📍</span>
													<span>
														Cambio #{sortedHistory.length - index} de{' '}
														{sortedHistory.length}
													</span>
												</div>
												{isLatest && (
													<Chip size="sm" color="primary" variant="flat">
														Último cambio
													</Chip>
												)}
											</div>

											{/* Estadísticas del timeline */}
											{isLatest && (
												<div className="bg-success/5 border border-success/20 rounded-lg p-2">
													<p className="text-xs text-success-700">
														✨ <strong>Estado actual alcanzado:</strong>{' '}
														{new Date(historyItem.changedAt).toLocaleDateString(
															'es-CO',
															{
																day: 'numeric',
																month: 'long',
																year: 'numeric',
															},
														)}
													</p>
												</div>
											)}
										</div>
									)}
								</CardBody>
							</Card>
						</div>
					);
				})}
			</div>
		</div>
	);
}

// Componente para mostrar radicado con funcionalidad de copiado
function RadicadoCell({ radicado }: { radicado: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async (e: React.MouseEvent) => {
		e.stopPropagation(); // Evita que se expanda el accordion
		try {
			await navigator.clipboard.writeText(radicado);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (_err) {
			// Fallback para navegadores antiguos o móviles
			const textArea = document.createElement('textarea');
			textArea.value = radicado;
			textArea.style.position = 'fixed';
			textArea.style.left = '-999999px';
			document.body.appendChild(textArea);
			textArea.select();
			try {
				document.execCommand('copy');
				setCopied(true);
				setTimeout(() => setCopied(false), 2000);
			} catch (e) {
				console.error('Error al copiar:', e);
			}
			document.body.removeChild(textArea);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Tooltip
				content="Usa este número para consultar tu solicitud"
				placement="top"
			>
				<span className="font-mono text-xs font-semibold cursor-help">
					{radicado}
				</span>
			</Tooltip>
			<Tooltip
				content={copied ? '¡Copiado!' : 'Copiar'}
				placement="right"
				color={copied ? 'success' : 'default'}
			>
				<button
					type="button"
					onClick={handleCopy}
					className={`p-1 rounded transition-all text-sm ${
						copied
							? 'bg-success text-white'
							: 'hover:bg-default-100 text-default-400 hover:text-default-600'
					}`}
					aria-label="Copiar radicado"
				>
					{copied ? '✓' : '📋'}
				</button>
			</Tooltip>
		</div>
	);
}

// Componente para mostrar prioridad con tooltip explicativo
function PriorityCell({ priority }: { priority?: string }) {
	const getPriorityColor = (
		p?: string,
	): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
		switch (p) {
			case 'HIGH':
				return 'danger';
			case 'MEDIUM':
				return 'warning';
			case 'LOW':
				return 'success';
			default:
				return 'default';
		}
	};

	const getPriorityLabel = (p?: string): string => {
		switch (p) {
			case 'HIGH':
				return '🔴 Alta';
			case 'MEDIUM':
				return '🟡 Media';
			case 'LOW':
				return '🟢 Baja';
			default:
				return 'Sin asignar';
		}
	};

	const getPriorityTooltip = (p?: string): string => {
		switch (p) {
			case 'HIGH':
				return 'Alta prioridad: Solicitudes urgentes que requieren atención inmediata (ej: cancelaciones cerca del límite de fecha, casos especiales)';
			case 'MEDIUM':
				return 'Prioridad media: Solicitudes importantes con tiempo razonable de respuesta (mayoría de casos)';
			case 'LOW':
				return 'Baja prioridad: Solicitudes informativas o con tiempo flexible de respuesta';
			default:
				return 'La prioridad se asigna automáticamente según el tipo de solicitud y el tiempo disponible para procesarla';
		}
	};

	if (!priority) {
		return (
			<Tooltip content={getPriorityTooltip()} placement="top">
				<Chip size="sm" variant="flat" color="default" className="cursor-help">
					{getPriorityLabel()}
				</Chip>
			</Tooltip>
		);
	}

	return (
		<Tooltip
			content={
				<div className="px-1 py-2 max-w-xs">
					<p className="text-xs font-bold mb-1">{getPriorityLabel(priority)}</p>
					<p className="text-xs">{getPriorityTooltip(priority)}</p>
				</div>
			}
			placement="top"
			color={getPriorityColor(priority)}
		>
			<Chip
				size="sm"
				variant="flat"
				color={getPriorityColor(priority)}
				className="cursor-help"
			>
				{getPriorityLabel(priority)}
			</Chip>
		</Tooltip>
	);
}

// Componente principal
export function StudentRequests({
	studentId = '1234567890',
}: {
	studentId?: string;
}) {
	// Estados para modales
	const {
		isOpen: isDetailsOpen,
		onOpen: onDetailsOpen,
		onClose: onDetailsClose,
	} = useDisclosure();
	const {
		isOpen: isHistoryOpen,
		onOpen: onHistoryOpen,
		onClose: onHistoryClose,
	} = useDisclosure();
	const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(
		null,
	);

	const {
		data: requests,
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['student-requests', studentId],
		queryFn: () => fetchStudentRequests(studentId),
		refetchInterval: 2 * 60 * 1000, // Auto-refresh cada 2 minutos
	});

	const { lastUpdated, manualRefresh } = useAutoRefreshRequests(studentId, 2);

	const getStatusColor = (
		status: string,
	): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
		switch (status) {
			case 'PENDING':
				return 'warning';
			case 'IN_REVIEW':
				return 'primary';
			case 'WAITING_INFO':
				return 'secondary';
			case 'APPROVED':
				return 'success';
			case 'REJECTED':
				return 'danger';
			case 'CANCELED':
				return 'default';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: string): string => {
		switch (status) {
			case 'PENDING':
				return 'Pendiente';
			case 'IN_REVIEW':
				return 'En Revisión';
			case 'WAITING_INFO':
				return 'Esperando Información';
			case 'APPROVED':
				return 'Aprobada';
			case 'REJECTED':
				return 'Rechazada';
			case 'CANCELED':
				return 'Cancelada';
			default:
				return status;
		}
	};

	if (error) {
		return (
			<Alert color="danger" title="Error al cargar solicitudes">
				No se pudieron cargar tus solicitudes. Por favor, intenta nuevamente.
				<Button
					size="sm"
					color="danger"
					variant="bordered"
					className="mt-2"
					onPress={() => refetch()}
				>
					Reintentar
				</Button>
			</Alert>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header con auto-refresh */}
			<Card shadow="sm" radius="sm">
				<CardHeader className="flex justify-between items-center">
					<div>
						<h2 className="text-lg font-semibold">Mis Solicitudes</h2>
						<p className="text-xs text-default-500">
							Historial completo de tus solicitudes académicas
						</p>
					</div>
					<div className="flex items-center gap-3">
						<Tooltip content="Actualización automática cada 2 minutos">
							<div className="flex items-center gap-1 text-xs text-default-400">
								<span className="w-2 h-2 rounded-full bg-success animate-pulse" />
								Auto-refresh
							</div>
						</Tooltip>
						<Button
							size="sm"
							variant="light"
							onPress={manualRefresh}
							isLoading={isLoading}
							startContent={
								!isLoading && (
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-label="Icono de actualizar"
									>
										<title>Actualizar</title>
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
				</CardHeader>
			</Card>

			{/* Información de última actualización */}
			<div className="flex justify-between items-center px-1">
				<p className="text-xs text-default-500">
					Última actualización: {lastUpdated.toLocaleTimeString('es-CO')}
				</p>
				{requests && (
					<p className="text-xs text-default-500">
						{requests.length} solicitud{requests.length !== 1 ? 'es' : ''} en
						total
					</p>
				)}
			</div>

			{/* Tabla de solicitudes */}
			{isLoading ? (
				<Card>
					<CardBody className="flex items-center justify-center py-12">
						<Spinner size="lg" />
						<p className="text-sm text-default-500 mt-4">
							Cargando tus solicitudes...
						</p>
					</CardBody>
				</Card>
			) : requests && requests.length > 0 ? (
				<Table aria-label="Tabla de solicitudes del estudiante">
					<TableHeader>
						<TableColumn>RADICADO</TableColumn>
						<TableColumn>TIPO</TableColumn>
						<TableColumn>DESCRIPCIÓN</TableColumn>
						<TableColumn>FECHA CREACIÓN</TableColumn>
						<TableColumn>PROGRAMA ASIGNADO</TableColumn>
						<TableColumn>PRIORIDAD</TableColumn>
						<TableColumn>ESTADO ACTUAL</TableColumn>
						<TableColumn>ACCIONES</TableColumn>
					</TableHeader>
					<TableBody>
						{requests.map((request) => (
							<TableRow key={request.id}>
								<TableCell>
									<RadicadoCell radicado={request.radicado} />
								</TableCell>
								<TableCell className="font-medium">{request.type}</TableCell>
								<TableCell className="max-w-xs truncate">
									{request.description}
								</TableCell>
								<TableCell className="text-sm">
									{new Date(request.createdAt).toLocaleDateString('es-CO')}
								</TableCell>
								<TableCell>
									<PriorityCell priority={request.priority} />
								</TableCell>
								<TableCell>
									{request.assignedProgram ? (
										<Tooltip
											content={
												<div className="px-1 py-2 max-w-sm">
													<div className="text-xs font-bold mb-2">
														🎯 {request.assignedProgram.name}
													</div>
													<div className="text-xs mb-2">
														{request.assignedProgram.reason}
													</div>
													<Divider className="my-2" />
													<div className="text-xs space-y-1">
														<p>📧 {request.assignedProgram.email}</p>
														<p>📱 {request.assignedProgram.phone}</p>
													</div>
												</div>
											}
											placement="left"
											color="primary"
										>
											<Chip
												size="sm"
												variant="flat"
												color="primary"
												className="cursor-help"
											>
												{request.assignedProgram.name}
											</Chip>
										</Tooltip>
									) : (
										<Chip size="sm" variant="flat" color="default">
											Sin asignar
										</Chip>
									)}
								</TableCell>
								<TableCell>
									<Chip
										color={getStatusColor(request.currentStatus)}
										variant="flat"
										size="sm"
									>
										{getStatusLabel(request.currentStatus)}
									</Chip>
								</TableCell>
								<TableCell>
									<div className="flex gap-2">
										<Tooltip content="Ver detalles">
											<Button
												size="sm"
												variant="flat"
												color="primary"
												isIconOnly
												onPress={() => {
													setSelectedRequest(request);
													onDetailsOpen();
												}}
											>
												👁️
											</Button>
										</Tooltip>
										<Tooltip content="Ver historial">
											<Button
												size="sm"
												variant="flat"
												color="secondary"
												isIconOnly
												onPress={() => {
													setSelectedRequest(request);
													onHistoryOpen();
												}}
											>
												📜
											</Button>
										</Tooltip>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			) : (
				<Card>
					<CardBody className="text-center py-12">
						<p className="text-default-500">
							No tienes solicitudes registradas
						</p>
						<p className="text-xs text-default-400 mt-2">
							Puedes crear una nueva solicitud desde el menú lateral
						</p>
					</CardBody>
				</Card>
			)}

			{/* Leyenda de estados */}
			<Card shadow="sm">
				<CardHeader>
					<h3 className="text-sm font-semibold">Información sobre Estados</h3>
				</CardHeader>
				<Divider />
				<CardBody className="space-y-2">
					<div className="flex items-center gap-2">
						<Chip color="warning" variant="flat" size="sm">
							Pendiente
						</Chip>
						<p className="text-xs text-default-600">
							Solicitud creada, esperando revisión inicial
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Chip color="primary" variant="flat" size="sm">
							En Revisión
						</Chip>
						<p className="text-xs text-default-600">
							En proceso de evaluación por el personal autorizado
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Chip color="success" variant="flat" size="sm">
							Aprobada
						</Chip>
						<p className="text-xs text-default-600">
							Solicitud aprobada satisfactoriamente
						</p>
					</div>
					<div className="flex items-center gap-2">
						<Chip color="danger" variant="flat" size="sm">
							Rechazada
						</Chip>
						<p className="text-xs text-default-600">
							Solicitud no aprobada (ver comentarios)
						</p>
					</div>
				</CardBody>
			</Card>

			{/* Modal de Detalles */}
			<Modal
				isOpen={isDetailsOpen}
				onClose={onDetailsClose}
				size="3xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<span>👁️</span>
							<span>Detalles de la Solicitud</span>
						</div>
						{selectedRequest && (
							<p className="text-sm font-normal text-default-500">
								{selectedRequest.radicado} - {selectedRequest.description}
							</p>
						)}
					</ModalHeader>
					<ModalBody>
						{selectedRequest && (
							<RequestCurrentStatusView request={selectedRequest} />
						)}
					</ModalBody>
				</ModalContent>
			</Modal>

			{/* Modal de Historial */}
			<Modal
				isOpen={isHistoryOpen}
				onClose={onHistoryClose}
				size="3xl"
				scrollBehavior="inside"
			>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<div className="flex items-center gap-2">
							<span>📜</span>
							<span>Historial de Estados</span>
						</div>
						{selectedRequest && (
							<p className="text-sm font-normal text-default-500">
								{selectedRequest.radicado} - {selectedRequest.description}
							</p>
						)}
					</ModalHeader>
					<ModalBody>
						{selectedRequest && (
							<RequestStatusHistoryView request={selectedRequest} />
						)}
					</ModalBody>
				</ModalContent>
			</Modal>
		</div>
	);
}
