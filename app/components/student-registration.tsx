import { Alert, Button, Input, Select, SelectItem } from '@heroui/react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authApi, facultyApi } from '../lib/api';

interface StudentData {
	email: string;
	password: string;
	name: string;
	displayName: string;
	programId: string;
}

interface Program {
	_id?: string;
	id?: string;
	name: string;
}

// Componente para registrar nuevos estudiantes
export function StudentRegistration() {
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();

	// Obtener lista de programas desde el backend
	const { data: programs = [], isLoading: programsLoading } = useQuery({
		queryKey: ['programs'],
		queryFn: async () => {
			try {
				const response = await facultyApi.getPrograms('');
				return response;
			} catch (err) {
				console.error('Error loading programs:', err);
				return [];
			}
		},
	});

	// Mutación para registrar el estudiante
	const registerStudent = useMutation({
		mutationFn: async (data: StudentData) => {
			return await authApi.register(data);
		},
		onSuccess: () => {
			// Redirigir al login después del registro exitoso
			navigate('/login');
		},
		onError: (err: unknown) => {
			console.error('Registration error:', err);
			const error = err as {
				response?: { data?: { message?: string | string[] } };
			};
			const errorMessage =
				error.response?.data?.message || 'Error al registrar el estudiante';
			setError(
				Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage,
			);
		},
	});

	// Configuración del formulario
	const form = useForm({
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			name: '',
			displayName: '',
			programId: '',
		},
		onSubmit: async ({ value }) => {
			setError(null);

			// Validar que las contraseñas coincidan
			if (value.password !== value.confirmPassword) {
				setError('Las contraseñas no coinciden');
				return;
			}

			// Enviar datos al backend
			// biome-ignore lint/correctness/noUnusedVariables: confirmPassword is used for validation but not sent to backend
			const { confirmPassword, ...registerData } = value;
			registerStudent.mutate(registerData);
		},
	});

	return (
		<div className="space-y-6">
			{error && (
				<Alert color="danger" title="Error en el registro">
					{error}
				</Alert>
			)}

			{registerStudent.isSuccess && (
				<Alert color="success" title="Registro exitoso">
					Tu cuenta ha sido creada. Redirigiendo al login...
				</Alert>
			)}

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				{/* Campo de email */}
				<form.Field
					name="email"
					validators={{
						onChange: ({ value }) => {
							if (!value) return 'Correo requerido';
							const emailRegex =
								/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
							if (!emailRegex.test(value)) return 'Formato de email inválido';
						},
					}}
				>
					{(field) => (
						<Input
							label="Correo Electrónico"
							placeholder="juan.perez@escuelaing.edu.co"
							type="email"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							isInvalid={!!field.state.meta.errors.length}
							errorMessage={field.state.meta.errors[0]}
							isRequired
						/>
					)}
				</form.Field>

				{/* Campo de contraseña */}
				<form.Field
					name="password"
					validators={{
						onChange: ({ value }) => {
							if (!value) return 'Contraseña requerida';
							if (value.length < 6) return 'Debe tener al menos 6 caracteres';
						},
					}}
				>
					{(field) => (
						<Input
							label="Contraseña"
							placeholder="••••••••"
							type="password"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							isInvalid={!!field.state.meta.errors.length}
							errorMessage={field.state.meta.errors[0]}
							isRequired
						/>
					)}
				</form.Field>

				{/* Confirmar contraseña */}
				<form.Field
					name="confirmPassword"
					validators={{
						onChange: ({ value }) => {
							if (!value) return 'Confirma tu contraseña';
						},
					}}
				>
					{(field) => (
						<Input
							label="Confirmar Contraseña"
							placeholder="••••••••"
							type="password"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							isInvalid={!!field.state.meta.errors.length}
							errorMessage={field.state.meta.errors[0]}
							isRequired
						/>
					)}
				</form.Field>

				{/* Nombre completo */}
				<form.Field
					name="name"
					validators={{
						onChange: ({ value }) => {
							if (!value) return 'Nombre requerido';
							if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
								return 'Solo letras y espacios';
							if (value.length < 3) return 'Debe tener al menos 3 caracteres';
						},
					}}
				>
					{(field) => (
						<Input
							label="Nombre Completo"
							placeholder="Juan Pérez García"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							isInvalid={!!field.state.meta.errors.length}
							errorMessage={field.state.meta.errors[0]}
							isRequired
						/>
					)}
				</form.Field>

				{/* Nombre para mostrar */}
				<form.Field
					name="displayName"
					validators={{
						onChange: ({ value }) => {
							if (!value) return 'Nombre para mostrar requerido';
							if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
								return 'Solo letras y espacios';
						},
					}}
				>
					{(field) => (
						<Input
							label="Nombre para Mostrar"
							placeholder="Juan Pérez"
							value={field.state.value}
							onChange={(e) => field.handleChange(e.target.value)}
							isInvalid={!!field.state.meta.errors.length}
							errorMessage={field.state.meta.errors[0]}
							isRequired
						/>
					)}
				</form.Field>

				{/* Select de programa académico */}
				<form.Field
					name="programId"
					validators={{
						onChange: ({ value }) => {
							if (!value) return 'Programa académico requerido';
						},
					}}
				>
					{(field) => (
						<Select
							label="Programa Académico"
							placeholder={
								programsLoading
									? 'Cargando programas...'
									: 'Selecciona tu programa'
							}
							selectedKeys={field.state.value ? [field.state.value] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								field.handleChange(selected);
							}}
							isInvalid={!!field.state.meta.errors.length}
							errorMessage={field.state.meta.errors[0]}
							isRequired
							isDisabled={programsLoading}
						>
							{programs.map((program: Program) => (
								<SelectItem
									className="text-default-900"
									key={program._id || program.id}
								>
									{program.name}
								</SelectItem>
							))}
						</Select>
					)}
				</form.Field>

				{/* Botón de Google para registro */}
				<div className="flex items-center gap-3">
					<div className="flex-1 border-t border-default-200" />
					<span className="text-small text-default-400">O regístrate con</span>
					<div className="flex-1 border-t border-default-200" />
				</div>

				<Button
					onClick={() => authApi.googleLogin()}
					variant="bordered"
					size="lg"
					className="w-full"
					startContent={
						<svg
							className="w-5 h-5"
							viewBox="0 0 24 24"
							aria-label="Google logo"
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
					Continuar con Google
				</Button>

				{/* Botón de registro */}
				<Button
					type="submit"
					color="primary"
					size="lg"
					className="w-full"
					isLoading={registerStudent.isPending}
					isDisabled={registerStudent.isPending}
				>
					{registerStudent.isPending ? 'Registrando...' : 'Registrarse'}
				</Button>
			</form>
		</div>
	);
}
