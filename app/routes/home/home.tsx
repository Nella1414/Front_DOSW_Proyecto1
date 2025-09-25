import { Button, Card, CardBody, Link, Spacer, Image } from '@heroui/react';

// Metadata que aparece en el <head> de la página
export function meta() {
	return [
		{ title: 'SIRHA - Sistema Universitario' },
		{ name: 'description', content: 'Sistema de Reasignación de Horarios Académicos' },
	];
}

// Página de inicio del sistema universitario SIRHA
export default function Home() {
	return (
		<div className="min-h-screen bg-white">
			{/* Header con logo y navegación */}
			<header className="flex justify-between items-center px-6 py-3 bg-primary border-b border-gray-200">
				{/* Logo imagen */}
				<div className="flex items-center">
					<Image 
						src="/logo.jpg" 
						alt="Logo" 
						width={160}
						height={67}
						className="object-cover"
					/>
				</div>

				{/* Botones de navegación */}
				<div className="flex gap-3">
					<Button
						as={Link}
						href="/login"
						variant="bordered"
						color="default"
						size="md"
						className="border-white text-white hover:bg-white hover:text-primary"
					>
						Iniciar sesión
					</Button>
					<Button
						as={Link}
						href="/register"
						color="default"
						size="md"
						className="bg-white text-primary hover:bg-gray-100"
					>
						Registrarse
					</Button>
				</div>
			</header>

			{/* Contenido principal */}
			<main className="flex items-center justify-center min-h-[calc(100vh-120px)] px-6">
				<div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12">
					{/* Contenido izquierda */}
					<div className="flex-1 text-left">
						<h1 className="text-6xl md:text-8xl font-bold text-primary mb-6">
							SIRHA
						</h1>
						<p className="text-2xl md:text-3xl text-gray-800 font-medium">
							Sistema de Reasignación de Horarios Académicos
						</p>
					</div>

					{/* Imagen derecha */}
					<div className="flex-1">
						<Image 
							src="/universidad.jpg" 
							alt="Universidad" 
							width={571}
							height={256}
							className="object-cover rounded-lg shadow-lg"
						/>
					</div>
				</div>
			</main>
		</div>
	);
}
