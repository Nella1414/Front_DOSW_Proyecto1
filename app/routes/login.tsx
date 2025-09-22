import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Checkbox,
	Divider,
	Form,
	Input,
	Link,
} from '@heroui/react';
import { useState } from 'react';

export function meta() {
	return [
		{ title: 'Login - SIRHA - DOSW' },
		{ name: 'description', content: 'Login to SIRHA - DOSW' },
	];
}

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const handleEmailLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Simulate login process
		setTimeout(() => {
			console.log('Login attempt:', { email, password });
			setIsLoading(false);
			// Here you would typically handle the actual authentication
		}, 2000);
	};

	const handleGoogleLogin = () => {
		setIsLoading(true);
		// Simulate Google OAuth process
		setTimeout(() => {
			console.log('Google login attempt');
			setIsLoading(false);
			// Here you would typically redirect to Google OAuth
		}, 1500);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<Card className="w-full max-w-md shadow-2xl">
				<CardHeader className="flex flex-col items-center pb-2">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">
						SIRHA - DOSW
					</h1>
					<p className="text-gray-600 text-center">
						Inicia sesión en tu cuenta
					</p>
				</CardHeader>

				<CardBody className="space-y-4">
					<Form onSubmit={handleEmailLogin} className="space-y-4">
						<Input
							type="email"
							label="Correo electrónico"
							placeholder="tu@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							isRequired
							size="lg"
							variant="bordered"
							className="w-full"
						/>

						<Input
							type="password"
							label="Contraseña"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							isRequired
							size="lg"
							variant="bordered"
							className="w-full"
						/>

						<div className="flex justify-between items-center text-sm">
							<Checkbox size="sm">Recordarme</Checkbox>
							<Link href="#" className="text-blue-600 hover:text-blue-800">
								¿Olvidaste tu contraseña?
							</Link>
						</div>

						<Button
							type="submit"
							color="primary"
							size="lg"
							className="w-full"
							isLoading={isLoading}
							isDisabled={isLoading}
						>
							{isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
						</Button>
					</Form>

					<div className="flex items-center gap-3">
						<Divider className="flex-1" />
						<span className="text-sm text-gray-500">O continúa con</span>
						<Divider className="flex-1" />
					</div>

					<Button
						onClick={handleGoogleLogin}
						variant="bordered"
						size="lg"
						className="w-full"
						isLoading={isLoading}
						isDisabled={isLoading}
						startContent={
							<svg
								className="w-5 h-5"
								viewBox="0 0 24 24"
								aria-label="Google logo"
								role="img"
							>
								<title>Google</title>
								<path
									fill="currentColor"
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								/>
								<path
									fill="currentColor"
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								/>
								<path
									fill="currentColor"
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								/>
								<path
									fill="currentColor"
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								/>
							</svg>
						}
					>
						{isLoading ? 'Conectando...' : 'Continuar con Google'}
					</Button>
				</CardBody>

				<CardFooter className="flex justify-center">
					<p className="text-sm text-gray-600">
						¿No tienes cuenta?{' '}
						<Link
							href="#"
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							Regístrate aquí
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
