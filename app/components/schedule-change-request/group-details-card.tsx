import {
	Alert,
	Card,
	CardBody,
	CardHeader,
	Chip,
	CircularProgress,
	Divider,
} from '@heroui/react';
import type React from 'react';
import type { CapacityStatus, Group } from './types';

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
						{/* Círculo de progreso usando hero-ui CircularProgress */}
						<CircularProgress
							aria-label="Capacidad del grupo"
							size="lg"
							value={capacityStatus.percentage}
							color={capacityStatus.color}
							showValueLabel={true}
							strokeWidth={4}
							classNames={{
								svg: 'w-20 h-20 drop-shadow-md',
								value: 'text-sm font-bold',
							}}
						/>

						{/* Información de capacidad */}
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<span className="text-lg font-semibold">
									{group.currentEnrollments}/{group.maxStudents}
								</span>
							</div>
							<Chip color={capacityStatus.color} variant="flat" size="sm">
								{capacityStatus.label}
							</Chip>
						</div>
					</div>

					{/* Mensaje de advertencia usando Alert de hero-ui */}
					{capacityStatus.percentage >= 90 && (
						<div className="mt-3">
							<Alert
								color={capacityStatus.color}
								variant="faded"
								hideIconWrapper={false}
								description={
									capacityStatus.color === 'danger'
										? 'Este grupo está lleno. Tu solicitud puede ser priorizada si hay razones académicas válidas.'
										: 'Este grupo está casi lleno. Tu solicitud puede ser priorizada según necesidades académicas.'
								}
							/>
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
};
