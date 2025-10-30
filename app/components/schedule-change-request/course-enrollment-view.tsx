import {
	Alert,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Select,
	SelectItem,
	Spinner,
} from '@heroui/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { api, enrollmentApi, studentApi } from '../../lib/api';

interface CourseGroup {
	groupId: string;
	courseCode: string;
	courseName: string;
	courseCredits: number;
	groupNumber: string;
	maxStudents: number;
	currentEnrollments: number;
	availableSpots: number;
	schedule: Array<{
		dayOfWeek: number;
		dayName: string;
		startTime: string;
		endTime: string;
		room?: string;
	}>;
	professorName?: string;
}

interface CourseInfo {
	_id: string;
	code: string;
	name: string;
	credits: number;
}

interface Enrollment {
	_id: string;
	groupId?: {
		_id: string;
		code: string;
		groupNumber: string;
		courseId?: {
			_id: string;
			code: string;
			name: string;
		};
	};
}

interface ErrorResponse {
	response?: {
		data?: {
			message?: string;
		};
	};
}

export const CourseEnrollmentView: React.FC = () => {
	const [selectedCourse, setSelectedCourse] = useState<string>('');
	const [selectedGroup, setSelectedGroup] = useState<string>('');
	const [error, setError] = useState<string>('');
	const queryClient = useQueryClient();

	// Fetch student profile to get student code
	const { data: studentProfile } = useQuery({
		queryKey: ['student-profile'],
		queryFn: studentApi.getProfile,
	});

	// Fetch student active enrollments (only ENROLLED status)
	const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
		queryKey: ['student-enrollments', studentProfile?.code],
		queryFn: async () => {
			if (!studentProfile?.code) return [];
			console.log(
				'[ENROLLMENTS] Fetching active enrollments for student:',
				studentProfile.code,
			);
			const response = await api.get(
				`/enrollments/student/${studentProfile.code}/active`,
			);
			console.log('[ENROLLMENTS] Active enrollments received:', response.data);
			return response.data;
		},
		enabled: !!studentProfile?.code,
	});

	// Fetch available course groups
	const {
		data: availableGroups,
		isLoading: groupsLoading,
		error: groupsError,
	} = useQuery<CourseGroup[]>({
		queryKey: ['available-groups'],
		queryFn: async () => {
			const response = await api.get('/course-groups/available');
			return response.data;
		},
	});

	// Enrollment mutation
	const enrollMutation = useMutation({
		mutationFn: async ({
			studentCode,
			groupId,
		}: {
			studentCode: string;
			groupId: string;
		}) => {
			const response = await api.post(
				`/enrollments/${studentCode}/enroll/${groupId}`,
			);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
			queryClient.invalidateQueries({ queryKey: ['available-groups'] });
			queryClient.invalidateQueries({ queryKey: ['student-schedule'] });
			setSelectedCourse('');
			setSelectedGroup('');
			setError('');
		},
		onError: (err: ErrorResponse) => {
			const errorMessage =
				err.response?.data?.message ||
				'Error al inscribir la materia. Por favor intenta de nuevo.';
			setError(errorMessage);
			console.error('[CourseEnrollment] Error:', errorMessage);
		},
	});

	// Unenrollment mutation
	const unenrollMutation = useMutation({
		mutationFn: async ({
			studentCode,
			groupId,
		}: {
			studentCode: string;
			groupId: string;
		}) => {
			return enrollmentApi.unenroll(studentCode, groupId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
			queryClient.invalidateQueries({ queryKey: ['available-groups'] });
			queryClient.invalidateQueries({ queryKey: ['student-schedule'] });
			setError('');
		},
		onError: (err: ErrorResponse) => {
			setError(
				err.response?.data?.message ||
					'Error al eliminar la inscripción. Por favor intenta de nuevo.',
			);
		},
	});

	// Get unique courses from available groups
	const uniqueCourses = React.useMemo(() => {
		if (!availableGroups) return [];
		const courseMap = new Map<string, CourseInfo>();
		availableGroups.forEach((group) => {
			const courseKey = group.courseCode;
			if (!courseMap.has(courseKey)) {
				courseMap.set(courseKey, {
					_id: courseKey,
					code: group.courseCode,
					name: group.courseName,
					credits: group.courseCredits,
				});
			}
		});
		return Array.from(courseMap.values());
	}, [availableGroups]);

	// Filter groups by selected course
	const filteredGroups = React.useMemo(() => {
		if (!availableGroups || !selectedCourse) return [];
		return availableGroups.filter(
			(group) => group.courseCode === selectedCourse,
		);
	}, [availableGroups, selectedCourse]);

	// Check if student is already enrolled in the selected course
	const isAlreadyEnrolled = React.useMemo(() => {
		if (!enrollments || !selectedCourse) return false;
		return (enrollments as Enrollment[]).some(
			(enrollment) => enrollment.groupId?.courseId?.code === selectedCourse,
		);
	}, [enrollments, selectedCourse]);

	// Check if selected group is full
	const selectedGroupData = React.useMemo(() => {
		if (!selectedGroup || !filteredGroups) return null;
		return filteredGroups.find((g) => g.groupId === selectedGroup);
	}, [selectedGroup, filteredGroups]);

	const isGroupFull =
		selectedGroupData &&
		selectedGroupData.currentEnrollments >= selectedGroupData.maxStudents;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!selectedCourse) {
			setError('Debes seleccionar una materia');
			return;
		}

		if (!selectedGroup) {
			setError('Debes seleccionar un grupo');
			return;
		}

		if (isAlreadyEnrolled) {
			setError('Ya estás inscrito en un grupo de esta materia');
			return;
		}

		if (isGroupFull) {
			setError('El grupo seleccionado está lleno');
			return;
		}

		if (!studentProfile?.code) {
			setError('No se pudo obtener tu código de estudiante');
			return;
		}

		enrollMutation.mutate({
			studentCode: studentProfile.code,
			groupId: selectedGroup,
		});
	};

	if (groupsLoading || enrollmentsLoading) {
		return (
			<Card>
				<CardBody className="flex items-center justify-center p-8">
					<Spinner size="lg" />
					<p className="mt-4 text-default-500">
						Cargando materias disponibles...
					</p>
				</CardBody>
			</Card>
		);
	}

	if (groupsError) {
		return (
			<Card>
				<CardBody>
					<Alert color="danger" title="Error">
						No se pudieron cargar las materias disponibles. Por favor intenta de
						nuevo.
					</Alert>
				</CardBody>
			</Card>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<div className="lg:col-span-2">
				<Card radius="sm" shadow="sm">
					<CardHeader className="flex-col items-start gap-1 pb-4">
						<div className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6 text-primary"
								role="img"
								aria-label="Inscripción de materia"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
								/>
							</svg>
							<h2 className="text-xl font-semibold">Inscripción de Materia</h2>
						</div>
						<p className="text-sm text-default-500">
							Inscribe una materia a tu horario del semestre actual
						</p>
					</CardHeader>
					<Divider />

					<CardBody className="space-y-6">
						<Card
							className="bg-primary-50 border border-primary-200"
							shadow="none"
						>
							<CardBody>
								<div className="flex gap-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
										role="img"
										aria-label="Información"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
										/>
									</svg>
									<div className="text-sm">
										<p className="font-semibold text-primary-700 mb-1">
											Importante:
										</p>
										<p className="text-primary-600">
											No puedes inscribir una materia que ya tengas inscrita en
											otro grupo. Tampoco puedes inscribirte en grupos que estén
											llenos. Las inscripciones son para el semestre actual.
										</p>
									</div>
								</div>
							</CardBody>
						</Card>

						{error && (
							<Alert color="danger" title="Error" className="mb-4">
								{error}
							</Alert>
						)}

						{enrollMutation.isSuccess && (
							<Alert color="success" title="¡Éxito!" className="mb-4">
								La materia ha sido inscrita correctamente a tu horario.
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-4">
								<div>
									<div className="text-sm font-medium mb-2">
										Materia <span className="text-danger">*</span>
									</div>
									<Select
										placeholder="Selecciona una materia"
										selectedKeys={selectedCourse ? [selectedCourse] : []}
										onSelectionChange={(keys) => {
											const value = Array.from(keys)[0] as string;
											setSelectedCourse(value);
											setSelectedGroup('');
											setError('');
										}}
										className="w-full"
									>
										{uniqueCourses.map((course) => (
											<SelectItem key={course._id}>
												{course.code} - {course.name} ({course.credits}{' '}
												créditos)
											</SelectItem>
										))}
									</Select>
									{isAlreadyEnrolled && (
										<p className="text-xs text-warning mt-1">
											Ya estás inscrito en un grupo de esta materia
										</p>
									)}
								</div>

								{selectedCourse && filteredGroups.length > 0 && (
									<>
										<Card
											className="bg-primary-50 border border-primary-100"
											shadow="none"
										>
											<CardBody>
												<h4 className="font-semibold text-sm mb-2 text-primary-700">
													Horarios Disponibles para esta Materia
												</h4>
												<div className="space-y-3">
													{filteredGroups.map((group) => (
														<div
															key={group.groupId}
															className="bg-white p-3 rounded-lg border border-primary-200"
														>
															<div className="flex justify-between items-start mb-2">
																<div>
																	<span className="font-semibold text-sm">
																		Grupo {group.groupNumber}
																	</span>
																	<span className="text-xs text-default-500 ml-2">
																		({group.currentEnrollments}/
																		{group.maxStudents} estudiantes)
																	</span>
																</div>
																<Chip
																	size="sm"
																	color={
																		group.currentEnrollments >=
																		group.maxStudents
																			? 'danger'
																			: 'success'
																	}
																	variant="flat"
																>
																	{group.currentEnrollments >= group.maxStudents
																		? 'Lleno'
																		: 'Disponible'}
																</Chip>
															</div>
															{group.schedule && group.schedule.length > 0 && (
																<div className="space-y-1">
																	<p className="text-xs font-medium text-default-600">
																		Horario:
																	</p>
																	<ul className="space-y-1">
																		{group.schedule.map((s) => (
																			<li
																				key={`${s.dayName}-${s.startTime}-${s.endTime}`}
																				className="text-xs text-default-700 flex items-center gap-2"
																			>
																				<span className="font-medium">
																					{s.dayName}:
																				</span>
																				<span>
																					{s.startTime} - {s.endTime}
																				</span>
																				{s.room && (
																					<span className="text-default-500">
																						({s.room})
																					</span>
																				)}
																			</li>
																		))}
																	</ul>
																</div>
															)}
														</div>
													))}
												</div>
											</CardBody>
										</Card>

										<div>
											<div className="text-sm font-medium mb-2">
												Grupo <span className="text-danger">*</span>
											</div>
											<Select
												placeholder="Selecciona un grupo"
												selectedKeys={selectedGroup ? [selectedGroup] : []}
												onSelectionChange={(keys) => {
													const value = Array.from(keys)[0] as string;
													setSelectedGroup(value);
													setError('');
												}}
												className="w-full"
											>
												{filteredGroups.map((group) => {
													const isFull =
														group.currentEnrollments >= group.maxStudents;
													return (
														<SelectItem
															key={group.groupId}
															textValue={`Grupo ${group.groupNumber} - ${group.professorName || 'Sin profesor'}`}
														>
															<div className="flex justify-between items-center w-full">
																<span>
																	Grupo {group.groupNumber} -{' '}
																	{group.professorName || 'Sin profesor'}
																</span>
																<Chip
																	size="sm"
																	color={isFull ? 'danger' : 'success'}
																	variant="flat"
																>
																	{group.currentEnrollments}/{group.maxStudents}
																</Chip>
															</div>
														</SelectItem>
													);
												})}
											</Select>
										</div>
									</>
								)}

								{selectedGroupData && (
									<Card className="bg-default-50" shadow="none">
										<CardBody className="space-y-2">
											<h4 className="font-semibold text-sm">
												Detalles del Grupo
											</h4>
											<div className="space-y-1 text-xs">
												<p>
													<span className="font-medium">Grupo:</span>{' '}
													{selectedGroupData.groupNumber}
												</p>
												<p>
													<span className="font-medium">Profesor:</span>{' '}
													{selectedGroupData.professorName || 'No asignado'}
												</p>
												<p>
													<span className="font-medium">Capacidad:</span>{' '}
													{selectedGroupData.currentEnrollments}/
													{selectedGroupData.maxStudents}
												</p>
												{selectedGroupData.schedule &&
													selectedGroupData.schedule.length > 0 && (
														<div>
															<span className="font-medium">Horario:</span>
															<ul className="ml-4 mt-1">
																{selectedGroupData.schedule.map((s) => (
																	<li
																		key={`${s.dayName}-${s.startTime}-${s.endTime}`}
																	>
																		{s.dayName}: {s.startTime} - {s.endTime}
																		{s.room && ` (${s.room})`}
																	</li>
																))}
															</ul>
														</div>
													)}
											</div>
										</CardBody>
									</Card>
								)}

								<Button
									type="submit"
									color="primary"
									size="lg"
									className="w-full"
									isLoading={enrollMutation.isPending}
									isDisabled={
										!selectedCourse ||
										!selectedGroup ||
										isAlreadyEnrolled ||
										isGroupFull ||
										enrollMutation.isPending
									}
								>
									{enrollMutation.isPending
										? 'Inscribiendo...'
										: 'Inscribir Materia'}
								</Button>
							</div>
						</form>
					</CardBody>
				</Card>
			</div>

			<div className="lg:col-span-1">
				<Card radius="sm" shadow="sm">
					<CardHeader>
						<h3 className="text-sm font-semibold">Materias Inscritas</h3>
					</CardHeader>
					<Divider />
					<CardBody>
						{enrollmentsLoading ? (
							<Spinner size="sm" />
						) : enrollments && enrollments.length > 0 ? (
							<div className="space-y-2">
								{(enrollments as Enrollment[]).map((enrollment) => (
									<Card
										key={enrollment._id}
										className="bg-default-50"
										shadow="none"
									>
										<CardBody className="py-2 px-3">
											<div className="flex justify-between items-start">
												<div className="flex-1">
													<p className="text-xs font-medium">
														{enrollment.groupId?.courseId?.code}
													</p>
													<p className="text-xs text-default-500">
														{enrollment.groupId?.courseId?.name}
													</p>
													<p className="text-xs text-default-400">
														Grupo: {enrollment.groupId?.groupNumber}
													</p>
												</div>
												<Button
													size="sm"
													color="danger"
													variant="flat"
													onPress={() => {
														if (
															studentProfile?.code &&
															enrollment.groupId?._id
														) {
															unenrollMutation.mutate({
																studentCode: studentProfile.code,
																groupId: enrollment.groupId._id,
															});
														}
													}}
													isLoading={unenrollMutation.isPending}
													className="min-w-0 px-2"
												>
													Eliminar
												</Button>
											</div>
										</CardBody>
									</Card>
								))}
							</div>
						) : (
							<p className="text-xs text-default-500">
								No tienes materias inscritas aún
							</p>
						)}
					</CardBody>
				</Card>
			</div>
		</div>
	);
};
