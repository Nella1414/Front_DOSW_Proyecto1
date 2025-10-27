import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea,
	useDisclosure,
} from '@heroui/react';
import { useState } from 'react';

interface ClassBlock {
	id: string;
	subject: string;
	classroom: string;
	teacher: string;
	color?: string;
	notes?: string;
}

interface ScheduleData {
	[day: string]: {
		[timeSlot: string]: ClassBlock | null;
	};
}

const DAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
const TIME_SLOTS = [
	'07:00–08:30',
	'08:30–10:00',
	'10:00–11:30',
	'11:30–13:00',
	'13:00–14:30',
	'14:30–16:00',
	'16:00–17:30',
	'17:30–19:00',
];

// Datos de ejemplo
const mockScheduleData: ScheduleData = {
	LUNES: {
		'07:00–08:30': {
			id: '1',
			subject: 'Probabilidad y Estadística',
			classroom: 'A-101',
			teacher: 'Dr. García',
		},
		'14:30–16:00': {
			id: '2',
			subject: 'Desarrollo y Operaciones Software',
			classroom: 'L-201',
			teacher: 'Ing. Martínez',
		},
	},
	MARTES: {
		'10:00–11:30': {
			id: '3',
			subject: 'Arquitectura y Servicios de Red',
			classroom: 'A-301',
			teacher: 'Dra. López',
		},
		'16:00–17:30': {
			id: '4',
			subject: 'Fundamentos de Seguridad',
			classroom: 'A-201',
			teacher: 'Dr. Rodríguez',
		},
	},
	MIÉRCOLES: {
		'07:00–08:30': {
			id: '5',
			subject: 'Probabilidad y Estadística',
			classroom: 'A-101',
			teacher: 'Dr. García',
		},
		'13:00–14:30': {
			id: '6',
			subject: 'Desarrollo y Operaciones Software',
			classroom: 'L-201',
			teacher: 'Ing. Martínez',
		},
	},
	JUEVES: {
		'10:00–11:30': {
			id: '7',
			subject: 'Arquitectura y Servicios de Red',
			classroom: 'A-301',
			teacher: 'Dra. López',
		},
		'16:00–17:30': {
			id: '8',
			subject: 'Fundamentos de Seguridad',
			classroom: 'A-201',
			teacher: 'Dr. Rodríguez',
		},
	},
	VIERNES: {
		'08:30–10:00': {
			id: '9',
			subject: 'Probabilidad y Estadística',
			classroom: 'A-101',
			teacher: 'Dr. García',
		},
	},
	SÁBADO: {},
};

