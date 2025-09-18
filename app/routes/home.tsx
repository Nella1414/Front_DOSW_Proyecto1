import { Button } from '@heroui/react';
import { Link } from '@heroui/react';
import { Card, CardBody } from '@heroui/react';
import { Spacer } from '@heroui/react';

export function meta() {
	return [
		{ title: 'SIRHA - DOSW' },
		{ name: 'description', content: 'Welcome to SIRHA - DOSW!' },
	];
}

export default function Home() {
	return (
		<div className="w-dvw h-dvh grid place-items-center p-4">
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
