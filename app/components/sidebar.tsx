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

// Pequeña función utilitaria para concatenar clases (evita instalar clsx)
function clsx(...classes: Array<string | false | null | undefined>) {
	return classes.filter(Boolean).join(' ');
}

// Roles estandarizados internos (en tu app hay mezcla de "estudiante" / "student", etc.)
// Aquí centralizamos un mapeo para hacer el componente tolerante a ambas nomenclaturas.
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
	| 'student-registration'
	| 'role-management';

export interface User {
	id: string;
	name: string;
	email: string;
	role: UserRole | string; // Permitimos strings para soportar backends con otras etiquetas
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
	moduleToken?: string; // token de módulo (medicine, psychology, etc.) para estilos futuros
}

// Iconos simples (placeholder) – puedes reemplazar por un set real (lucide / heroicons)
const Icon = {
	Dashboard: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-primary/40"
			aria-hidden
		/>
	),
	Requests: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-secondary/50"
			aria-hidden
		/>
	),
	Create: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-success/60"
			aria-hidden
		/>
	),
	Management: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-warning/60"
			aria-hidden
		/>
	),
	Reports: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-danger/50"
			aria-hidden
		/>
	),
	Academic: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-info-500/60"
			aria-hidden
		/>
	),
	Profile: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-default-400"
			aria-hidden
		/>
	),
	Plan: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-medicine-500"
			aria-hidden
		/>
	),
	Students: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-rooms-500"
			aria-hidden
		/>
	),
	Roles: () => (
		<span
			className="w-4 h-4 inline-block rounded-sm bg-admin-500"
			aria-hidden
		/>
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

// Mapea valores alternos (ej. "estudiante") a roles internos
function normalizeRole(raw: string | undefined): UserRole | null {
	if (!raw) return null;
	const r = raw.toLowerCase();
	if (['student', 'estudiante'].includes(r)) return 'student';
	if (['faculty', 'decanatura', 'profesor', 'docente'].includes(r))
		return 'faculty';
	if (['admin', 'administrador', 'administration'].includes(r)) return 'admin';
	return null; // rol desconocido => sólo items base
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
									>
										{role}
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

// Hook práctico por si quieres reutilizar la navegación fuera del componente
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

// Ejemplo de skeleton (carga) opcional
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
