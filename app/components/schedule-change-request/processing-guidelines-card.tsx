import { Card, CardBody, CardHeader, Divider } from '@heroui/react';
import type React from 'react';

export const ProcessingGuidelinesCard: React.FC = () => {
	return (
		<Card radius="sm" shadow="sm">
			<CardHeader>
				<div className="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-5 h-5"
						role="img"
						aria-label="Clock icon"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
						/>
					</svg>
					<h3 className="text-base font-semibold">Guías de Procesamiento</h3>
				</div>
			</CardHeader>
			<Divider />
			<CardBody className="space-y-4">
				{/* Review Time */}
				<div className="flex gap-3">
					<div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
					<div>
						<p className="text-sm font-semibold mb-1">Tiempo de Revisión</p>
						<p className="text-xs text-default-500">2-3 días hábiles</p>
					</div>
				</div>

				{/* Approval Criteria */}
				<div className="flex gap-3">
					<div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
					<div>
						<p className="text-sm font-semibold mb-1">
							Criterios de Aprobación
						</p>
						<p className="text-xs text-default-500">
							Progreso académico y razones válidas
						</p>
					</div>
				</div>

				{/* Notification */}
				<div className="flex gap-3">
					<div className="w-2 h-2 rounded-full bg-warning mt-1.5 flex-shrink-0" />
					<div>
						<p className="text-sm font-semibold mb-1">Notificación</p>
						<p className="text-xs text-default-500">
							Email y actualizaciones en el dashboard
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};
