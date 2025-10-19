import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import React from 'react';
import type { CapacityStatus, Group } from './types';
import { clsx } from './utils';

interface GroupDetailsCardProps {
	group: Group;
	capacityStatus: CapacityStatus;
}

export const GroupDetailsCard: React.FC<GroupDetailsCardProps> = ({
	group,
	capacityStatus,
}) => {
	return (
		<Card radius="sm" shadow="sm">
			<CardHeader>
				<h3 className="text-base font-semibold">
					Detalles del Grupo {group.name}
				</h3>
			</CardHeader>
			<Divider />
			<CardBody className="space-y-4">
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-default-600">Horario</span>
						<span className="font-medium">{group.schedule}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-default-600">Profesor</span>
						<span className="font-medium">{group.professor}</span>
					</div>
				</div>

				<Divider />

				{/* Capacidad con círculo de progreso */}
				<div>
					<p className="text-sm font-semibold mb-3">Capacidad</p>
					<div className="flex items-center gap-4">
						{/* Círculo de progreso */}
						<div className="relative w-20 h-20 flex-shrink-0">
							<svg className="w-20 h-20 transform -rotate-90">
								{/* Círculo de fondo */}
								<circle
									cx="40"
									cy="40"
									r="32"
									stroke="currentColor"
									strokeWidth="6"
									fill="none"
									className="text-default-200"
								/>
								{/* Círculo de progreso */}
								<circle
									cx="40"
									cy="40"
									r="32"
									stroke="currentColor"
									strokeWidth="6"
									fill="none"
									strokeDasharray={`${2 * Math.PI * 32}`}
									strokeDashoffset={`${2 * Math.PI * 32 * (1 - capacityStatus.percentage / 100)}`}
									className={clsx(
										'transition-all duration-500',
										capacityStatus.color === 'danger'
											? 'text-danger'
											: capacityStatus.color === 'warning'
												? 'text-warning'
												: 'text-success',
									)}
									strokeLinecap="round"
								/>
							</svg>
							<div className="absolute inset-0 flex items-center justify-center">
								<span
									className={clsx(
										'text-sm font-bold',
										capacityStatus.color === 'danger'
											? 'text-danger'
											: capacityStatus.color === 'warning'
												? 'text-warning'
												: 'text-success',
									)}
								>
									{capacityStatus.percentage}%
								</span>
							</div>
						</div>

						{/* Información de capacidad */}
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<span
									className={clsx(
										'text-lg font-semibold',
										capacityStatus.color === 'danger'
											? 'text-danger'
											: capacityStatus.color === 'warning'
												? 'text-warning'
												: 'text-success',
									)}
								>
									{group.currentEnrollments}/{group.maxStudents}
								</span>
							</div>
							<Chip color={capacityStatus.color} variant="flat" size="sm">
								{capacityStatus.label}
							</Chip>
						</div>
					</div>

					{/* Mensaje de advertencia */}
					{capacityStatus.percentage >= 90 && (
						<Card
							className={clsx(
								'mt-3 border',
								capacityStatus.color === 'danger'
									? 'bg-danger-50 border-danger-200'
									: 'bg-warning-50 border-warning-200',
							)}
							shadow="none"
						>
							<CardBody className="p-3">
								<div className="flex gap-2 items-start">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className={clsx(
											'w-4 h-4 flex-shrink-0 mt-0.5',
											capacityStatus.color === 'danger'
												? 'text-danger'
												: 'text-warning',
										)}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
										/>
									</svg>
									<p
										className={clsx(
											'text-xs',
											capacityStatus.color === 'danger'
												? 'text-danger-700'
												: 'text-warning-700',
										)}
									>
										{capacityStatus.color === 'danger'
											? 'Este grupo está lleno. Tu solicitud puede ser priorizada si hay razones académicas válidas.'
											: 'Este grupo está casi lleno. Tu solicitud puede ser priorizada según necesidades académicas.'}
									</p>
								</div>
							</CardBody>
						</Card>
					)}
				</div>
			</CardBody>
		</Card>
	);
};
