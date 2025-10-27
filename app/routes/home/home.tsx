<<<<<<< HEAD
import { Button, Image, Link } from '@heroui/react';
=======
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Chip,
	Divider,
	Image,
	Link,
	Spacer,
} from '@heroui/react';
>>>>>>> origin/main

// Metadata que aparece en el <head> de la página
export function meta() {
	return [
<<<<<<< HEAD
		{ title: 'SIRHA - Sistema Universitario' },
		{
			name: 'description',
			content: 'Sistema de Reasignación de Horarios Académicos',
=======
		{ title: 'SIRHA - Sistema de Reasignación de Horarios Académicos' },
		{
			name: 'description',
			content:
				'Sistema de Reasignación de Horarios Académicos para la Escuela Colombiana de Ingeniería',
>>>>>>> origin/main
		},
	];
}

// Página de inicio del sistema universitario SIRHA
<<<<<<< HEAD
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
=======
// Diseñada con enfoque en UX/UI para presentar el sistema de forma profesional
export default function Home() {
	// Características principales del sistema SIRHA
	const features = [
		{
			title: 'Gestión Inteligente',
			description:
				'Optimiza la reasignación de horarios académicos de forma automática',
			icon: '🎓',
			color: 'primary' as const,
		},
		{
			title: 'Solicitudes Rápidas',
			description:
				'Genera y rastrea solicitudes de cambio de horario con radicado único',
			icon: '⚡',
			color: 'secondary' as const,
		},
		{
			title: 'Panel de Control',
			description: 'Visualiza tu progreso académico y horarios en tiempo real',
			icon: '📊',
			color: 'success' as const,
		},
		{
			title: 'Administración Completa',
			description:
				'Gestión de usuarios, periodos académicos y reportes detallados',
			icon: '⚙️',
			color: 'warning' as const,
		},
	];

	// Estadísticas del sistema
	const stats = [
		{ value: '500+', label: 'Estudiantes Activos', color: 'primary' as const },
		{
			value: '50+',
			label: 'Materias Disponibles',
			color: 'secondary' as const,
		},
		{ value: '100%', label: 'Disponibilidad', color: 'success' as const },
		{ value: '24/7', label: 'Soporte', color: 'warning' as const },
	];

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-content1 to-content2 relative overflow-hidden">
			{/* Fondo con efectos de sombra naranja/warning suave */}
			<div className="absolute inset-0 pointer-events-none z-0">
				{/* Glow naranja superior derecho */}
				<div
					className="absolute -top-40 -right-40 w-[800px] h-[800px] bg-warning rounded-full blur-[150px] opacity-30 animate-pulse"
					style={{ animationDuration: '8s' }}
				/>

				{/* Glow naranja inferior izquierdo */}

				{/* Acento primary centro */}
				<div
					className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary rounded-full blur-[250px] opacity-20 animate-pulse"
					style={{ animationDuration: '12s', animationDelay: '4s' }}
				/>
			</div>

			{/* Header con navegación moderna */}
			<header className="sticky top-0 z-50 backdrop-blur-lg bg-background/70 border-b border-divider shadow-small">
				<div className="container mx-auto px-6 py-4">
					<div className="flex justify-between items-center">
						{/* Logo y nombre */}
						<div className="flex items-center gap-6">
							{/* Logo del Proyecto SIRHA */}
							<div className="flex items-center gap-3">
								<Image
									src="/sirha-logo.png"
									alt="Logo SIRHA"
									height={80}
									className="object-contain pr-4"
								/>
							</div>

							<Divider
								orientation="vertical"
								className="h-12 hidden md:block"
							/>

							{/* Logo ECI */}
							<Image
								src="/logo-eci.png"
								alt="Logo ECI"
								height={70}
								className="object-contain pl-4"
							/>
						</div>

						{/* Navegación */}
						<div className="flex items-center gap-3">
							<Button
								as={Link}
								href="/login"
								variant="light"
								color="primary"
								size="lg"
								className="font-semibold"
							>
								Iniciar sesión
							</Button>
							<Button
								as={Link}
								href="/register"
								variant="shadow"
								color="primary"
								size="lg"
								className="font-semibold"
							>
								Registrarse
							</Button>
						</div>
					</div>
				</div>
			</header>

			{/* Hero Section - Sección principal */}
			<section className="container mx-auto px-6 py-16 md:py-24">
				<div className="flex flex-col lg:flex-row items-center justify-between gap-12">
					{/* Contenido principal */}
					<div className="flex-1 text-center lg:text-left space-y-6">
						<Chip
							color="primary"
							variant="flat"
							size="lg"
							className="font-semibold"
						>
							🎓 Sistema Académico Inteligente
						</Chip>

						<h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold">
							<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
								SIRHA
							</span>
						</h1>

						<h2 className="text-2xl md:text-4xl font-bold text-foreground">
							Sistema de Reasignación de
							<br />
							Horarios Académicos
						</h2>

						<p className="text-lg md:text-xl text-default-700 max-w-2xl leading-relaxed">
							Optimiza la gestión de tus horarios académicos con SIRHA. Una
							plataforma diseñada para estudiantes y administradores de la
							Escuela Colombiana de Ingeniería.
						</p>

						{/* Call to action */}
						<div className="flex flex-col sm:flex-row gap-4 pt-4">
							<Button
								as={Link}
								href="/register"
								size="lg"
								color="primary"
								variant="shadow"
								className="font-bold text-lg px-8 py-6"
							>
								Comenzar Ahora →
							</Button>
							<Button
								as={Link}
								href="/login"
								size="lg"
								color="default"
								variant="bordered"
								className="font-semibold text-lg px-8 py-6"
							>
								Iniciar Sesión
							</Button>
						</div>
					</div>

					{/* Imagen ilustrativa */}
					<div className="flex-1 w-full max-w-xl">
						<Card
							className="bg-gradient-to-br from-primary/10 to-secondary/10 border-none"
							shadow="lg"
						>
							<CardBody className="p-0">
								<Image
									src="/universidad.jpg"
									alt="Campus Universidad"
									width={600}
									height={400}
									className="object-cover w-full rounded-lg"
								/>
							</CardBody>
						</Card>
					</div>
				</div>
			</section>

			<Spacer y={8} />

			{/* Estadísticas */}
			<section className="bg-content1/50 backdrop-blur-sm py-12">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{stats.map((stat) => (
							<Card
								key={stat.label}
								className="bg-background/60 backdrop-blur-sm border border-divider"
								shadow="sm"
							>
								<CardBody className="text-center py-6">
									<h3
										className={`text-4xl md:text-5xl font-bold text-${stat.color} mb-2`}
									>
										{stat.value}
									</h3>
									<p className="text-sm md:text-base text-default-600 font-medium">
										{stat.label}
									</p>
								</CardBody>
							</Card>
						))}
					</div>
				</div>
			</section>

			<Spacer y={16} />

			{/* Características principales */}
			<section className="container mx-auto px-6 py-12">
				<div className="text-center mb-12">
					<Chip color="primary" variant="flat" size="lg" className="mb-4">
						✨ Características
					</Chip>
					<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
						Todo lo que necesitas en un solo lugar
					</h2>
					<p className="text-lg text-default-600 max-w-2xl mx-auto">
						SIRHA te ofrece las herramientas necesarias para gestionar tu vida
						académica de forma eficiente
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature) => (
						<Card
							key={feature.title}
							className="bg-content1 hover:bg-content2 transition-all duration-300 hover:scale-105 cursor-pointer"
							isPressable
							shadow="md"
						>
							<CardHeader className="flex-col items-start pb-2">
								<div className="text-5xl mb-3">{feature.icon}</div>
								<h3 className="text-xl font-bold text-foreground">
									{feature.title}
								</h3>
							</CardHeader>
							<Divider />
							<CardBody>
								<p className="text-default-600 leading-relaxed">
									{feature.description}
								</p>
							</CardBody>
						</Card>
					))}
				</div>
			</section>

			<Spacer y={16} />

			{/* Sección de roles */}
			<section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-success/10 py-16">
				<div className="container mx-auto px-6">
					<div className="text-center mb-12">
						<h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
							¿Quién puede usar SIRHA?
						</h2>
						<p className="text-lg text-default-600 max-w-2xl mx-auto">
							Diseñado para toda la comunidad académica
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
						{/* Estudiantes */}
						<Card className="bg-background" shadow="lg">
							<CardHeader className="flex flex-col items-center pb-4 pt-8">
								<div className="text-6xl mb-4">👨‍🎓</div>
								<h3 className="text-2xl font-bold text-primary">Estudiantes</h3>
							</CardHeader>
							<CardBody className="text-center px-6">
								<ul className="space-y-3 text-default-700">
									<li>✓ Consulta tu horario académico</li>
									<li>✓ Solicita cambios de horario</li>
									<li>✓ Visualiza tu progreso</li>
									<li>✓ Rastrea tus solicitudes</li>
								</ul>
							</CardBody>
							<CardFooter className="justify-center pb-6">
								<Button
									as={Link}
									href="/register"
									color="primary"
									variant="flat"
									size="lg"
								>
									Registrarse como estudiante
								</Button>
							</CardFooter>
						</Card>

						{/* Profesores */}
						<Card className="bg-background" shadow="lg">
							<CardHeader className="flex flex-col items-center pb-4 pt-8">
								<div className="text-6xl mb-4">👨‍🏫</div>
								<h3 className="text-2xl font-bold text-secondary">
									Profesores
								</h3>
							</CardHeader>
							<CardBody className="text-center px-6">
								<ul className="space-y-3 text-default-700">
									<li>✓ Gestiona tus materias</li>
									<li>✓ Consulta horarios</li>
									<li>✓ Revisa estudiantes</li>
									<li>✓ Reportes académicos</li>
								</ul>
							</CardBody>
							<CardFooter className="justify-center pb-6">
								<Button
									as={Link}
									href="/login"
									color="secondary"
									variant="flat"
									size="lg"
								>
									Acceso docente
								</Button>
							</CardFooter>
						</Card>

						{/* Administradores */}
						<Card className="bg-background" shadow="lg">
							<CardHeader className="flex flex-col items-center pb-4 pt-8">
								<div className="text-6xl mb-4">👨‍💼</div>
								<h3 className="text-2xl font-bold text-success">
									Administradores
								</h3>
							</CardHeader>
							<CardBody className="text-center px-6">
								<ul className="space-y-3 text-default-700">
									<li>✓ Gestión de usuarios</li>
									<li>✓ Control de periodos</li>
									<li>✓ Reportes completos</li>
									<li>✓ Administración total</li>
								</ul>
							</CardBody>
							<CardFooter className="justify-center pb-6">
								<Button
									as={Link}
									href="/login"
									color="success"
									variant="flat"
									size="lg"
								>
									Panel administrativo
								</Button>
							</CardFooter>
						</Card>
					</div>
				</div>
			</section>

			<Spacer y={16} />

			{/* Footer */}
			<footer className="bg-content1 border-t border-divider py-12">
				<div className="container mx-auto px-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
						{/* Logo y descripción */}
						<div>
							<Image
								src="/logo-eci.png"
								alt="Logo ECI"
								height={60}
								className="object-contain mb-4"
							/>
							<h3 className="text-xl font-bold text-foreground mb-2">SIRHA</h3>
							<p className="text-default-600 text-sm leading-relaxed">
								Sistema de Reasignación de Horarios Académicos de la Escuela
								Colombiana de Ingeniería Julio Garavito.
							</p>
						</div>

						{/* Enlaces rápidos */}
						<div>
							<h4 className="text-lg font-bold text-foreground mb-4">
								Enlaces Rápidos
							</h4>
							<ul className="space-y-2">
								<li>
									<Link
										href="/login"
										className="text-default-600 hover:text-primary"
									>
										Iniciar Sesión
									</Link>
								</li>
								<li>
									<Link
										href="/register"
										className="text-default-600 hover:text-primary"
									>
										Registrarse
									</Link>
								</li>
							</ul>
						</div>

						{/* Información */}
						<div>
							<h4 className="text-lg font-bold text-foreground mb-4">
								Información
							</h4>
							<p className="text-default-600 text-sm mb-2">
								📧 soporte@escuelaing.edu.co
							</p>
							<p className="text-default-600 text-sm mb-2">
								📞 +57 320 968 8974
							</p>
							<p className="text-default-600 text-sm">
								📍 Bogotá D.C., Colombia
							</p>
						</div>
					</div>

					<Divider className="my-6" />

					<div className="text-center">
						<p className="text-default-500 text-sm">
							© 2025 SIRHA - Escuela Colombiana de Ingeniería. Desarrollo de
							Operaciones de Software.
						</p>
						<p className="text-default-400 text-xs mt-2">
							Proyecto académico - DOSW 2025-2
						</p>
					</div>
				</div>
			</footer>
>>>>>>> origin/main
		</div>
	);
}
