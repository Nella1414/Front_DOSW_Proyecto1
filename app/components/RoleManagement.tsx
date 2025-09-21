import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem, Button, Alert, Chip, Input } from '@heroui/react';
import { mockUsers } from '../lib/api';

// Los tres tipos de roles que puede tener un usuario
const ROLES = ['estudiante', 'decanatura', 'administrador'];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Componente para manejar los roles de los usuarios
// Permite ver todos los usuarios, buscarlos y cambiar sus roles
export function RoleManagement() {
  const [selectedUser, setSelectedUser] = useState<string>('');  // Usuario seleccionado para cambiar rol
  const [newRole, setNewRole] = useState<string>('');           // Nuevo rol a asignar
  const [success, setSuccess] = useState<{ user: string; role: string } | null>(null);  // Mensaje de éxito
  const [searchTerm, setSearchTerm] = useState('');             // Término de búsqueda

  const queryClient = useQueryClient();

  // Query para obtener la lista de usuarios
  // En producción esto haría una llamada real al backend
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      // Simula delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUsers;
    }
  });

  // Mutación para actualizar el rol de un usuario
  const updateRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // Simula delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      const user = mockUsers.find(u => u.id === userId);
      if (!user) throw new Error('Usuario no encontrado');
      return { name: user.name, role };
    },
    onSuccess: (data) => {
      // Cuando se actualiza exitosamente, muestra mensaje y refresca la lista
      setSuccess({ user: data.name, role: data.role });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSelectedUser('');
      setNewRole('');
    }
  });

  // Filtra usuarios basado en el término de búsqueda (nombre o email)
  const filteredUsers = users.filter((user: User) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Asigna colores diferentes a cada tipo de rol para el Chip
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'administrador': return 'danger';   // Rojo para admin
      case 'decanatura': return 'warning';     // Amarillo para decanatura
      case 'estudiante': return 'primary';     // Azul para estudiante
      default: return 'default';
    }
  };

  // Maneja la actualización del rol cuando se hace clic en "Asignar"
  const handleRoleUpdate = () => {
    if (selectedUser && newRole) {
      updateRole.mutate({ userId: selectedUser, role: newRole });
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <Alert color="success" title="Rol actualizado exitosamente">
          Usuario: {success.user} | Nuevo rol: {success.role}
        </Alert>
      )}

      <div className="flex gap-4 items-end">
        <Input
          label="Buscar usuario"
          placeholder="Nombre o correo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      <Table aria-label="Tabla de usuarios">
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
                  {user.role}
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

      {/* Panel que aparece cuando seleccionas un usuario para cambiar su rol */}
      {selectedUser && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <h3 className="font-semibold">Asignar nuevo rol</h3>
          <div className="flex gap-4 items-end">
            <Select
              label="Nuevo rol"
              placeholder="Selecciona un rol"
              selectedKeys={newRole ? [newRole] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                setNewRole(selected);
              }}
              className="flex-1"
            >
              {ROLES.map((role) => (
                <SelectItem key={role}>
                  {role}
                </SelectItem>
              ))}
            </Select>
            <Button
              color="primary"
              onPress={handleRoleUpdate}
              isLoading={updateRole.isPending}
              isDisabled={!newRole}
            >
              Asignar
            </Button>
            <Button
              variant="light"
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
          {updateRole.error.message}
        </Alert>
      )}
    </div>
  );
}