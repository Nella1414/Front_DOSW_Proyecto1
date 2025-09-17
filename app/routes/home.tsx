import { Button } from '@heroui/react';
import { Link } from 'react-router';

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
		// Pantalla completa centrada
		<div className="w-dvw h-dvh grid place-items-center">
			<div className="text-center space-y-6">
				<h1 className="text-7xl">SIRHA - DOSW</h1>
				<p className="text-xl text-gray-600">Sistema Integral de Registro y Habilitación Académica</p>
				{/* Botón que lleva al panel de administración */}
				<Link to="/admin">
					<Button color="primary" size="lg">
						Acceder al Panel de Administración
					</Button>
				</Link>
			</div>
		</div>
	);
}
