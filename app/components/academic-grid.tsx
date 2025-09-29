import { Card, CardBody, Chip, Divider } from '@heroui/react';

interface Subject {
	id: string;
	name: string;
	credits: number;
	status: 'aprobada' | 'pendiente' | 'en_progreso';
	grade?: number;
	semester: number;
}

// Materias organizadas por semestre
const subjectsBySemester: Subject[] = [
	// Semestre 1
	{ id: '1', name: 'Matemáticas Básicas', credits: 4, status: 'aprobada', grade: 4.1, semester: 1 },
	{ id: '2', name: 'Introducción a la Programación', credits: 4, status: 'aprobada', grade: 4.5, semester: 1 },
	{ id: '3', name: 'Física Básica', credits: 4, status: 'aprobada', grade: 3.6, semester: 1 },
	{ id: '4', name: 'Fundamentos de la Comunicación 1', credits: 2, status: 'aprobada', grade: 4.0, semester: 1 },
	{ id: '5', name: 'Proyecto Integrador 1', credits: 2, status: 'aprobada', grade: 4.3, semester: 1 },

	// Semestre 2
	{ id: '6', name: 'Cálculo Diferencial', credits: 4, status: 'aprobada', grade: 3.8, semester: 2 },
	{ id: '7', name: 'Desarrollo Orientado por Objetos', credits: 4, status: 'aprobada', grade: 4.2, semester: 2 },
	{ id: '8', name: 'Física 1', credits: 4, status: 'aprobada', grade: 3.8, semester: 2 },
	{ id: '9', name: 'Lógica y Matemáticas Discretas', credits: 3, status: 'aprobada', grade: 4.0, semester: 2 },
	{ id: '10', name: 'Colombia: Realidad, Instituciones Políticas y Paz', credits: 2, status: 'aprobada', grade: 3.8, semester: 2 },

	// Semestre 3
	{ id: '11', name: 'Cálculo Integral', credits: 4, status: 'aprobada', grade: 4.0, semester: 3 },
	{ id: '12', name: 'Diseño de Datos y Algoritmos', credits: 4, status: 'aprobada', grade: 4.0, semester: 3 },
	{ id: '13', name: 'Física 2', credits: 4, status: 'aprobada', grade: 3.5, semester: 3 },
	{ id: '14', name: 'Matemáticas para Informática', credits: 3, status: 'aprobada', grade: 4.3, semester: 3 },
	{ id: '15', name: 'Historia y Geografía de Colombia', credits: 2, status: 'aprobada', grade: 3.9, semester: 3 },

	// Semestre 4
	{ id: '16', name: 'Cálculo Vectorial', credits: 4, status: 'aprobada', grade: 3.9, semester: 4 },
	{ id: '17', name: 'Teoría de la Programación y la Computación', credits: 3, status: 'aprobada', grade: 3.9, semester: 4 },
	{ id: '18', name: 'Organización de los Sistemas de Cómputo', credits: 3, status: 'aprobada', grade: 3.7, semester: 4 },
	{ id: '19', name: 'Álgebra Lineal', credits: 3, status: 'aprobada', grade: 4.2, semester: 4 },
	{ id: '20', name: 'Fundamentos Económicos', credits: 3, status: 'aprobada', grade: 3.6, semester: 4 },

	// Semestre 5
	{ id: '21', name: 'Ecuaciones Diferenciales', credits: 3, status: 'aprobada', grade: 3.7, semester: 5 },
	{ id: '22', name: 'Modelos y Servicios de Datos', credits: 4, status: 'aprobada', grade: 4.1, semester: 5 },
	{ id: '23', name: 'Arquitectura y Servicios de Red', credits: 3, status: 'en_progreso', semester: 5 },
	{ id: '24', name: 'Fundamentos de Proyectos', credits: 3, status: 'aprobada', grade: 4.1, semester: 5 },
	{ id: '25', name: 'CLE 1', credits: 2, status: 'aprobada', grade: 4.0, semester: 5 },

	// Semestre 6
	{ id: '26', name: 'Probabilidad y Estadística', credits: 3, status: 'en_progreso', semester: 6 },
	{ id: '27', name: 'Desarrollo y Operaciones Software', credits: 4, status: 'en_progreso', semester: 6 },
	{ id: '28', name: 'Fundamentos de Seguridad de la Información', credits: 3, status: 'en_progreso', semester: 6 },
	{ id: '29', name: 'Proyecto Integrador 2', credits: 3, status: 'pendiente', semester: 6 },
	{ id: '30', name: 'CLE 2', credits: 2, status: 'aprobada', grade: 3.8, semester: 6 },

	// Semestre 7
	{ id: '31', name: 'Arquitecturas de Software', credits: 4, status: 'pendiente', semester: 7 },
	{ id: '32', name: 'Principios y Tecnologías de Inteligencia Artificial', credits: 4, status: 'pendiente', semester: 7 },
	{ id: '33', name: 'Electiva Técnica 1', credits: 3, status: 'pendiente', semester: 7 },
	{ id: '34', name: 'CLE 3', credits: 2, status: 'pendiente', semester: 7 },

	// Semestre 8
	{ id: '35', name: 'Transformación Digital y Soluciones Empresariales', credits: 3, status: 'pendiente', semester: 8 },
	{ id: '36', name: 'Electiva Técnica 2', credits: 3, status: 'pendiente', semester: 8 },
	{ id: '37', name: 'Electiva Técnica 3', credits: 3, status: 'pendiente', semester: 8 },
	{ id: '38', name: 'Proyecto Integrador 3', credits: 3, status: 'pendiente', semester: 8 },

	// Semestre 9
	{ id: '39', name: 'Seminario de Opción de Grado', credits: 2, status: 'pendiente', semester: 9 },
	{ id: '40', name: 'Opción de Grado 1', credits: 3, status: 'pendiente', semester: 9 },
	{ id: '41', name: 'Opción de Grado 2', credits: 3, status: 'pendiente', semester: 9 },

	// Semestre 10
	{ id: '42', name: 'Opción de Grado 3', credits: 3, status: 'pendiente', semester: 10 },
	{ id: '43', name: 'Opción de Grado 4', credits: 3, status: 'pendiente', semester: 10 },
];

