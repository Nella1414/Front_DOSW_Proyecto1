import { Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';

export function DemoCredentials() {
	return (
		<Card className="max-w-md mx-auto mt-4">
			<CardHeader>
				<h3 className="text-lg font-semibold text-center w-full">
					Credenciales de Prueba
				</h3>
			</CardHeader>
			<Divider />
			<CardBody className="space-y-4">
				<div>
					<div className="flex items-center gap-2 mb-2">
						<Chip color="danger" variant="flat" size="sm">
							ADMIN
						</Chip>
						<span className="text-sm font-medium">Administrador</span>
					</div>
					<div className="text-xs space-y-1 text-default-600">
						<p>
							<strong>Email:</strong> du.important@gmail.com
						</p>
						<p>
							<strong>Password:</strong> 123456789
						</p>
					</div>
				</div>

				<Divider />

				<div>
					<div className="flex items-center gap-2 mb-2">
						<Chip color="primary" variant="flat" size="sm">
							STUDENT
						</Chip>
						<span className="text-sm font-medium">Estudiante</span>
					</div>
					<div className="text-xs space-y-1 text-default-600">
						<p>
							<strong>Email:</strong> juan.perez@escuelaing.edu.co
						</p>
						<p>
							<strong>Password:</strong> 123456789
						</p>
						<p>
							<strong>Programa:</strong> Ingeniería de Sistemas
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
