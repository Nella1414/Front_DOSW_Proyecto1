import {
	Card,
	CardBody,
	CardHeader,
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Input,
	Chip
} from '@heroui/react';
import { useState } from 'react';

interface Student {
	id: string;
	name: string;
	email: string;
	code: string;
	program: string;
	status: 'activo' | 'inactivo' | 'graduado';
}

const mockStudents: Student[] = [
	{
		id: '1',
		name: 'Juan Pérez García',
		email: 'juan.perez@escuelaing.edu.co',
		code: '1234567890',
		program: 'Ingeniería de Sistemas',
		status: 'activo'
	},
	{
		id: '2',
		name: 'María González López',
		email: 'maria.gonzalez@escuelaing.edu.co',
		code: '1234567891',
		program: 'Ingeniería Civil',
		status: 'activo'
	},
	{
		id: '3',
		name: 'Carlos Rodríguez Silva',
		email: 'carlos.rodriguez@escuelaing.edu.co',
		code: '1234567892',
		program: 'Ingeniería de Sistemas',
		status: 'activo'
	},
	{
		id: '4',
		name: 'Ana Martínez Torres',
		email: 'ana.martinez@escuelaing.edu.co',
		code: '1234567893',
		program: 'Ingeniería Biomédica',
		status: 'graduado'
	}
];

interface StudentSelectorProps {
	onSelectStudent: (student: Student) => void;
}

export function StudentSelector({ onSelectStudent }: StudentSelectorProps) {
	const [searchTerm, setSearchTerm] = useState('');

	const filteredStudents = mockStudents.filter(student =>
		student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
		student.code.includes(searchTerm)
	);

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'activo': return 'success';
			case 'inactivo': return 'warning';
			case 'graduado': return 'primary';
			default: return 'default';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'activo': return 'Activo';
			case 'inactivo': return 'Inactivo';
			case 'graduado': return 'Graduado';
			default: return status;
		}
	};

	return (
		<Card>
			<CardHeader>
				<div className="w-full">
					<h3 className="text-lg font-semibold mb-2">Seleccionar Estudiante</h3>
					<p className="text-sm text-default-600 mb-4">
						Selecciona un estudiante para ver su progreso académico
					</p>
					<Input
						placeholder="Buscar por nombre, email o código..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="max-w-sm"
					/>
				</div>
			</CardHeader>
			<CardBody>
				<Table aria-label="Tabla de estudiantes">
					<TableHeader>
						<TableColumn>NOMBRE</TableColumn>
						<TableColumn>CÓDIGO</TableColumn>
						<TableColumn>PROGRAMA</TableColumn>
						<TableColumn>ESTADO</TableColumn>
						<TableColumn>ACCIONES</TableColumn>
					</TableHeader>
					<TableBody>
						{filteredStudents.map((student) => (
							<TableRow key={student.id}>
								<TableCell>
									<div>
										<p className="font-medium">{student.name}</p>
										<p className="text-xs text-default-500">{student.email}</p>
									</div>
								</TableCell>
								<TableCell>{student.code}</TableCell>
								<TableCell>{student.program}</TableCell>
								<TableCell>
									<Chip color={getStatusColor(student.status)} variant="flat" size="sm">
										{getStatusLabel(student.status)}
									</Chip>
								</TableCell>
								<TableCell>
									<Button
										size="sm"
										color="primary"
										variant="flat"
										onPress={() => onSelectStudent(student)}
									>
										Ver Progreso
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	);
}