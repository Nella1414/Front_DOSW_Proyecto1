import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Link,
} from '@heroui/react';
import { StudentRegistration } from '../../components/student-registration';

export function meta() {
	return [
		{ title: 'Registro de Estudiantes - SIRHA' },
		{
			name: 'description',
			content: 'Registro de nuevos estudiantes en el sistema SIRHA',
		},
	];
}

export default function Register() {
	return (
		<div className="min-h-screen bg-content1 p-4">
			{/* Header con navegación de regreso */}
			<div className="max-w-4xl mx-auto mb-6">
				<Button
					as={Link}
					href="/"
					variant="light"
					color="primary"
					startContent={
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-label="Back icon"
						>
							<title>Back icon</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					}
				>
					Volver al inicio
				</Button>
			</div>

			{/* Contenido principal */}
			<div className="max-w-4xl mx-auto">
				<Card className="mb-6">
					<CardHeader className="text-center pb-2">
						<div className="w-full">
							<h1 className="text-3xl font-bold text-primary mb-2">
								Registro de Estudiantes
							</h1>
							<p className="text-default-600">
								Complete el formulario para registrarse en el sistema SIRHA
							</p>
						</div>
					</CardHeader>
					<Divider />
					<CardBody className="p-6">
						<StudentRegistration />
					</CardBody>
				</Card>

				{/* Información adicional */}
				<Card>
					<CardBody className="text-center p-6">
						<p className="text-small text-default-600 mb-4">
							¿Ya tienes una cuenta?{' '}
							<Link
								href="/login"
								className="text-primary-600 hover:text-primary-800 font-medium"
							>
								Inicia sesión aquí
							</Link>
						</p>
						<p className="text-tiny text-default-500">
							Al registrarte, aceptas los términos y condiciones del sistema
							SIRHA
						</p>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}