export function AcademicSchedule() {
	const [scheduleData, setScheduleData] =
		useState<ScheduleData>(mockScheduleData);
	const [selectedSlot, setSelectedSlot] = useState<{
		day: string;
		time: string;
	} | null>(null);
	const [newClass, setNewClass] = useState({
		subject: '',
		teacher: '',
		classroom: '',
		notes: '',
	});
	const { isOpen, onOpen, onClose } = useDisclosure();

	const handleCellClick = (day: string, timeSlot: string) => {
		const existingClass = scheduleData[day]?.[timeSlot];
		if (!existingClass) {
			setSelectedSlot({ day, time: timeSlot });
			setNewClass({ subject: '', teacher: '', classroom: '', notes: '' });
			onOpen();
		}
	};

	const handleSaveClass = () => {
		if (!selectedSlot || !newClass.subject.trim()) return;

		const newClassBlock: ClassBlock = {
			id: Date.now().toString(),
			subject: newClass.subject,
			classroom: newClass.classroom,
			teacher: newClass.teacher,
			notes: newClass.notes,
		};

		setScheduleData((prev) => ({
			...prev,
			[selectedSlot.day]: {
				...prev[selectedSlot.day],
				[selectedSlot.time]: newClassBlock,
			},
		}));

		onClose();
		setSelectedSlot(null);
	};

	return (
		<div className="space-y-6">
			<Card radius="sm" shadow="sm">
				<CardHeader>
					<h3 className="text-lg font-semibold">Horario Académico</h3>
				</CardHeader>
				<CardBody>
					<div className="overflow-x-auto">
						<div className="min-w-[800px]">
							{/* Grid Container */}
							<div className="grid grid-cols-7 border border-default-200 rounded-lg overflow-hidden">
								{/* Header Row */}
								<div className="bg-default-100 p-3 border-r border-default-200 flex items-center justify-center">
									<span className="text-sm font-medium text-default-700">
										Horario
									</span>
								</div>
								{DAYS.map((day) => (
									<div
										key={day}
										className="bg-default-100 p-3 border-r border-default-200 last:border-r-0 flex items-center justify-center"
									>
										<span className="text-sm font-medium text-default-700">
											{day}
										</span>
									</div>
								))}

								{/* Time Slots Rows */}
								{TIME_SLOTS.map((timeSlot) => (
									<>
										{/* Time Label */}
										<div
											key={`time-${timeSlot}`}
											className="bg-default-50 p-3 border-r border-t border-default-200 flex items-center justify-end pr-4"
										>
											<span className="text-xs font-medium text-default-600">
												{timeSlot}
											</span>
										</div>

										{/* Day Cells */}
										{DAYS.map((day) => {
											const classBlock = scheduleData[day]?.[timeSlot];
											return (
												<div
													key={`${day}-${timeSlot}`}
													className="border-r border-t border-default-200 last:border-r-0 min-h-[80px] p-1"
												>
													{classBlock ? (
														<div className="h-full bg-primary text-primary-foreground rounded-md p-2 shadow-sm flex flex-col justify-center">
															<div className="text-xs font-bold leading-tight mb-1">
																{classBlock.subject}
															</div>
															<div className="text-xs leading-tight mb-1">
																{classBlock.classroom}
															</div>
															<div className="text-xs leading-tight opacity-90">
																{classBlock.teacher}
															</div>
														</div>
													) : (
														<button
															type="button"
															className="w-full h-full min-h-[76px] hover:bg-default-100 rounded-md transition-colors"
															onClick={() => handleCellClick(day, timeSlot)}
														/>
													)}
												</div>
											);
										})}
									</>
								))}
							</div>
						</div>
					</div>
				</CardBody>
			</Card>

			{/* Modal para añadir clase */}
			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalContent>
					<ModalHeader>
						Añadir Clase
						{selectedSlot && (
							<span className="text-sm font-normal text-default-500 ml-2">
								{selectedSlot.day} - {selectedSlot.time}
							</span>
						)}
					</ModalHeader>
					<ModalBody className="space-y-4">
						<Input
							label="Nombre de la Materia"
							placeholder="Ej: Cálculo Diferencial"
							value={newClass.subject}
							onChange={(e) =>
								setNewClass((prev) => ({ ...prev, subject: e.target.value }))
							}
							isRequired
						/>
						<Input
							label="Profesor"
							placeholder="Ej: Dr. García"
							value={newClass.teacher}
							onChange={(e) =>
								setNewClass((prev) => ({ ...prev, teacher: e.target.value }))
							}
						/>
						<Input
							label="Aula/Salón"
							placeholder="Ej: A-101"
							value={newClass.classroom}
							onChange={(e) =>
								setNewClass((prev) => ({ ...prev, classroom: e.target.value }))
							}
						/>
						<Textarea
							label="Notas (Opcional)"
							placeholder="Información adicional..."
							value={newClass.notes}
							onChange={(e) =>
								setNewClass((prev) => ({ ...prev, notes: e.target.value }))
							}
							rows={3}
						/>
					</ModalBody>
					<ModalFooter>
						<Button variant="light" onPress={onClose}>
							Cancelar
						</Button>
						<Button
							color="primary"
							onPress={handleSaveClass}
							isDisabled={!newClass.subject.trim()}
						>
							Guardar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}
