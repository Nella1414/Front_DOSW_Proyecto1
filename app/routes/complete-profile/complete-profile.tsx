import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Select,
	SelectItem,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { api, facultyApi } from '../../lib/api';

export function meta() {
	return [
		{ title: 'Completar Perfil - SIRHA' },
		{ name: 'description', content: 'Completa tu información de estudiante' },
	];
}

interface Faculty {
	_id: string;
	name: string;
	code: string;
}

interface Program {
	_id: string;
	name: string;
	code: string;
	facultyId: string;
}

export default function CompleteProfile() {
	const [displayName, setDisplayName] = useState('');
	const [selectedFaculty, setSelectedFaculty] = useState('');
	const [selectedProgram, setSelectedProgram] = useState('');
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [programs, setPrograms] = useState<Program[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [isLoadingData, setIsLoadingData] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		// Cargar facultades y datos del usuario
		const loadData = async () => {
			try {
				const token = localStorage.getItem('accessToken');
				if (!token) {
					navigate('/login');
					return;
				}

				// Obtener datos del usuario actual
				const userResponse = await api.get('/auth/me');
				const userData = userResponse.data;
				console.log('User data:', userData);

				// Si ya tiene perfil completo, redirigir
				if (userData.student?.programId) {
					const userRole = userData.user.roles[0];
					if (userRole === 'ADMIN' || userRole === 'DEAN') {
						navigate('/admin-dashboard');
					} else {
						navigate('/student-dashboard');
					}
					return;
				}

				// Establecer displayName por defecto
				setDisplayName(userData.user.displayName || '');

				// Cargar facultades
				console.log('Loading faculties...');
				const facultiesResponse = await facultyApi.getAll();
				console.log('Faculties response:', facultiesResponse);
				console.log('Is array?', Array.isArray(facultiesResponse));
				console.log('Type:', typeof facultiesResponse);

				// Asegurarse de que facultiesData sea un array
				if (Array.isArray(facultiesResponse)) {
					setFaculties(facultiesResponse);
					console.log('Set faculties:', facultiesResponse.length, 'items');
				} else {
					console.error(
						'Faculties response is not an array:',
						facultiesResponse,
					);
					setError(
						'Error: Los datos de facultades no tienen el formato correcto.',
					);
				}
			} catch (err: unknown) {
				console.error('Error loading data:', err);
				const error = err as { response?: { data?: { message?: string } } };
				console.error('Error details:', error.response?.data);
				setError(
					error.response?.data?.message ||
						'Error al cargar datos. Por favor intenta de nuevo.',
				);
			} finally {
				setIsLoadingData(false);
			}
		};

		loadData();
	}, [navigate]);

	useEffect(() => {
		// Cargar programas cuando se selecciona una facultad
		const loadPrograms = async () => {
			if (!selectedFaculty) {
				setPrograms([]);
				return;
			}

			try {
				const programsData = await facultyApi.getPrograms(selectedFaculty);
				console.log('Programs data:', programsData);
				// Asegurarse de que programsData sea un array
				setPrograms(Array.isArray(programsData) ? programsData : []);
			} catch (err) {
				console.error('Error loading programs:', err);
				setError('Error al cargar programas.');
			}
		};

		loadPrograms();
	}, [selectedFaculty]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		try {
			console.log('Submitting profile with:', {
				displayName,
				programId: selectedProgram,
			});

			// Actualizar el perfil del usuario
			const response = await api.put('/students/complete-profile', {
				displayName,
				programId: selectedProgram,
			});

			console.log('Profile completed successfully:', response.data);

			// Verificar que el perfil se completó correctamente
			const verifyResponse = await api.get('/auth/me');
			console.log('Verification response:', verifyResponse.data);

			if (verifyResponse.data.student?.programId) {
				// Perfil completado exitosamente, redirigir al dashboard
				console.log('Profile verified, redirecting to dashboard...');
				navigate('/student-dashboard');
			} else {
				console.error('Profile not completed properly:', verifyResponse.data);
				setError(
					'El perfil se guardó pero no se pudo verificar. Por favor intenta refrescar la página.',
				);
			}
		} catch (err: unknown) {
			console.error('Error completing profile:', err);
			const error = err as {
				response?: { data?: { message?: string } };
				message?: string;
			};
			console.error('Error details:', error.response?.data);

			let errorMessage =
				'Error al completar perfil. Por favor intenta de nuevo.';

			if (error.response?.data?.message) {
				errorMessage = error.response.data.message;
			} else if (error.message) {
				errorMessage = error.message;
			}

			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoadingData) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-content3 to-content1 p-4">
				<Card className="w-full max-w-md">
					<CardBody className="flex items-center justify-center p-8">
						<p className="text-default-600">Cargando...</p>
					</CardBody>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-content3 to-content1 p-4">
			<Card className="w-full max-w-md bg-content4 shadow-medium">
				<CardHeader className="flex flex-col items-center pb-2 mt-5">
					<h1 className="text-2xl font-medium text-default-900 mb-2">
						Completa tu Perfil
					</h1>
					<p className="text-default-600 text-center">
						Por favor completa la siguiente información para continuar
					</p>
				</CardHeader>

				<CardBody className="space-y-5 px-5 pb-8">
					{error && (
						<Alert color="danger" title="Error" variant="faded">
							{error}
						</Alert>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<Input
							type="text"
							label="Nombre a Mostrar"
							placeholder="Tu nombre completo"
							value={displayName}
							onChange={(e) => setDisplayName(e.target.value)}
							isRequired
							size="lg"
							color="primary"
							variant="bordered"
							className="w-full"
						/>

						<Select
							label="Facultad"
							placeholder="Selecciona tu facultad"
							selectedKeys={selectedFaculty ? [selectedFaculty] : []}
							onSelectionChange={(keys) => {
								const value = Array.from(keys)[0] as string;
								setSelectedFaculty(value || '');
								setSelectedProgram(''); // Reset program when faculty changes
							}}
							isRequired
							size="lg"
							color="primary"
							variant="bordered"
							className="w-full"
							isDisabled={!Array.isArray(faculties) || faculties.length === 0}
						>
							{Array.isArray(faculties) && faculties.length > 0 ? (
								faculties.map((faculty) => (
									<SelectItem key={faculty._id}>{faculty.name}</SelectItem>
								))
							) : (
								<SelectItem key="no-faculties">
									No hay facultades disponibles
								</SelectItem>
							)}
						</Select>

						<Select
							label="Programa Académico"
							placeholder="Selecciona tu programa"
							selectedKeys={selectedProgram ? [selectedProgram] : []}
							onSelectionChange={(keys) => {
								const value = Array.from(keys)[0] as string;
								setSelectedProgram(value || '');
							}}
							isRequired
							isDisabled={
								!selectedFaculty ||
								!Array.isArray(programs) ||
								programs.length === 0
							}
							size="lg"
							color="primary"
							variant="bordered"
							className="w-full"
						>
							{Array.isArray(programs) && programs.length > 0 ? (
								programs.map((program) => (
									<SelectItem key={program._id}>{program.name}</SelectItem>
								))
							) : (
								<SelectItem key="no-programs">
									{!selectedFaculty
										? 'Selecciona primero una facultad'
										: 'No hay programas disponibles'}
								</SelectItem>
							)}
						</Select>

						<Button
							type="submit"
							color="primary"
							size="lg"
							className="w-full mt-6"
							isLoading={isLoading}
							isDisabled={
								isLoading ||
								!displayName ||
								!selectedFaculty ||
								!selectedProgram
							}
						>
							{isLoading ? 'Guardando...' : 'Completar Perfil'}
						</Button>
					</form>
				</CardBody>
			</Card>
		</div>
	);
}
