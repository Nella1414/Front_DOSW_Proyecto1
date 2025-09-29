import { Card, CardBody, CardHeader, Button, Link } from '@heroui/react';
import { AcademicSemaphore } from '../../components/academic-semaphore';

export function meta() {
	return [
		{ title: 'Progreso Académico - SIRHA' },
		{ name: 'description', content: 'Visualiza tu progreso académico y estado de materias' },
	];
}

export default function AcademicProgressPage() {
	return (
		<div className="min-h-screen bg-content1 p-4">
			{/* Header con navegación de regreso */}
			<div className="max-w-6xl mx-auto mb-6">
				<Button
					as={Link}
					href="/"
					variant="light"
					color="primary"
					startContent={
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					}
				>
					Volver al inicio
				</Button>
			</div>

			{/* Contenido principal */}
			<div className="max-w-6xl mx-auto">
				<Card className="mb-6">
					<CardHeader className="text-center pb-2">
						<div className="w-full">
							<h1 className="text-3xl font-bold text-primary mb-2">
								Mi Progreso Académico
							</h1>
							<p className="text-default-600">
								Visualiza tu avance académico, materias y créditos completados
							</p>
						</div>
					</CardHeader>
					<CardBody className="p-6">
						<AcademicSemaphore userRole="STUDENT" />
					</CardBody>
				</Card>

				{/* Información adicional */}
				<Card>
					<CardBody className="text-center p-6">
						<p className="text-small text-default-600 mb-4">
							¿Tienes dudas sobre tu progreso académico?{' '}
							<Link
								href="mailto:registro@universidad.edu"
								className="text-primary-600 hover:text-primary-800 font-medium"
							>
								Contacta al registro académico
							</Link>
						</p>
						<p className="text-tiny text-default-500">
							La información se actualiza automáticamente cada 5 minutos
						</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}