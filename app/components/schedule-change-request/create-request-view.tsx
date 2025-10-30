import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Select,
	SelectItem,
	Textarea,
} from '@heroui/react';
import React from 'react';
import { GroupDetailsCard } from './group-details-card';
import { ProcessingGuidelinesCard } from './processing-guidelines-card';
import { RequestConfirmationModal } from './request-confirmation-modal';
import type { FormData } from './types';
import { calculateCapacityStatus, mockGroups, mockSubjects } from './utils';

// Componente wrapper para animaciones que se monta solo en el cliente
const ClientOnlyAnimation: React.FC<{
	children: React.ReactNode;
	show: boolean;
	mode?: 'wait' | 'sync' | 'popLayout';
}> = ({ children, show }) => {
	const [isMounted, setIsMounted] = React.useState(false);
	const [AnimatePresence, setAnimatePresence] =
		React.useState<React.ComponentType<{ children: React.ReactNode }> | null>(
			null,
		);

	React.useEffect(() => {
		setIsMounted(true);
		import('framer-motion').then((mod) => {
			setAnimatePresence(() => mod.AnimatePresence);
		});
	}, []);

	// Si no está montado o framer-motion no está cargado, mostrar sin animación
	if (!isMounted || !AnimatePresence) {
		return show ? children : null;
	}

	return <AnimatePresence>{show && children}</AnimatePresence>;
};

// Componente wrapper para motion que se monta solo en el cliente
const ClientOnlyMotion: React.FC<{
	children: React.ReactNode;
	// biome-ignore lint/suspicious/noExplicitAny: necesario para framer-motion
	initial?: any;
	// biome-ignore lint/suspicious/noExplicitAny: necesario para framer-motion
	animate?: any;
	// biome-ignore lint/suspicious/noExplicitAny: necesario para framer-motion
	exit?: any;
	// biome-ignore lint/suspicious/noExplicitAny: necesario para framer-motion
	transition?: any;
	className?: string;
}> = ({ children, initial, animate, exit, transition, className }) => {
	const [isMounted, setIsMounted] = React.useState(false);
	const [motion, setMotion] = React.useState<typeof import('framer-motion').motion | null>(null);

	React.useEffect(() => {
		setIsMounted(true);
		import('framer-motion').then((mod) => {
			setMotion(mod.motion);
		});
	}, []);

	// Si no está montado o framer-motion no está cargado, mostrar sin animación
	if (!isMounted || !motion) {
		return <div className={className}>{children}</div>;
	}

	const MotionDiv = motion.div;
	return (
		<MotionDiv
			initial={initial}
			animate={animate}
			exit={exit}
			transition={transition}
			className={className}
		>
			{children}
		</MotionDiv>
	);
};

