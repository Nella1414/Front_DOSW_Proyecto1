import {
	Accordion,
	AccordionItem,
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
} from '@heroui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

// Tipos de datos para solicitudes
export interface RequestStatusHistory {
	id: string;
	status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELED';
	changedBy: string;
	changedAt: string;
	comment?: string;
}

export interface StudentRequest {
	id: string;
	radicado: string;
	type: string;
	description: string;
	createdAt: string;
	currentStatus: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELED';
	statusHistory: RequestStatusHistory[];
	studentId: string;
	// Nuevos campos para detalles de la solicitud
	fromSubject?: string; // De qué materia/grupo
	toSubject?: string; // A qué materia/grupo
	studentObservations?: string; // Observaciones del estudiante
	priority?: 'LOW' | 'MEDIUM' | 'HIGH'; // Prioridad asignada
	contactEmail?: string; // Email de contacto
	contactPhone?: string; // Teléfono de contacto
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
		statusHistory: [
			{
				id: 'h7',
				status: 'PENDING',
				changedBy: 'Sistema',
				changedAt: '2024-10-22T09:00:00Z',
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
	const getStatusColor = (
		status: string,
	): 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
		switch (status) {
			case 'PENDING':
				return 'warning';
			case 'IN_REVIEW':
				return 'primary';
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

	// Determinar acciones disponibles según el estado
	const canCancel =
		request.currentStatus === 'PENDING' ||
		request.currentStatus === 'IN_REVIEW';
	const canProvideInfo =
		request.currentStatus === 'IN_REVIEW' ||
		request.currentStatus === 'REJECTED';
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
						{/* Radicado prominente y estado */}
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
										<h1 className="text-2xl md:text-3xl font-bold text-primary font-mono">
											{request.radicado}
										</h1>
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
							</div>

							{/* Prioridad */}
							{request.priority && (
								<div className="text-right">
									<p className="text-xs text-default-500 mb-1">PRIORIDAD</p>
									<Chip
										size="md"
										color={getPriorityColor(request.priority)}
										variant="bordered"
									>
										{getPriorityLabel(request.priority)}
									</Chip>
								</div>
							)}
						</div>

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
						{canCancel && (
							<Button color="danger" variant="bordered" size="md">
								🚫 Cancelar Solicitud
							</Button>
						)}

						{canProvideInfo && (
							<Button color="primary" variant="solid" size="md">
								📎 Proporcionar Información
							</Button>
						)}

						{isFinalized && (
							<Button color="success" variant="bordered" size="md" isDisabled>
								✅ Solicitud Finalizada
							</Button>
						)}

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

						<Button color="default" variant="light" size="md">
							📥 Descargar Comprobante
						</Button>
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

			{/* Detectar historial mínimo */}
			<EmptyHistoryMessage request={request} />

			{/* Timeline de estados - ORDEN CRONOLÓGICO INVERSO */}
			<div className="space-y-4 pl-4 border-l-2 border-default-200">
				{sortedHistory.map((historyItem, index) => {
					const isExpanded = expandedItems.has(historyItem.id);
					const isLatest = index === 0;
					const hasComment = Boolean(historyItem.comment);

					return (
						<div key={historyItem.id} className="relative pl-6">
							{/* Punto en la línea de tiempo con icono */}
							<div
								className={`absolute -left-[13px] top-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs ${
									isLatest ? 'bg-primary shadow-md' : 'bg-default-300 shadow-sm'
								}`}
								title={isLatest ? 'Estado actual' : 'Estado anterior'}
							>
								{getStatusIcon(historyItem.status)}
							</div>

							{/* Card con información del cambio */}
							<Card
								shadow="sm"
								className={`${isLatest ? 'border-2 border-primary' : ''}`}
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
												<Chip size="sm" color="primary" variant="dot">
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
										<span className="text-default-500">Modificado por:</span>
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
										<div className="mt-3 pt-3 border-t border-default-200 space-y-2">
											<div className="grid grid-cols-2 gap-3 text-xs">
												<div>
													<p className="text-default-500 font-medium">
														ID de cambio:
													</p>
													<p className="font-mono text-default-700">
														{historyItem.id}
													</p>
												</div>
												<div>
													<p className="text-default-500 font-medium">
														Fecha completa:
													</p>
													<p className="text-default-700">
														{formatDateDetailed(historyItem.changedAt)}
													</p>
												</div>
											</div>

											<div className="bg-default-50 rounded-lg p-2 mt-2">
												<p className="text-xs text-default-600">
													<strong>Contexto:</strong>{' '}
													{hasComment
														? 'Este cambio incluye comentarios del responsable que explican la razón de la transición.'
														: 'Este cambio fue registrado automáticamente por el sistema.'}
												</p>
											</div>

											{/* Indicador de posición en el historial */}
											<div className="flex items-center gap-2 text-xs text-default-500">
												<span>📍</span>
												<span>
													Cambio #{sortedHistory.length - index} de{' '}
													{sortedHistory.length}
												</span>
											</div>
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

// Componente principal
export function StudentRequests({
	studentId = '1234567890',
}: {
	studentId?: string;
}) {
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
						<TableColumn>ESTADO ACTUAL</TableColumn>
						<TableColumn>ACCIONES</TableColumn>
					</TableHeader>
					<TableBody>
						{requests.map((request) => (
							<TableRow key={request.id}>
								<TableCell className="font-mono text-xs">
									{request.radicado}
								</TableCell>
								<TableCell className="font-medium">{request.type}</TableCell>
								<TableCell className="max-w-xs truncate">
									{request.description}
								</TableCell>
								<TableCell className="text-sm">
									{new Date(request.createdAt).toLocaleDateString('es-CO')}
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
									<Accordion isCompact>
										<AccordionItem
											key="current-status"
											aria-label="Ver detalles"
											title={
												<span className="text-xs text-primary font-medium">
													👁️ Ver Detalles
												</span>
											}
										>
											<RequestCurrentStatusView request={request} />
										</AccordionItem>
										<AccordionItem
											key="history"
											aria-label="Ver historial"
											title={
												<span className="text-xs text-secondary font-medium">
													📜 Ver Historial
												</span>
											}
										>
											<RequestStatusHistoryView request={request} />
										</AccordionItem>
									</Accordion>
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
		</div>
	);
}
