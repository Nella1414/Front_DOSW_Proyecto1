import { Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useId } from 'react';
import { GroupDetailsCard } from './group-details-card';
import { ProcessingGuidelinesCard } from './processing-guidelines-card';
import { RequestConfirmationModal } from './request-confirmation-modal';
import type { FormData } from './types';
import {
	calculateCapacityStatus,
	clsx,
	mockGroups,
	mockSubjects,
} from './utils';

export const CreateRequestView: React.FC = () => {
	// Generate unique IDs for form elements
	const subjectSelectId = useId();
	const groupToSelectId = useId();
	const reasonTextareaId = useId();

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
							<Card
								className="bg-primary-50 border border-primary-200"
								shadow="none"
							>
								<CardBody>
									<div className="flex gap-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
											role="img"
											aria-label="Información importante"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
											/>
										</svg>
										<div className="text-sm">
											<p className="font-semibold text-primary-700 mb-1">
												Importante:
											</p>
											<p className="text-primary-600">
												Los cambios de horario solo se permiten durante las
												primeras dos semanas del semestre. Las solicitudes deben
												enviarse con al menos 48 horas de anticipación. No se
												pueden solicitar cambios para materias canceladas o
												grupos que hayan alcanzado su capacidad máxima.
											</p>
										</div>
									</div>
								</CardBody>
							</Card>

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
										<div>
											<label
												htmlFor={subjectSelectId}
												className="text-sm font-medium mb-2 block"
											>
												Materia <span className="text-danger">*</span>
											</label>
											<select
												id={subjectSelectId}
												value={formData.subject}
												onChange={(e) =>
													handleChange('subject', e.target.value)
												}
												className={clsx(
													'w-full px-3 py-2 rounded-lg border bg-default-100 text-sm',
													errors.subject
														? 'border-danger'
														: 'border-default-200',
												)}
											>
												<option value="">Selecciona la materia</option>
												{mockSubjects.map((subject) => (
													<option key={subject.id} value={subject.id}>
														{subject.code} - {subject.name} (Grupo Actual:{' '}
														{subject.currentGroup})
													</option>
												))}
											</select>
											{errors.subject && (
												<p className="text-xs text-danger mt-1">
													{errors.subject}
												</p>
											)}
											<p className="text-xs text-default-400 mt-1">
												Solo puedes cambiar de grupo dentro de la misma materia
											</p>
										</div>

										{/* Campos que aparecen después de seleccionar materia */}
										<AnimatePresence>
											{formData.subject && (
												<motion.div
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: 'auto' }}
													exit={{ opacity: 0, height: 0 }}
													transition={{ duration: 0.3, ease: 'easeOut' }}
												>
													<Divider className="my-4" />

													{/* Grupo Destino */}
													<motion.div
														initial={{ opacity: 0, x: -20 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ duration: 0.3, delay: 0.1 }}
													>
														<label
															htmlFor={groupToSelectId}
															className="text-sm font-medium mb-2 block"
														>
															Grupo Destino{' '}
															<span className="text-danger">*</span>
														</label>
														<select
															id={groupToSelectId}
															value={formData.groupTo}
															onChange={(e) =>
																handleChange('groupTo', e.target.value)
															}
															className={clsx(
																'w-full px-3 py-2 rounded-lg border bg-default-100 text-sm',
																errors.groupTo
																	? 'border-danger'
																	: 'border-default-200',
															)}
														>
															<option value="">
																Selecciona el grupo destino
															</option>
															{mockGroups.map((group) => (
																<option key={group.id} value={group.id}>
																	{group.name} - {group.schedule} (
																	{group.currentEnrollments}/{group.maxStudents}{' '}
																	estudiantes)
																</option>
															))}
														</select>
														{errors.groupTo && (
															<p className="text-xs text-danger mt-1">
																{errors.groupTo}
															</p>
														)}
													</motion.div>

													<Divider className="my-4" />

													{/* Razón del Cambio */}
													<motion.div
														initial={{ opacity: 0, x: -20 }}
														animate={{ opacity: 1, x: 0 }}
														transition={{ duration: 0.3, delay: 0.2 }}
													>
														<label
															htmlFor={reasonTextareaId}
															className="text-sm font-medium mb-2 block"
														>
															Motivo del Cambio{' '}
															<span className="text-danger">*</span>
														</label>
														<textarea
															id={reasonTextareaId}
															value={formData.reason}
															onChange={(e) =>
																handleChange('reason', e.target.value)
															}
															placeholder="Por favor explica por qué necesitas este cambio de horario..."
															className={clsx(
																'w-full px-3 py-2 rounded-lg border bg-default-100 text-sm min-h-[100px] resize-none',
																errors.reason
																	? 'border-danger'
																	: 'border-default-200',
															)}
														/>
														<div className="flex justify-between items-center mt-1">
															{errors.reason ? (
																<p className="text-xs text-danger">
																	{errors.reason}
																</p>
															) : (
																<p className="text-xs text-default-400">
																	Proporciona un motivo claro para tu solicitud.
																	Razones comunes incluyen conflictos de
																	horario, problemas de transporte o compromisos
																	laborales.
																</p>
															)}
															<span className="text-xs text-default-400 ml-2">
																{formData.reason.length}/500
															</span>
														</div>
													</motion.div>

													{/* Botón de envío */}
													<motion.div
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
															{isSubmitting
																? 'Enviando...'
																: 'Enviar Solicitud'}
														</Button>
													</motion.div>
												</motion.div>
											)}
										</AnimatePresence>
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
						<AnimatePresence mode="wait">
							{selectedGroup && groupCapacityStatus && (
								<motion.div
									key="group-details"
									initial={{ opacity: 0, x: 20, scale: 0.95 }}
									animate={{ opacity: 1, x: 0, scale: 1 }}
									exit={{ opacity: 0, x: 20, scale: 0.95 }}
									transition={{
										duration: 0.4,
										ease: [0.4, 0, 0.2, 1],
									}}
								>
									<GroupDetailsCard
										group={selectedGroup}
										capacityStatus={groupCapacityStatus}
									/>
								</motion.div>
							)}
						</AnimatePresence>

						{/* Guías de Procesamiento */}
						<ProcessingGuidelinesCard />
					</div>
				</div>
			</div>
		</>
	);
};