export function AcademicGrid() {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'aprobada': return 'success';
			case 'en_progreso': return 'warning';
			case 'pendiente': return 'default';
			default: return 'default';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'aprobada': return 'Aprobada';
			case 'en_progreso': return 'En Progreso';
			case 'pendiente': return 'Pendiente';
			default: return status;
		}
	};

	// Agrupar materias por semestre
	const subjectsBySemesterGroup = subjectsBySemester.reduce((acc, subject) => {
		if (!acc[subject.semester]) {
			acc[subject.semester] = [];
		}
		acc[subject.semester].push(subject);
		return acc;
	}, {} as Record<number, Subject[]>);

	return (
		<div className="space-y-8">
			{Object.entries(subjectsBySemesterGroup)
				.sort(([a], [b]) => Number(a) - Number(b))
				.map(([semester, subjects]) => (
					<div key={semester}>
						<h3 className="text-lg font-semibold text-primary mb-4">
							Semestre {semester}
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{subjects.map((subject) => (
								<Card
									key={subject.id}
									className={`border-2 ${
										subject.status === 'aprobada' ? 'border-success bg-success-50' :
										subject.status === 'en_progreso' ? 'border-warning bg-warning-50' :
										'border-default-200 bg-default-50'
									}`}
									shadow="sm"
								>
									<CardBody className="p-4">
										<div className="flex justify-between items-start mb-3">
											<Chip
												color={getStatusColor(subject.status)}
												variant="flat"
												size="sm"
											>
												{getStatusLabel(subject.status)}
											</Chip>
											<span className="text-xs text-default-500 font-medium">
												{subject.credits} créditos
											</span>
										</div>
										<h4 className="text-sm font-semibold text-default-900 mb-2 leading-tight">
											{subject.name}
										</h4>
										{subject.grade && (
											<div className="flex justify-between items-center">
												<span className="text-xs text-default-600">Nota:</span>
												<span className="text-sm font-medium text-success">
													{subject.grade.toFixed(1)}
												</span>
											</div>
										)}
									</CardBody>
								</Card>
							))}
						</div>
						<Divider className="mt-6" />
					</div>
				))}
		</div>
	);
}