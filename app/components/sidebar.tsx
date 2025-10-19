import {
	Avatar,
	Badge,
	Button,
	Chip,
	Divider,
	ScrollShadow,
	Tooltip,
} from '@heroui/react';
import React from 'react';

// Función utilitaria para concatenar clases
function clsx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

export type UserRole = 'student' | 'faculty' | 'admin';

export type CurrentView =
	| 'dashboard'
	| 'requests'
	| 'create-request'
	| 'management'
	| 'reports'
	| 'academic-progress'
	| 'profile'
	| 'academic-plan'
	| 'schedule'
	| 'student-registration'
	| 'role-management';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole | string;
	studentId?: string;
	academicStatus?: 'normal' | 'in progress' | 'failed';
}

interface SidebarProps {
	user: User | null;
	currentView: CurrentView;
	onNavigate: (view: CurrentView) => void;
	className?: string;
	collapsed?: boolean;
	onToggleCollapsed?: () => void;
}

interface NavItemConfig {
	key: CurrentView;
	label: string;
	icon?: React.ReactNode;
	color?:
		| 'primary'
		| 'secondary'
		| 'success'
		| 'warning'
		| 'danger'
		| 'default';
	badge?: string | number;
	moduleToken?: string;
}

const Icon = {
	Dashboard: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Dashboard icon"
		>
			<rect width="7" height="9" x="3" y="3" rx="1" />
			<rect width="7" height="5" x="14" y="3" rx="1" />
			<rect width="7" height="9" x="14" y="12" rx="1" />
			<rect width="7" height="5" x="3" y="16" rx="1" />
		</svg>
	),
	Requests: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Requests icon"
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" x2="8" y1="13" y2="13" />
			<line x1="16" x2="8" y1="17" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	),
	Create: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Create icon"
		>
			<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="12" x2="12" y1="18" y2="12" />
			<line x1="9" x2="15" y1="15" y2="15" />
		</svg>
	),
	Management: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Management icon"
		>
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	),
	Reports: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Reports icon"
		>
			<path d="M3 3v18h18" />
			<path d="m19 9-5 5-4-4-3 3" />
		</svg>
	),
	Academic: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Academic icon"
		>
			<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
			<path d="M6 12v5c3 3 9 3 12 0v-5" />
		</svg>
	),
	Profile: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Profile icon"
		>
			<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
			<circle cx="12" cy="7" r="4" />
		</svg>
	),
	Plan: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Plan icon"
		>
			<rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
			<line x1="16" x2="16" y1="2" y2="6" />
			<line x1="8" x2="8" y1="2" y2="6" />
			<line x1="3" x2="21" y1="10" y2="10" />
		</svg>
	),
	Students: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Students icon"
		>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
	Roles: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Roles icon"
		>
			<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
			<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
			<path d="M12 19v3" />
		</svg>
	),
	Schedule: () => (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className="w-5 h-5"
			role="img"
			aria-label="Schedule icon"
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	),
};

// Configuración de navegación por rol
const BASE_ITEMS: NavItemConfig[] = [
	{ key: 'dashboard', label: 'Dashboard', icon: <Icon.Dashboard /> },
	{ key: 'profile', label: 'Perfil', icon: <Icon.Profile /> },
];

const ROLE_ITEMS: Record<UserRole, NavItemConfig[]> = {
	student: [
		{
			key: 'academic-progress',
			label: 'Progreso Académico',
			icon: <Icon.Academic />,
			color: 'secondary',
			moduleToken: 'classes',
		},
		{
			key: 'schedule',
			label: 'Mi Horario',
			icon: <Icon.Schedule />,
			color: 'primary',
			moduleToken: 'classes',
		},
		{
			key: 'academic-plan',
			label: 'Plan Académico',
			icon: <Icon.Plan />,
			color: 'primary',
			moduleToken: 'medicine',
		},
		{
			key: 'requests',
			label: 'Solicitudes',
			icon: <Icon.Requests />,
			color: 'primary',
		},
		{
			key: 'create-request',
			label: 'Nueva Solicitud',
			icon: <Icon.Create />,
			color: 'success',
		},
	],
	faculty: [
		{
			key: 'management',
			label: 'Gestión',
			icon: <Icon.Management />,
			color: 'warning',
			moduleToken: 'classes',
		},
		{
			key: 'reports',
			label: 'Reportes',
			icon: <Icon.Reports />,
			color: 'secondary',
		},
	],
	admin: [
		{
			key: 'student-registration',
			label: 'Registrar Estudiante',
			icon: <Icon.Students />,
			color: 'success',
			moduleToken: 'rooms',
		},
		{
			key: 'role-management',
			label: 'Roles',
			icon: <Icon.Roles />,
			color: 'danger',
			moduleToken: 'admin',
		},
		{
			key: 'academic-progress',
			label: 'Progreso Académico',
			icon: <Icon.Academic />,
			color: 'secondary',
			moduleToken: 'classes',
		},
		{
			key: 'academic-plan',
			label: 'Períodos Académicos',
			icon: <Icon.Plan />,
			color: 'primary',
			moduleToken: 'medicine',
		},
		{
			key: 'management',
			label: 'Gestión',
			icon: <Icon.Management />,
			color: 'warning',
		},
		{
			key: 'reports',
			label: 'Reportes',
			icon: <Icon.Reports />,
			color: 'secondary',
		},
	],
};

