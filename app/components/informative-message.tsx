import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Select,
	SelectItem,
} from '@heroui/react';
import { useEffect, useState } from 'react';

export type SystemPeriod =
	| 'pre-inscripcion'
	| 'inscripcion'
	| 'post-inscripcion';

export interface AcademicSemester {
	year: number;
	semester: number;
	label: string;
	enrollmentStart: string;
	enrollmentEnd: string;
	classesStart: string;
	classesEnd: string;
}

interface InformativeMessageProps {
	period: SystemPeriod;
	onCtaClick: () => void;
}

interface SemesterSelectorProps {
	selectedSemester: AcademicSemester;
	onSemesterChange: (semester: AcademicSemester) => void;
	className?: string;
}

interface SemesterInfoProps {
	semester: AcademicSemester;
}

const periodConfigs = {
	'pre-inscripcion': {
		title: 'Período de Pre-inscripción',
		message:
			'El período de pre-inscripción está activo. Puedes revisar las materias disponibles y planificar tu horario.',
		ctaText: 'Ver Materias Disponibles',
		color: 'primary' as const,
	},
	inscripcion: {
		title: 'Período de Inscripción',
		message:
			'¡Es hora de inscribirte! Tienes tiempo limitado para seleccionar tus materias y grupos.',
		ctaText: 'Ir a Inscripción',
		color: 'success' as const,
	},
	'post-inscripcion': {
		title: 'Período Post-inscripción',
		message:
			'La inscripción ha finalizado. Revisa tu horario académico y prepárate para el inicio de clases.',
		ctaText: '',
		color: 'warning' as const,
	},
};

const generateSemesterDates = (year: number, semester: number) => {
	const enrollmentStart = new Date(year, semester === 1 ? 0 : 6, 1);
	const enrollmentEnd = new Date(year, semester === 1 ? 5 : 11, 15);
	const classesStart = new Date(year, semester === 1 ? 1 : 7, 1);
	const classesEnd = new Date(year, semester === 1 ? 5 : 11, 30);

	return {
		enrollmentStart: enrollmentStart.toISOString().split('T')[0],
		enrollmentEnd: enrollmentEnd.toISOString().split('T')[0],
		classesStart: classesStart.toISOString().split('T')[0],
		classesEnd: classesEnd.toISOString().split('T')[0],
	};
};

export function useCurrentPeriod(): SystemPeriod {
	const now = new Date();
	const currentMonth = now.getMonth() + 1;
	const _currentDay = now.getDate();

	if (currentMonth >= 1 && currentMonth <= 2) {
		return 'pre-inscripcion';
	} else if (currentMonth >= 3 && currentMonth <= 6) {
		return 'inscripcion';
	} else {
		return 'post-inscripcion';
	}
}

export function usePeriodForSemester(semester: AcademicSemester): SystemPeriod {
	const now = new Date();
	const enrollmentStart = new Date(semester.enrollmentStart);
	const enrollmentEnd = new Date(semester.enrollmentEnd);
	const classesStart = new Date(semester.classesStart);

	if (now < enrollmentStart) {
		return 'pre-inscripcion';
	} else if (now >= enrollmentStart && now <= enrollmentEnd) {
		return 'inscripcion';
	} else if (now > enrollmentEnd && now < classesStart) {
		return 'post-inscripcion';
	} else {
		return 'post-inscripcion';
	}
}

export function useSelectedSemester(): [
	AcademicSemester,
	(semester: AcademicSemester) => void,
] {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth() + 1;

	const currentSemester = currentMonth <= 6 ? 1 : 2;

	const [selectedSemester, setSelectedSemester] = useState<AcademicSemester>(
		() => {
			const dates = generateSemesterDates(currentYear, currentSemester);
			return {
				year: currentYear,
				semester: currentSemester,
				label: `${currentYear}-${currentSemester}`,
				...dates,
			};
		},
	);

	useEffect(() => {
		const saved = localStorage.getItem('selectedSemester');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setSelectedSemester(parsed);
			} catch (error) {
				console.warn('Error parsing saved semester:', error);
			}
		}
	}, []);

	const updateSemester = (semester: AcademicSemester) => {
		setSelectedSemester(semester);
		localStorage.setItem('selectedSemester', JSON.stringify(semester));
	};

	return [selectedSemester, updateSemester];
}

export function InformativeMessage({
	period,
	onCtaClick,
}: InformativeMessageProps) {
	const config = periodConfigs[period];

	return (
		<Card radius="sm" shadow="sm" className={`border-${config.color}-200`}>
			<CardHeader className="pb-2">
				<div className="flex items-center gap-2">
					<Chip color={config.color} variant="flat" size="sm">
						{config.title}
					</Chip>
				</div>
			</CardHeader>
			<CardBody className="pt-0">
				<p className="text-sm text-default-700 mb-3">{config.message}</p>
				{config.ctaText && (
					<Button
						color={config.color}
						variant="flat"
						size="sm"
						onPress={onCtaClick}
					>
						{config.ctaText}
					</Button>
				)}
			</CardBody>
		</Card>
	);
}

export function SemesterSelector({
	selectedSemester,
	onSemesterChange,
	className = '',
}: SemesterSelectorProps) {
	const currentYear = new Date().getFullYear();
	const semesters: AcademicSemester[] = [];

	for (let year = currentYear; year >= currentYear - 3; year--) {
		for (let semester = 2; semester >= 1; semester--) {
			const dates = generateSemesterDates(year, semester);
			semesters.push({
				year,
				semester,
				label: `${year}-${semester}`,
				...dates,
			});
		}
	}

	return (
		<div className={`flex flex-col sm:flex-row gap-2 ${className}`}>
			<Select
				label="Seleccionar Semestre"
				selectedKeys={[selectedSemester.label]}
				onSelectionChange={(keys) => {
					const selectedKey = Array.from(keys)[0] as string;
					const semester = semesters.find((s) => s.label === selectedKey);
					if (semester) {
						onSemesterChange(semester);
					}
				}}
				className="w-[200px]"
			>
				{semesters.map((semester) => (
					<SelectItem key={semester.label}>{semester.label}</SelectItem>
				))}
			</Select>
		</div>
	);
}

export function SemesterInfo({ semester }: SemesterInfoProps) {
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<Card radius="sm" shadow="sm">
			<CardHeader>
				<h3 className="text-lg font-semibold">
					Información del Semestre {semester.label}
				</h3>
			</CardHeader>
			<CardBody>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
					<div>
						<span className="font-medium text-default-600">
							Inicio de Inscripción:
						</span>
						<p className="text-default-800">
							{formatDate(semester.enrollmentStart)}
						</p>
					</div>
					<div>
						<span className="font-medium text-default-600">
							Fin de Inscripción:
						</span>
						<p className="text-default-800">
							{formatDate(semester.enrollmentEnd)}
						</p>
					</div>
					<div>
						<span className="font-medium text-default-600">
							Inicio de Clases:
						</span>
						<p className="text-default-800">
							{formatDate(semester.classesStart)}
						</p>
					</div>
					<div>
						<span className="font-medium text-default-600">Fin de Clases:</span>
						<p className="text-default-800">
							{formatDate(semester.classesEnd)}
						</p>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