export const CreateRequestView: React.FC = () => {
	const [formData, setFormData] = React.useState<FormData>({
		subject: '',
		groupTo: '',
		reason: '',
	});
	const [errors, setErrors] = React.useState<Record<string, string>>({});
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [hasSubmitted, setHasSubmitted] = React.useState(false);

	// Validación en tiempo real
	const validateField = (
		field: string,
		value: string,
		currentFormData: FormData,
	) => {
		const newErrors = { ...errors };

		switch (field) {
			case 'subject':
				if (!value) {
					newErrors[field] = 'Debes seleccionar una materia';
				} else {
					delete newErrors[field];
				}
				break;
			case 'groupTo':
				if (!value) {
					newErrors[field] = 'Debes seleccionar un grupo';
				} else {
					// Verificar si está intentando cambiar al mismo grupo actual
					const selectedSubject = mockSubjects.find(
						(s) => s.id === currentFormData.subject,
					);
					const selectedGroup = mockGroups.find((g) => g.id === value);

					if (
						selectedSubject &&
						selectedGroup &&
						selectedGroup.name === `Grupo ${selectedSubject.currentGroup}`
					) {
						newErrors[field] =
							'No puedes solicitar un cambio al mismo grupo en el que ya estás';
					} else {
						delete newErrors[field];
					}
				}
				break;
			case 'reason':
				if (!value || value.trim() === '') {
					newErrors[field] = 'El motivo es requerido';
				} else if (value.length > 500) {
					newErrors[field] = 'Máximo 500 caracteres';
				} else {
					delete newErrors[field];
				}
				break;
		}

		setErrors(newErrors);
	};

	const handleChange = (field: string, value: string) => {
		const newFormData = { ...formData, [field]: value };
		setFormData(newFormData);
		validateField(field, value, newFormData);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Prevenir envíos duplicados
		if (isSubmitting || hasSubmitted) return;

		// Validar todos los campos
		const requiredFields = ['subject', 'groupTo', 'reason'];
		const newErrors: Record<string, string> = {};

		for (const field of requiredFields) {
			const value = formData[field as keyof FormData];
			if (!value || (typeof value === 'string' && value.trim() === '')) {
				newErrors[field] = 'Este campo es requerido';
			}
		}

		if (formData.reason.length > 500) {
			newErrors.reason = 'Máximo 500 caracteres';
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			return;
		}

		setIsSubmitting(true);

		try {
			// Simular llamada a la API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Mock de respuesta exitosa
			console.log('Solicitud creada:', formData);

			// Marcar como enviado
			setHasSubmitted(true);
		} catch (error) {
			console.error('Error al crear solicitud:', error);
			alert('Error al crear la solicitud. Por favor intenta de nuevo.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Obtener información del grupo seleccionado
	const selectedGroup = React.useMemo(() => {
		if (!formData.groupTo) return null;
		return mockGroups.find((g) => g.id === formData.groupTo) || null;
	}, [formData.groupTo]);

	// Calcular el estado de capacidad del grupo seleccionado
	const groupCapacityStatus = React.useMemo(() => {
		if (!selectedGroup) return null;
		return calculateCapacityStatus(
			selectedGroup.currentEnrollments,
			selectedGroup.maxStudents,
		);
	}, [selectedGroup]);

	// Obtener la materia seleccionada
	const selectedSubject = React.useMemo(() => {
		if (!formData.subject) return null;
		return mockSubjects.find((s) => s.id === formData.subject) || null;
	}, [formData.subject]);

	// Calcular si el formulario es válido
	const isFormValid = React.useMemo(() => {
		const allFieldsFilled =
			formData.subject !== '' &&
			formData.groupTo !== '' &&
			formData.reason.trim() !== '';

		const noErrors = Object.keys(errors).length === 0;

		return allFieldsFilled && noErrors;
	}, [formData, errors]);

	// Función para resetear el formulario y cerrar el modal
	const resetForm = React.useCallback(() => {
		setHasSubmitted(false);
		setFormData({
			subject: '',
			groupTo: '',
			reason: '',
		});
		setErrors({});
	}, []);

	return (
		<>
			{/* Modal de confirmación */}
			<RequestConfirmationModal
				isOpen={hasSubmitted}
				onClose={resetForm}
				formData={formData}
				selectedSubject={selectedSubject}
				selectedGroup={selectedGroup}
				groupCapacityStatus={groupCapacityStatus}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Formulario principal */}
				<div className="lg:col-span-2">
					<Card radius="sm" shadow="sm">
						<CardHeader className="flex-col items-start gap-1 pb-4">
							<div className="flex items-center gap-2">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6 text-primary"
									role="img"
									aria-label="Formulario de solicitud"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
									/>
								</svg>
								<h2 className="text-xl font-semibold">
									Crear Solicitud de Cambio de Horario
								</h2>
							</div>
							<p className="text-sm text-default-500">
								Solicita cambiar tu asignación de grupo para una materia
							</p>
						</CardHeader>
						<Divider />

						{/* Mensaje informativo importante */}
						<CardBody className="space-y-6">
							<Alert
								color="primary"
								variant="faded"
								title="Importante"
								description="Los cambios de horario solo se permiten durante las primeras dos semanas del semestre. Las solicitudes deben enviarse con al menos 48 horas de anticipación. No se pueden solicitar cambios para materias canceladas o grupos que hayan alcanzado su capacidad máxima."
							/>

							{/* Formulario */}
							<form onSubmit={handleSubmit} className="space-y-6">
								<div>
									<h3 className="text-base font-semibold mb-3">
										Detalles de la Solicitud
									</h3>
									<p className="text-sm text-default-500 mb-4">
										Completa el formulario para solicitar un cambio de horario
									</p>

									<div className="space-y-4">
										{/* Materia - Siempre visible */}
										<Select
											isRequired
											label="Materia"
											placeholder="Selecciona la materia"
											selectedKeys={formData.subject ? [formData.subject] : []}
											onSelectionChange={(keys) => {
												const value = Array.from(keys)[0] as string;
												handleChange('subject', value || '');
											}}
											isInvalid={!!errors.subject}
											errorMessage={errors.subject}
											description="Solo puedes cambiar de grupo dentro de la misma materia"
											variant="bordered"
											labelPlacement="outside"
											disallowEmptySelection
										>
											{mockSubjects.map((subject) => (
												<SelectItem
													key={subject.id}
													textValue={`${subject.code} - ${subject.name}`}
												>
													{subject.code} - {subject.name} (Grupo Actual:{' '}
													{subject.currentGroup})
												</SelectItem>
											))}
										</Select>

										{/* Campos que aparecen después de seleccionar materia */}
										<ClientOnlyAnimation show={!!formData.subject}>
											<ClientOnlyMotion
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: 'auto' }}
												exit={{ opacity: 0, height: 0 }}
												transition={{ duration: 0.3, ease: 'easeOut' }}
												className="space-y-4"
											>
												<Divider className="my-4" />

												{/* Grupo Destino */}
												<ClientOnlyMotion
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.3, delay: 0.1 }}
												>
													<Select
														isRequired
														label="Grupo Destino"
														placeholder="Selecciona el grupo destino"
														selectedKeys={
															formData.groupTo ? [formData.groupTo] : []
														}
														onSelectionChange={(keys) => {
															const value = Array.from(keys)[0] as string;
															handleChange('groupTo', value || '');
														}}
														isInvalid={!!errors.groupTo}
														errorMessage={errors.groupTo}
														variant="bordered"
														labelPlacement="outside"
														disallowEmptySelection
													>
														{mockGroups.map((group) => (
															<SelectItem
																key={group.id}
																textValue={`${group.name} - ${group.schedule}`}
															>
																{group.name} - {group.schedule} (
																{group.currentEnrollments}/{group.maxStudents}{' '}
																estudiantes)
															</SelectItem>
														))}
													</Select>
												</ClientOnlyMotion>

												<Divider className="my-4" />

												{/* Razón del Cambio */}
												<ClientOnlyMotion
													initial={{ opacity: 0, x: -20 }}
													animate={{ opacity: 1, x: 0 }}
													transition={{ duration: 0.3, delay: 0.2 }}
												>
													<Textarea
														isRequired
														label="Motivo del Cambio"
														placeholder="Por favor explica por qué necesitas este cambio de horario..."
														value={formData.reason}
														onValueChange={(value) =>
															handleChange('reason', value)
														}
														isInvalid={!!errors.reason}
														errorMessage={errors.reason}
														description="Proporciona un motivo claro para tu solicitud. Razones comunes incluyen conflictos de horario, problemas de transporte o compromisos laborales."
														variant="bordered"
														labelPlacement="outside"
														maxLength={500}
														minRows={4}
														classNames={{
															description: 'text-xs',
															errorMessage: 'text-xs',
														}}
													/>
													<div className="flex justify-end mt-1">
														<span className="text-xs text-default-400">
															{formData.reason.length}/500
														</span>
													</div>
												</ClientOnlyMotion>

												{/* Botón de envío */}
												<ClientOnlyMotion
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.3, delay: 0.3 }}
												>
													<Button
														type="submit"
														color="primary"
														size="lg"
														className="w-full mt-4"
														isLoading={isSubmitting}
														isDisabled={
															!isFormValid || isSubmitting || hasSubmitted
														}
													>
														{isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
													</Button>
												</ClientOnlyMotion>
											</ClientOnlyMotion>
										</ClientOnlyAnimation>
									</div>
								</div>
							</form>
						</CardBody>
					</Card>
				</div>

				{/* Panel lateral con guidelines y detalles del grupo */}
				<div className="lg:col-span-1">
					<div className="sticky top-6 space-y-4">
						{/* Detalles del Grupo Seleccionado */}
						<ClientOnlyAnimation
							show={!!(selectedGroup && groupCapacityStatus)}
							mode="wait"
						>
							<ClientOnlyMotion
								key="group-details"
								initial={{ opacity: 0, x: 20, scale: 0.95 }}
								animate={{ opacity: 1, x: 0, scale: 1 }}
								exit={{ opacity: 0, x: 20, scale: 0.95 }}
								transition={{
									duration: 0.4,
									ease: [0.4, 0, 0.2, 1],
								}}
							>
								{selectedGroup && groupCapacityStatus && (
									<GroupDetailsCard
										group={selectedGroup}
										capacityStatus={groupCapacityStatus}
									/>
								)}
							</ClientOnlyMotion>
						</ClientOnlyAnimation>{' '}
						{/* Guías de Procesamiento */}
						<ProcessingGuidelinesCard />
					</div>
				</div>
			</div>
		</>
	);
};
