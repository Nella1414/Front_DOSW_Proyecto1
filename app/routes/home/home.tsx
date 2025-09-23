import { Button, Card, CardBody, Link, Spacer } from '@heroui/react';

// Metadata que aparece en el <head> de la página
export function meta() {
	return [
		{ title: 'SIRHA - DOSW' },
		{ name: 'description', content: 'Welcome to SIRHA - DOSW!' },
	];
}

// Página de inicio - solo tiene el título y un botón para ir al admin
export default function Home() {
	return (
		<div className="w-dvw h-dvh grid place-items-center p-4 bg-content1">
			<Card className="max-w-xl w-full">
				<CardBody className="flex flex-col items-center text-center py-12">
					<p className="text-6xl font-bold">Hola DOSW</p>
					<Spacer y={6} />
					<div className="flex flex-col sm:flex-row gap-4">
						<Button color="primary" size="lg">
							¡Bienvenido a SIRHA - DOSW!
						</Button>
						<Button
							as={Link}
							href="/login"
							variant="bordered"
							color="primary"
							size="lg"
						>
							Iniciar Sesión
						</Button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
