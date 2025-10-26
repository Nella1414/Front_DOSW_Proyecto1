import { Alert, Card, CardBody, Chip, Divider, Spinner } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '../lib/api';

interface Subject {
	code: string;
	name: string;
	credits: number;
	status: 'aprobada' | 'en_progreso' | 'reprobada' | 'pendiente';
	grade?: number;
	semester?: number;
}

interface BackendCourse {
	courseCode: string;
	courseName: string;
	credits: number;
	grade?: number;
	semester?: number;
}

interface BackendData {
	studentInfo?: {
		currentSemester?: number;
		gpa?: number;
		totalCredits?: number;
		passedCredits?: number;
	};
	courseStatuses?: {
		passedCourses?: BackendCourse[];
		currentCourses?: BackendCourse[];
		failedCourses?: BackendCourse[];
	};
}

function transformBackendToSubjects(data: BackendData): Subject[] {
	const subjects: Subject[] = [];

	// Add passed courses
	if (data.courseStatuses?.passedCourses) {
		data.courseStatuses.passedCourses.forEach((course) => {
			subjects.push({
				code: course.courseCode,
				name: course.courseName,
				credits: course.credits,
				status: 'aprobada',
				grade: course.grade,
				semester: course.semester,
			});
		});
	}

	// Add current courses
	if (data.courseStatuses?.currentCourses) {
		data.courseStatuses.currentCourses.forEach((course) => {
			subjects.push({
				code: course.courseCode,
				name: course.courseName,
				credits: course.credits,
				status: 'en_progreso',
				semester: course.semester,
			});
		});
	}

	// Add failed courses
	if (data.courseStatuses?.failedCourses) {
		data.courseStatuses.failedCourses.forEach((course) => {
			subjects.push({
				code: course.courseCode,
				name: course.courseName,
				credits: course.credits,
				status: 'reprobada',
				grade: course.grade,
				semester: course.semester,
			});
		});
	}

	return subjects;
}

function getStatusColor(
	status: string,
): 'success' | 'primary' | 'danger' | 'default' {
	switch (status) {
		case 'aprobada':
			return 'success';
		case 'en_progreso':
			return 'primary'; // Azul brillante
		case 'reprobada':
			return 'danger';
		default:
			return 'default';
	}
}

function getStatusLabel(status: string): string {
	switch (status) {
		case 'aprobada':
			return 'Aprobada';
		case 'en_progreso':
			return 'En Progreso';
		case 'reprobada':
			return 'Reprobada';
		default:
			return 'Pendiente';
	}
}

export function AcademicGrid() {
	const {
		data: backendData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['academic-progress-grid'],
		queryFn: studentApi.getAcademicProgress,
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<Spinner size="lg" color="primary" />
				<p className="ml-4 text-default-600">Cargando plan académico...</p>
			</div>
		);
	}

	if (error) {
		return (
			<Alert color="danger" title="Error">
				No se pudo cargar el plan académico. Por favor, intenta de nuevo.
			</Alert>
		);
	}

	const subjects = transformBackendToSubjects(backendData as BackendData);
	const currentSemester =
		(backendData as BackendData)?.studentInfo?.currentSemester || 1;

	// Group by semester
	const subjectsBySemester = new Map<number, Subject[]>();
	subjects.forEach((subject) => {
		const sem = subject.semester || currentSemester;
		if (!subjectsBySemester.has(sem)) {
			subjectsBySemester.set(sem, []);
		}
		subjectsBySemester.get(sem)?.push(subject);
	});

	// Determine max semester to show
	const _maxSemester = Math.max(
		currentSemester,
		...Array.from(subjectsBySemester.keys()),
	);
	const totalSemesters = 10; // Systems Engineering program

	return (
		<div className="space-y-6">
			<Card>
				<CardBody>
					<h2 className="text-xl font-bold mb-4">Plan Académico</h2>
					<div className="grid grid-cols-1 gap-1">
						{Array.from({ length: totalSemesters }, (_, i) => i + 1).map(
							(semester) => {
								const semesterSubjects = subjectsBySemester.get(semester) || [];
								const totalCredits = semesterSubjects.reduce(
									(sum, s) => sum + s.credits,
									0,
								);

								return (
									<div key={semester}>
										<div className="bg-primary-50 p-3 rounded-lg">
											<div className="flex justify-between items-center">
												<h3 className="font-semibold text-primary-700">
													Semestre {semester}
												</h3>
												<div className="flex items-center gap-2">
													{semester === currentSemester && (
														<Chip color="primary" size="sm" variant="flat">
															Actual
														</Chip>
													)}
													<span className="text-sm text-primary-600">
														{totalCredits} créditos
													</span>
												</div>
											</div>
										</div>

										{semesterSubjects.length > 0 ? (
											<div className="pl-4 space-y-2 mt-2 mb-4">
												{semesterSubjects.map((subject, idx) => (
													<div
														key={`${subject.code}-${idx}`}
														className="flex justify-between items-center py-2 px-4 bg-default-50 rounded-md hover:bg-default-100 transition-colors"
													>
														<div className="flex-1">
															<p className="font-medium text-sm">
																{subject.name}
															</p>
															<p className="text-xs text-default-500">
																{subject.code} • {subject.credits} créditos
															</p>
														</div>
														<div className="flex items-center gap-3">
															{subject.grade !== undefined && (
																<Chip size="sm" color="default" variant="flat">
																	{subject.grade.toFixed(1)}
																</Chip>
															)}
															{subject.status === 'en_progreso' ? (
																<Chip
																	size="sm"
																	variant="flat"
																	style={{
																		backgroundColor: '#E6F1FE',
																		color: '#006FEE',
																		borderColor: '#9BCCFB',
																	}}
																>
																	{getStatusLabel(subject.status)}
																</Chip>
															) : (
																<Chip
																	color={getStatusColor(subject.status)}
																	size="sm"
																	variant="flat"
																>
																	{getStatusLabel(subject.status)}
																</Chip>
															)}
														</div>
													</div>
												))}
											</div>
										) : (
											<div className="pl-4 py-3 text-sm text-default-400">
												{semester > currentSemester
													? 'Materias pendientes'
													: 'Sin materias registradas'}
											</div>
										)}
										{semester < totalSemesters && <Divider className="my-2" />}
									</div>
								);
							},
						)}
					</div>
				</CardBody>
			</Card>
		</div>
	);
}
