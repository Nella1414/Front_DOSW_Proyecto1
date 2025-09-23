type UserRole = 'student' | 'faculty' | 'admin';

type CurrentView =
	| 'login'
	| 'dashboard'
	| 'requests'
	| 'create-request'
	| 'management'
	| 'reports'
	| 'academic-progress'
	| 'profile-demo'
	| 'academic-plan'
	| 'plan-demo'
	| 'professor-demo'
	| 'student-registration'
	| 'role-management';

interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole;
	studentId?: string;
	academicStatus?: 'normal' | 'in progress' | 'failed';
}
