import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
} from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import type { CapacityStatus, FormData, Group, Subject } from './types';
import { clsx } from './utils';

interface RequestConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	formData: FormData;
	selectedSubject: Subject | null;
	selectedGroup: Group | null;
	groupCapacityStatus: CapacityStatus | null;
}

export const RequestConfirmationModal: React.FC<
	RequestConfirmationModalProps
> = ({
	isOpen,
	onClose,
	formData,
	selectedSubject,
	selectedGroup,
	groupCapacityStatus,
}) => {
	const [showAcceptButton, setShowAcceptButton] = React.useState(false);
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);

	// Detectar cuando el usuario llega al final del scroll
	const handleScroll = React.useCallback(() => {
		if (!scrollContainerRef.current) return;

		const { scrollTop, scrollHeight, clientHeight } =
			scrollContainerRef.current;
		const isNearBottom = scrollTop + clientHeight >= scrollHeight - 20;

		if (isNearBottom && !showAcceptButton) {
			setShowAcceptButton(true);
		}
	}, [showAcceptButton]);

	// Resetear el estado del botón cuando se abre el modal
	React.useEffect(() => {
		if (isOpen) {
			setShowAcceptButton(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				className="fixed inset-0 bg-success/20 backdrop-blur-sm z-50 flex items-start justify-center pt-10 px-4"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9, y: 20 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.9, y: 20 }}
					transition={{
						duration: 0.3,
						ease: [0.4, 0, 0.2, 1],
					}}
					className="w-full max-w-2xl"
				>
					<Card
						className="bg-success-50 border-2 border-success w-full"
						shadow="lg"
					>
				<CardHeader className="flex-col items-center pb-3 pt-6 bg-success">
					<div className="bg-white rounded-full p-3 mb-3">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2.5}
							stroke="currentColor"
							className="w-8 h-8 text-success"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M4.5 12.75l6 6 9-13.5"
							/>
						</svg>
					</div>
					<h3 className="text-2xl font-bold text-white">
						¡Solicitud Enviada Exitosamente!
					</h3>
				</CardHeader>

				<CardBody
					ref={scrollContainerRef}
					onScroll={handleScroll}
					className="p-6 max-h-[60vh] overflow-y-auto"
				>
					<div className="space-y-4">
						<p className="text-sm text-success-800 text-center mb-4">
							Por favor, revisa los detalles de tu solicitud antes de continuar.
						</p>

						<Divider />

						{/* Resumen de la solicitud */}
						<div className="space-y-4">
							<h4 className="font-semibold text-base text-success-900">
								Resumen de la Solicitud
							</h4>

							{/* Materia */}
							<div className="bg-white rounded-lg p-4 border border-success-200">
								<p className="text-xs text-default-500 mb-1">Materia</p>
								<p className="font-semibold text-default-900">
									{selectedSubject?.code} - {selectedSubject?.name}
								</p>
								<p className="text-xs text-default-600 mt-1">
									Grupo Actual: {selectedSubject?.currentGroup}
								</p>
							</div>

							{/* Cambio solicitado */}
							<div className="bg-white rounded-lg p-4 border border-success-200">
								<p className="text-xs text-default-500 mb-2">Cambio Solicitado</p>
								<div className="flex items-center gap-3">
									<div className="flex-1">
										<p className="text-xs text-default-600">Grupo Actual</p>
										<p className="font-semibold text-default-900">
											{selectedSubject?.currentGroup}
										</p>
									</div>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={2}
										stroke="currentColor"
										className="w-5 h-5 text-success"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
										/>
									</svg>
									<div className="flex-1">
										<p className="text-xs text-default-600">Grupo Destino</p>
										<p className="font-semibold text-success-700">
											{selectedGroup?.name}
										</p>
									</div>
								</div>
							</div>

							{/* Detalles del grupo destino */}
							{selectedGroup && (
								<div className="bg-white rounded-lg p-4 border border-success-200">
									<p className="text-xs text-default-500 mb-2">
										Detalles del Grupo Destino
									</p>
									<div className="space-y-2 text-sm">
										<div className="flex justify-between">
											<span className="text-default-600">Horario:</span>
											<span className="font-medium">{selectedGroup.schedule}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-default-600">Profesor:</span>
											<span className="font-medium">{selectedGroup.professor}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-default-600">Capacidad:</span>
											<span
												className={clsx(
													'font-medium',
													groupCapacityStatus?.color === 'danger'
														? 'text-danger'
														: groupCapacityStatus?.color === 'warning'
															? 'text-warning'
															: 'text-success',
												)}
											>
												{selectedGroup.currentEnrollments}/
												{selectedGroup.maxStudents} estudiantes
											</span>
										</div>
									</div>
								</div>
							)}

							{/* Motivo */}
							<div className="bg-white rounded-lg p-4 border border-success-200">
								<p className="text-xs text-default-500 mb-2">Motivo del Cambio</p>
								<p className="text-sm text-default-700 whitespace-pre-wrap">
									{formData.reason}
								</p>
							</div>

							{/* Información importante */}
							<Card
								className="bg-primary-50 border border-primary-200"
								shadow="none"
							>
								<CardBody className="p-4">
									<div className="flex gap-3">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
											/>
										</svg>
										<div className="text-sm">
											<p className="font-semibold text-primary-700 mb-1">
												Información Importante
											</p>
											<ul className="text-primary-600 space-y-1 text-xs list-disc list-inside">
												<li>Tu solicitud será revisada en 2-3 días hábiles</li>
												<li>Recibirás una notificación por email y en el dashboard</li>
												<li>
													La aprobación depende de criterios académicos y
													disponibilidad
												</li>
												<li>No podrás modificar esta solicitud una vez enviada</li>
											</ul>
										</div>
									</div>
								</CardBody>
							</Card>
						</div>
					</div>
				</CardBody>

				<CardFooter className="flex justify-center pb-6 pt-4 bg-success-50">
					<AnimatePresence mode="wait">
						{showAcceptButton ? (
							<motion.div
								key="buttons"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className="flex gap-3 w-full max-w-md"
							>
								<Button
									color="danger"
									variant="solid"
									size="lg"
									className="flex-1"
									onPress={onClose}
								>
									Cancelar
								</Button>
								<Button
									color="success"
									variant="solid"
									size="lg"
									className="flex-1"
									onPress={onClose}
								>
									Aceptar
								</Button>
							</motion.div>
						) : (
							<motion.p
								key="scroll-message"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
								className="text-xs text-default-500 italic"
							>
								Desplázate hasta el final para continuar...
							</motion.p>
						)}
					</AnimatePresence>
				</CardFooter>
			</Card>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
};
