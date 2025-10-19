/** biome-ignore-all lint/a11y/noSvgWithoutTitle: false positive */
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
import React, { useEffect, useState } from 'react';
import { DemoCredentials } from '../../components/demo-credentials';

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

			// Check credentials and redirect based on role
			if (email === 'du.important@gmail.com' && password === '123456789') {
				// Admin credentials - redirect to admin dashboard
				window.location.href = '/admin-dashboard';
			} else if (
				email === 'decano@escuelaing.edu.co' &&
				password === '123456789'
			) {
				// Faculty/Decano credentials - redirect to admin dashboard
				window.location.href = '/admin-dashboard';
			} else if (
				email === 'juan.perez@escuelaing.edu.co' &&
				password === '123456789'
			) {
				// Student credentials - redirect to student dashboard
				window.location.href = '/student-dashboard';
			} else {
				// Show error for invalid credentials
				alert('Credenciales inválidas. Verifica tu email y contraseña.');
			}

			setIsLoading(false);
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
	useEffect(() => {}, []);
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br dark:bg-gradient-to-tl from-content3 to-content1 p-4">
			<Card className="w-full max-w-md container mx-auto bg-content4 shadow-medium">
				<CardHeader className="flex flex-col items-center pb-2 mt-5">
					<Button variant="shadow" color="primary" size="lg" className="mb-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							className="size-10"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
							/>
						</svg>
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col items-center text-center">
					<h1 className="text-3xl font-medium items-center text-2xl-900 mb-2">
						SIRHA - DOSW
					</h1>
				</CardBody>
				<CardFooter className="flex justify-center mb-5">
					<p className="text-small text-default-600">
						Academic Schedule Reassignment System
					</p>
				</CardFooter>
			</Card>
			<Card className="w-full max-w-md shadow-medium container mx-auto bg-content4 mt-10">
				<CardHeader className="flex flex-col items-center pb-2 mt-5">
					<h1 className="text-2xl font-medium text-default-900 mb-2">
						Sign In to Your Account!
					</h1>
					<p className="text-default-600 text-center">
						Enter your credentials to access your account
					</p>
				</CardHeader>

				<CardBody className="space-y-5 px-5">
					<Form onSubmit={handleEmailLogin} className="space-y-4">
						<Input
							type="email"
							label="Email"
							placeholder="you@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							isRequired
							size="lg"
							color="primary"
							variant="faded"
							className="w-full"
						/>

						<Input
							type="password"
							label="Password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							isRequired
							size="lg"
							color="primary"
							variant="faded"
							className="w-full"
						/>

						<div className="flex justify-between items-center text-small w-full">
							<Checkbox size="sm">Remember me</Checkbox>
							<Link
								href="#"
								className="text-primary-600 hover:text-primary-800"
							>
								Forgot your password?
							</Link>
						</div>

						<Button
							type="submit"
							color="primary"
							size="lg"
							className="loginButton w-full"
							isLoading={isLoading}
							isDisabled={isLoading}
						>
							{isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
						</Button>
					</Form>

					<div className="flex items-center gap-3">
						<Divider className="flex-1" />
						<span className="text-small text-default-100">O continúa con</span>
						<Divider className="flex-1" />
					</div>

					<Button
						onClick={handleGoogleLogin}
						variant="bordered"
						size="lg"
						className="loginGoogle w-full"
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

				<CardFooter className="flex justify-center mb-5">
					<p className="text-small text-default-600">
						¿No tienes cuenta?{' '}
						<Link
							href="/register"
							className="text-primary-600 hover:text-primary-800 font-medium"
						>
							Regístrate aquí
						</Link>
					</p>
				</CardFooter>
			</Card>

			<DemoCredentials />
		</div>
	);
}
