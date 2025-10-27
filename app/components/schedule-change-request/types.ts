export interface Subject {
	id: string;
	name: string;
	code: string;
	currentGroup: string;
}

export interface Group {
	id: string;
	name: string;
	schedule: string;
	professor: string;
	currentEnrollments: number;
	maxStudents: number;
}

export interface FormData {
	subject: string;
	groupTo: string;
	reason: string;
}

export interface CapacityStatus {
	color: 'success' | 'warning' | 'danger';
	label: string;
	percentage: number;
}
