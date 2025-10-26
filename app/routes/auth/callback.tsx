import { Card, CardBody, Spinner } from '@heroui/react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

export function meta() {
	return [
		{ title: 'Autenticando... - SIRHA' },
		{ name: 'description', content: 'Procesando autenticación' },
	];
}

export default function AuthCallback() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const token = searchParams.get('token');

		if (token) {
			// Guardar el token en localStorage
			localStorage.setItem('accessToken', token);

			// Obtener información del usuario para redirigir según su rol
			fetch('http://localhost:3000/auth/me', {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					const userRole = data.user.roles[0];

					// Redirigir según el rol
					if (userRole === 'ADMIN' || userRole === 'DEAN') {
						navigate('/admin-dashboard');
					} else {
						navigate('/student-dashboard');
					}
				})
				.catch((error) => {
					console.error('Error fetching user data:', error);
					navigate('/login');
				});
		} else {
			// Si no hay token, redirigir al login
			navigate('/login');
		}
	}, [searchParams, navigate]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-content3 to-content1 p-4">
			<Card className="w-full max-w-md">
				<CardBody className="flex flex-col items-center justify-center p-8 gap-4">
					<Spinner size="lg" color="primary" />
					<h2 className="text-xl font-semibold text-default-900">
						Autenticando...
					</h2>
					<p className="text-default-600 text-center">
						Estamos procesando tu autenticación. Serás redirigido en un momento.
					</p>
				</CardBody>
			</Card>
		</div>
	);
}
