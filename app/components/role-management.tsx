import {
	Alert,
	Button,
	Chip,
	Input,
	Select,
	SelectItem,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { mockUsers } from '../lib/api';

// Los tres tipos de roles que puede tener un usuario
// Mapeo de roles
const ROLES = [
	{ label: 'Estudiante', value: 'STUDENT' },
	{ label: 'Decanatura', value: 'DEAN' },
	{ label: 'Administrador', value: 'ADMIN' },
];

// Función para obtener el label en español del rol
const getRoleLabel = (roleValue: string) => {
	const role = ROLES.find((r) => r.value === roleValue);
	return role ? role.label : roleValue;
};

interface User {
	id: string;
	name: string;
	email: string;
	role: string;
}

// Componente para manejar los roles de los usuarios
// Permite ver todos los usuarios, buscarlos y cambiar sus roles
export function RoleManagement() {
	const [selectedUser, setSelectedUser] = useState<string>(''); // Usuario seleccionado para cambiar rol
	const [newRole, setNewRole] = useState<string>(''); // Nuevo rol a asignar
	const [success, setSuccess] = useState<{ user: string; role: string } | null>(
		null,
	); // Mensaje de éxito
	const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda

	const queryClient = useQueryClient();

	// Query para obtener la lista de usuarios
	// En producción esto haría una llamada real al backend
	const { data: users = [], isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: async () => {
			await new Promise((resolve) => setTimeout(resolve, 500));
			return mockUsers;
		},
	});

	// Mutación para actualizar el rol de un usuario
	const updateRole = useMutation({
		mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
			// delay simulado
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const user = mockUsers.find((u) => u.id === userId);
			if (!user) throw new Error('Usuario no encontrado');
			console.log('Sending to backend:', { userId, role });
			return { name: user.name, role };
		},
		onSuccess: (data) => {
			setSuccess({ user: data.name, role: getRoleLabel(data.role) });
			queryClient.invalidateQueries({ queryKey: ['users'] });
			setSelectedUser('');
			setNewRole('');
		},
	});

	// Filtrar usuarios
	const filteredUsers = users.filter(
		(user: User) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Asigna colores diferentes a cada rol
	const getRoleColor = (role: string) => {
		switch (role) {
			case 'ADMIN':
			case 'administrador':
				return 'danger'; // Rojo para admin
			case 'DEAN':
			case 'decanatura':
				return 'warning'; // Amarillo para decanatura
			case 'STUDENT':
			case 'estudiante':
				return 'primary'; // Azul para estudiante
			default:
				return 'default';
		}
	};

	// Maneja la actualización del rol cuando se hace clic en Asignar
	const handleRoleUpdate = () => {
		if (selectedUser && newRole) {
			updateRole.mutate({ userId: selectedUser, role: newRole });
		}
	};

	return (
		<div className="space-y-6">
			{success && (
				<Alert color="success" title="Rol actualizado exitosamente">
					<span className="text-base">
						Usuario: <strong>{success.user}</strong> | Nuevo rol:{' '}
						<strong>{success.role}</strong>
					</span>
				</Alert>
			)}

			<div className="flex gap-4 items-end">
				<Input
					label="Buscar usuario"
					labelPlacement="outside"
					placeholder="Nombre o correo..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-1"
					size="lg"
					classNames={{
						label: 'text-base font-semibold text-default-900',
						input: 'text-base',
					}}
				/>
			</div>

			<Table
				aria-label="Tabla de usuarios"
				classNames={{
					th: 'text-sm font-bold',
					td: 'text-base',
				}}
			>
				<TableHeader>
					<TableColumn>NOMBRE</TableColumn>
					<TableColumn>CORREO</TableColumn>
					<TableColumn>ROL ACTUAL</TableColumn>
					<TableColumn>ACCIONES</TableColumn>
				</TableHeader>
				<TableBody isLoading={isLoading}>
					{filteredUsers.map((user: User) => (
						<TableRow key={user.id}>
							<TableCell>{user.name}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								<Chip color={getRoleColor(user.role)} variant="flat">
									{getRoleLabel(user.role)}
								</Chip>
							</TableCell>
							<TableCell>
								<Button
									size="sm"
									variant="light"
									onPress={() => setSelectedUser(user.id)}
								>
									Cambiar rol
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			{/* Panel que aparece cuando se selecciona un usuario para cambiar su rol */}
			{selectedUser && (
				<div className="bg-default-100 p-5 rounded-lg space-y-4">
					<h3 className="font-bold text-lg text-default-900">
						Asignar nuevo rol
					</h3>
					<div className="flex gap-4 items-end">
						<Select
							label="Nuevo rol"
							labelPlacement="outside"
							placeholder="Selecciona un rol"
							selectedKeys={newRole ? [newRole] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								setNewRole(selected);
							}}
							className="flex-1"
							size="lg"
							classNames={{
								label: 'text-base font-semibold text-default-900',
								value: 'text-base',
							}}
						>
							{ROLES.map((role) => (
								<SelectItem key={role.value}>{role.label}</SelectItem>
							))}
						</Select>
						<Button
							color="primary"
							size="lg"
							onPress={handleRoleUpdate}
							isLoading={updateRole.isPending}
							isDisabled={!newRole}
						>
							Asignar
						</Button>
						<Button
							variant="light"
							size="lg"
							onPress={() => {
								setSelectedUser('');
								setNewRole('');
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			)}

			{updateRole.error && (
				<Alert color="danger" title="Error al actualizar rol">
					<span className="text-base">{updateRole.error.message}</span>
				</Alert>
			)}
		</div>
	);
}
