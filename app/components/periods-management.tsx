import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from '@heroui/react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface AcademicPeriod {
	id: string;
	name: string;
	startDate: string;
	endDate: string;
	status: 'activo' | 'cerrado' | 'futuro';
}

// Mock data
const mockPeriods: AcademicPeriod[] = [
	{
		id: '1',
		name: '2024-1',
		startDate: '2024-02-01',
		endDate: '2024-06-30',
		status: 'cerrado',
	},
	{
		id: '2',
		name: '2024-2',
		startDate: '2024-08-01',
		endDate: '2024-12-15',
		status: 'activo',
	},
	{
		id: '3',
		name: '2025-1',
		startDate: '2025-02-01',
		endDate: '2025-06-30',
		status: 'futuro',
	},
];

// FEAT-036 US-0103 – UI Config Periodos
export function PeriodsManagement({
	userRole = 'ADMIN',
}: {
	userRole?: string;
}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editingPeriod, setEditingPeriod] = useState<AcademicPeriod | null>(
		null,
	);
	const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
	const queryClient = useQueryClient();

	// Verificar permisos de administrador
	if (userRole !== 'ADMIN') {
		return (
			<Alert color="danger" title="Acceso Denegado">
				Solo los administradores pueden gestionar períodos académicos.
			</Alert>
		);
	}

	// Query para obtener períodos
	const { data: periods = [], isLoading } = useQuery({
		queryKey: ['academic-periods'],
		queryFn: async (): Promise<AcademicPeriod[]> => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return mockPeriods;
		},
	});

	// Mutación para crear/actualizar período
	const savePeriodMutation = useMutation({
		mutationFn: async (
			period: Omit<AcademicPeriod, 'id'> & { id?: string },
		) => {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Validaciones del backend simuladas
			const existingPeriod = mockPeriods.find(
				(p) => p.name === period.name && p.id !== period.id,
			);
			if (existingPeriod) {
				throw new Error('Ya existe un período con ese nombre');
			}

			// Validar fechas
			if (new Date(period.startDate) >= new Date(period.endDate)) {
				throw new Error(
					'La fecha de inicio debe ser anterior a la fecha de fin',
				);
			}

			// Validar solapamientos
			const hasOverlap = mockPeriods.some((p) => {
				if (p.id === period.id) return false;
				const pStart = new Date(p.startDate);
				const pEnd = new Date(p.endDate);
				const newStart = new Date(period.startDate);
				const newEnd = new Date(period.endDate);

				return newStart <= pEnd && newEnd >= pStart;
			});

			if (hasOverlap) {
				throw new Error('Las fechas se solapan con otro período existente');
			}

			return period;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['academic-periods'] });
			onClose();
			setEditingPeriod(null);
		},
	});

	// Mutación para eliminar período
	const deletePeriodMutation = useMutation({
		mutationFn: async (id: string) => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return id;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['academic-periods'] });
			setDeleteConfirm(null);
		},
	});

	// Formulario con validación en tiempo real
	const form = useForm({
		defaultValues: {
			name: editingPeriod?.name || '',
			startDate: editingPeriod?.startDate || '',
			endDate: editingPeriod?.endDate || '',
		},
		onSubmit: async ({ value }) => {
			const periodData = {
				...value,
				id: editingPeriod?.id,
				status: getStatusFromDates(value.startDate, value.endDate) as
					| 'activo'
					| 'cerrado'
					| 'futuro',
			};
			savePeriodMutation.mutate(periodData);
		},
	});

	// Determinar estado basado en fechas
	const getStatusFromDates = (startDate: string, endDate: string) => {
		const now = new Date();
		const start = new Date(startDate);
		const end = new Date(endDate);

		if (now < start) return 'futuro';
		if (now > end) return 'cerrado';
		return 'activo';
	};

	// Colores para estados
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'activo':
				return 'success';
			case 'cerrado':
				return 'default';
			case 'futuro':
				return 'primary';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'activo':
				return 'Activo';
			case 'cerrado':
				return 'Cerrado';
			case 'futuro':
				return 'Futuro';
			default:
				return status;
		}
	};

	const handleEdit = (period: AcademicPeriod) => {
		setEditingPeriod(period);
		form.setFieldValue('name', period.name);
		form.setFieldValue('startDate', period.startDate);
		form.setFieldValue('endDate', period.endDate);
		onOpen();
	};

	const handleNew = () => {
		setEditingPeriod(null);
		form.reset();
		onOpen();
	};

	const handleDelete = (id: string) => {
		if (deleteConfirm === id) {
			deletePeriodMutation.mutate(id);
		} else {
			setDeleteConfirm(id);
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex justify-between">
					<div>
						<h3 className="text-lg font-semibold">Períodos Académicos</h3>
						<p className="text-sm text-default-500">
							Gestión de períodos académicos del sistema
						</p>
					</div>
					<Button color="primary" onPress={handleNew}>
						Nuevo Período
					</Button>
				</CardHeader>
				<CardBody>
					<Table aria-label="Tabla de períodos académicos">
						<TableHeader>
							<TableColumn>NOMBRE</TableColumn>
							<TableColumn>FECHA INICIO</TableColumn>
							<TableColumn>FECHA FIN</TableColumn>
							<TableColumn>ESTADO</TableColumn>
							<TableColumn>ACCIONES</TableColumn>
						</TableHeader>
						<TableBody isLoading={isLoading}>
							{periods.map((period) => (
								<TableRow key={period.id}>
									<TableCell className="font-medium">{period.name}</TableCell>
									<TableCell>
										{new Date(period.startDate).toLocaleDateString()}
									</TableCell>
									<TableCell>
										{new Date(period.endDate).toLocaleDateString()}
									</TableCell>
									<TableCell>
										<Chip color={getStatusColor(period.status)} variant="flat">
											{getStatusLabel(period.status)}
										</Chip>
									</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												size="sm"
												variant="light"
												color="primary"
												onPress={() => handleEdit(period)}
											>
												Editar
											</Button>
											<Button
												size="sm"
												variant="light"
												color="danger"
												onPress={() => handleDelete(period.id)}
											>
												{deleteConfirm === period.id ? 'Confirmar' : 'Eliminar'}
											</Button>
											{deleteConfirm === period.id && (
												<Button
													size="sm"
													variant="light"
													onPress={() => setDeleteConfirm(null)}
												>
													Cancelar
												</Button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardBody>
			</Card>

			{/* Modal para crear/editar período */}
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalContent>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							form.handleSubmit();
						}}
					>
						<ModalHeader>
							{editingPeriod ? 'Editar Período' : 'Nuevo Período'}
						</ModalHeader>
						<ModalBody className="space-y-4">
							{savePeriodMutation.error && (
								<Alert color="danger" title="Error">
									{savePeriodMutation.error.message}
								</Alert>
							)}

							<form.Field
								name="name"
								validators={{
									onChange: ({ value }) => {
										if (!value) return 'Nombre requerido';
										if (value.length < 3) return 'Mínimo 3 caracteres';
									},
								}}
							>
								{(field) => (
									<Input
										label="Nombre del Período"
										placeholder="Ej: 2024-1"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										isInvalid={!!field.state.meta.errors.length}
										errorMessage={field.state.meta.errors[0]}
										isRequired
									/>
								)}
							</form.Field>

							<form.Field
								name="startDate"
								validators={{
									onChange: ({ value }) => {
										if (!value) return 'Fecha de inicio requerida';
									},
								}}
							>
								{(field) => (
									<Input
										type="date"
										label="Fecha de Inicio"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										isInvalid={!!field.state.meta.errors.length}
										errorMessage={field.state.meta.errors[0]}
										isRequired
									/>
								)}
							</form.Field>

							<form.Field
								name="endDate"
								validators={{
									onChange: ({ value, fieldApi }) => {
										if (!value) return 'Fecha de fin requerida';
										const startDate = fieldApi.form.getFieldValue('startDate');
										if (startDate && new Date(value) <= new Date(startDate)) {
											return 'La fecha de fin debe ser posterior a la fecha de inicio';
										}
									},
								}}
							>
								{(field) => (
									<Input
										type="date"
										label="Fecha de Fin"
										value={field.state.value}
										onChange={(e) => field.handleChange(e.target.value)}
										isInvalid={!!field.state.meta.errors.length}
										errorMessage={field.state.meta.errors[0]}
										isRequired
									/>
								)}
							</form.Field>
						</ModalBody>
						<ModalFooter>
							<Button variant="light" onPress={onClose}>
								Cancelar
							</Button>
							<Button
								color="primary"
								type="submit"
								isLoading={savePeriodMutation.isPending}
							>
								{editingPeriod ? 'Actualizar' : 'Crear'}
							</Button>
						</ModalFooter>
					</form>
				</ModalContent>
			</Modal>
		</div>
	);
}