function normalizeRole(raw: string | undefined): UserRole | null {
	if (!raw) return null;
	const r = raw.toLowerCase();
	if (['student', 'estudiante'].includes(r)) return 'student';
	if (['faculty', 'decanatura', 'profesor', 'docente'].includes(r))
		return 'faculty';
	if (['admin', 'administrador', 'administration'].includes(r)) return 'admin';
	return null;
}

export const Sidebar: React.FC<SidebarProps> = ({
	user,
	currentView,
	onNavigate,
	className,
	collapsed: collapsedProp,
	onToggleCollapsed,
}) => {
	const [internalCollapsed, setInternalCollapsed] = React.useState(false);
	const collapsed = collapsedProp ?? internalCollapsed;

	const handleToggle = () => {
		if (onToggleCollapsed) return onToggleCollapsed();
		setInternalCollapsed((c) => !c);
	};

	const role = normalizeRole(user?.role);
	const roleItems = role ? ROLE_ITEMS[role] : [];
	const items = [...BASE_ITEMS, ...roleItems];

	return (
		<aside
			className={clsx(
				'group flex flex-col border-r border-content3/40 bg-content1 text-content1-foreground transition-all duration-300',
				collapsed ? 'w-16' : 'w-64',
				className,
			)}
			aria-label="Barra lateral de navegación"
		>
			<div className="flex items-center gap-2 px-4 h-14 shrink-0">
				<Button
					isIconOnly
					variant="light"
					size="sm"
					aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
					onPress={handleToggle}
					className="text-default-600"
				>
					{collapsed ? '»' : '«'}
				</Button>
				{!collapsed && (
					<span className="font-semibold tracking-wide text-sm">SIRHA</span>
				)}
			</div>
			<Divider className="mb-1" />
			{/* Perfil usuario */}
			{user && (
				<div className={clsx('px-4 pb-3', collapsed && 'px-2')}>
					<div className="flex items-center gap-3">
						<Avatar
							name={user.name}
							className="h-10 w-10 text-xs font-medium bg-primary/20 text-primary-600"
						/>
						{!collapsed && (
							<div className="min-w-0">
								<p className="text-sm font-medium truncate">{user.name}</p>
								<p className="text-xs text-default-500 truncate">
									{user.email}
								</p>
								{role && (
									<Chip
										className="mt-1"
										size="sm"
										variant="flat"
										color={
											role === 'admin'
												? 'danger'
												: role === 'faculty'
													? 'warning'
													: 'primary'
										}
										startContent={
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
												className="w-3 h-3"
												role="img"
												aria-label={
													role === 'admin'
														? 'Admin role icon'
														: role === 'faculty'
															? 'Faculty role icon'
															: 'Student role icon'
												}
											>
												{role === 'admin' ? (
													<>
														<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
														<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
														<path d="M12 19v3" />
													</>
												) : role === 'faculty' ? (
													<>
														<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
														<path d="M6 12v5c3 3 9 3 12 0v-5" />
													</>
												) : (
													<>
														<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
														<path d="M6 12v5c3 3 9 3 12 0v-5" />
													</>
												)}
											</svg>
										}
									>
										{role === 'student' ? 'estudiante' : role}
									</Chip>
								)}
							</div>
						)}
					</div>
				</div>
			)}
			<Divider />
			<nav className="flex-1 overflow-hidden">
				<ScrollShadow className="h-full py-2" size={24} hideScrollBar>
					<ul className="space-y-1 px-2">
						{items.map((item) => {
							const active = currentView === item.key;
							const content = (
								<button
									type="button"
									key={item.key}
									onClick={() => onNavigate(item.key)}
									aria-current={active ? 'page' : undefined}
									className={clsx(
										'group w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus',
										active
											? 'bg-primary text-primary-foreground shadow-sm'
											: 'text-default-600 hover:bg-content2 hover:text-default-900',
									)}
								>
									{item.icon}
									{!collapsed && <span className="truncate">{item.label}</span>}
									{item.badge && !collapsed && (
										<Badge color={item.color || 'primary'}>{item.badge}</Badge>
									)}
								</button>
							);
							return (
								<li key={item.key}>
									{collapsed ? (
										<Tooltip content={item.label} placement="right">
											{content}
										</Tooltip>
									) : (
										content
									)}
								</li>
							);
						})}
					</ul>
				</ScrollShadow>
			</nav>
			<div className="p-3 mt-auto">
				<Button
					fullWidth
					variant="flat"
					color="danger"
					size="sm"
					className={clsx(collapsed && 'px-0')}
					onPress={() => onNavigate('dashboard')}
				>
					{collapsed ? '⏻' : 'Cerrar sesión'}
				</Button>
			</div>
		</aside>
	);
};

// Hook práctico para reutilizar la navegación fuera del componente
export function useSidebarNavigation(user: User | null) {
	const role = normalizeRole(user?.role);
	return React.useMemo(() => {
		return {
			base: BASE_ITEMS,
			roleItems: role ? ROLE_ITEMS[role] : [],
			all: role ? [...BASE_ITEMS, ...ROLE_ITEMS[role]] : BASE_ITEMS,
		};
	}, [role]);
}

export function SidebarSkeleton() {
	return (
		<div className="w-64 h-full border-r border-content3/40 bg-content1 p-4 animate-pulse space-y-4">
			<div className="h-5 w-24 bg-default-200 rounded" />
			<div className="h-10 w-full bg-default-100 rounded" />
			<div className="h-10 w-full bg-default-100 rounded" />
			<div className="h-10 w-3/4 bg-default-100 rounded" />
		</div>
	);
}

export default Sidebar;
