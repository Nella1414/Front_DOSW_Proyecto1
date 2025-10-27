import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Progress,
	Select,
	SelectItem,
	Spacer,
	Tab,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tabs,
} from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

interface ReportData {
	totalUsers: number;
	totalRequests: number;
	approvedRequests: number;
	rejectedRequests: number;
	pendingRequests: number;
	usersByRole: {
		students: number;
		faculty: number;
		admin: number;
	};
	requestsByMonth: Array<{
		month: string;
		approved: number;
		rejected: number;
		pending: number;
	}>;
	topSubjects: Array<{
		name: string;
		requests: number;
		approvalRate: number;
	}>;
	averageResponseTime: number;
	careerName?: string;
}

interface Career {
	id: string;
	name: string;
}

// Lista de carreras disponibles
const availableCareers: Career[] = [
	{ id: 'all', name: 'Todas las Carreras' },
	{ id: 'sistemas', name: 'Ingeniería de Sistemas' },
	{ id: 'industrial', name: 'Ingeniería Industrial' },
	{ id: 'civil', name: 'Ingeniería Civil' },
	{ id: 'electronica', name: 'Ingeniería Electrónica' },
	{ id: 'mecanica', name: 'Ingeniería Mecánica' },
];

// Mock data para reportes generales
const mockReportData: ReportData = {
	totalUsers: 428,
	totalRequests: 256,
	approvedRequests: 189,
	rejectedRequests: 43,
	pendingRequests: 24,
	usersByRole: {
		students: 380,
		faculty: 35,
		admin: 13,
	},
	requestsByMonth: [
		{ month: 'Enero', approved: 18, rejected: 5, pending: 2 },
		{ month: 'Febrero', approved: 22, rejected: 4, pending: 3 },
		{ month: 'Marzo', approved: 25, rejected: 6, pending: 4 },
		{ month: 'Abril', approved: 28, rejected: 7, pending: 3 },
		{ month: 'Mayo', approved: 24, rejected: 5, pending: 5 },
		{ month: 'Junio', approved: 20, rejected: 4, pending: 2 },
		{ month: 'Julio', approved: 16, rejected: 3, pending: 1 },
		{ month: 'Agosto', approved: 21, rejected: 5, pending: 2 },
		{ month: 'Septiembre', approved: 15, rejected: 4, pending: 2 },
	],
	topSubjects: [
		{
			name: 'Desarrollo Orientado por Objetos',
			requests: 45,
			approvalRate: 88,
		},
		{ name: 'Cálculo Diferencial', requests: 38, approvalRate: 76 },
		{ name: 'Física 1', requests: 32, approvalRate: 82 },
		{ name: 'Matemáticas Básicas', requests: 28, approvalRate: 91 },
		{ name: 'Probabilidad y Estadística', requests: 25, approvalRate: 73 },
	],
	averageResponseTime: 2.4, // días
};

// Mock data por carrera
const mockDataByCareers: Record<string, ReportData> = {
	sistemas: {
		totalUsers: 145,
		totalRequests: 98,
		approvedRequests: 72,
		rejectedRequests: 18,
		pendingRequests: 8,
		usersByRole: {
			students: 132,
			faculty: 11,
			admin: 2,
		},
		requestsByMonth: [
			{ month: 'Enero', approved: 8, rejected: 2, pending: 1 },
			{ month: 'Febrero', approved: 9, rejected: 2, pending: 1 },
			{ month: 'Marzo', approved: 10, rejected: 3, pending: 1 },
			{ month: 'Abril', approved: 11, rejected: 3, pending: 1 },
			{ month: 'Mayo', approved: 9, rejected: 2, pending: 2 },
			{ month: 'Junio', approved: 7, rejected: 2, pending: 1 },
			{ month: 'Julio', approved: 6, rejected: 1, pending: 0 },
			{ month: 'Agosto', approved: 8, rejected: 2, pending: 1 },
			{ month: 'Septiembre', approved: 4, rejected: 1, pending: 0 },
		],
		topSubjects: [
			{
				name: 'Desarrollo Orientado por Objetos',
				requests: 22,
				approvalRate: 91,
			},
			{ name: 'Bases de Datos', requests: 18, approvalRate: 85 },
			{ name: 'Algoritmos', requests: 15, approvalRate: 87 },
			{ name: 'Redes de Computadores', requests: 12, approvalRate: 75 },
			{ name: 'Inteligencia Artificial', requests: 10, approvalRate: 80 },
		],
		averageResponseTime: 2.1,
		careerName: 'Ingeniería de Sistemas',
	},
	industrial: {
		totalUsers: 98,
		totalRequests: 64,
		approvedRequests: 48,
		rejectedRequests: 10,
		pendingRequests: 6,
		usersByRole: {
			students: 89,
			faculty: 7,
			admin: 2,
		},
		requestsByMonth: [
			{ month: 'Enero', approved: 5, rejected: 1, pending: 1 },
			{ month: 'Febrero', approved: 6, rejected: 1, pending: 1 },
			{ month: 'Marzo', approved: 7, rejected: 2, pending: 1 },
			{ month: 'Abril', approved: 8, rejected: 2, pending: 1 },
			{ month: 'Mayo', approved: 6, rejected: 1, pending: 1 },
			{ month: 'Junio', approved: 5, rejected: 1, pending: 0 },
			{ month: 'Julio', approved: 4, rejected: 1, pending: 0 },
			{ month: 'Agosto', approved: 5, rejected: 1, pending: 1 },
			{ month: 'Septiembre', approved: 2, rejected: 0, pending: 0 },
		],
		topSubjects: [
			{ name: 'Investigación de Operaciones', requests: 16, approvalRate: 88 },
			{ name: 'Gestión de Producción', requests: 14, approvalRate: 79 },
			{ name: 'Estadística Industrial', requests: 12, approvalRate: 83 },
			{ name: 'Control de Calidad', requests: 10, approvalRate: 90 },
			{ name: 'Logística', requests: 8, approvalRate: 75 },
		],
		averageResponseTime: 2.3,
		careerName: 'Ingeniería Industrial',
	},
	civil: {
		totalUsers: 87,
		totalRequests: 52,
		approvedRequests: 38,
		rejectedRequests: 9,
		pendingRequests: 5,
		usersByRole: {
			students: 78,
			faculty: 7,
			admin: 2,
		},
		requestsByMonth: [
			{ month: 'Enero', approved: 3, rejected: 1, pending: 0 },
			{ month: 'Febrero', approved: 4, rejected: 1, pending: 1 },
			{ month: 'Marzo', approved: 5, rejected: 1, pending: 1 },
			{ month: 'Abril', approved: 6, rejected: 1, pending: 1 },
			{ month: 'Mayo', approved: 5, rejected: 1, pending: 1 },
			{ month: 'Junio', approved: 4, rejected: 1, pending: 0 },
			{ month: 'Julio', approved: 3, rejected: 1, pending: 0 },
			{ month: 'Agosto', approved: 5, rejected: 1, pending: 1 },
			{ month: 'Septiembre', approved: 3, rejected: 1, pending: 0 },
		],
		topSubjects: [
			{ name: 'Mecánica de Suelos', requests: 12, approvalRate: 83 },
			{ name: 'Estructuras', requests: 11, approvalRate: 73 },
			{ name: 'Hidráulica', requests: 10, approvalRate: 80 },
			{ name: 'Construcción', requests: 9, approvalRate: 89 },
			{ name: 'Materiales de Construcción', requests: 7, approvalRate: 71 },
		],
		averageResponseTime: 2.6,
		careerName: 'Ingeniería Civil',
	},
	electronica: {
		totalUsers: 56,
		totalRequests: 28,
		approvedRequests: 20,
		rejectedRequests: 4,
		pendingRequests: 4,
		usersByRole: {
			students: 50,
			faculty: 5,
			admin: 1,
		},
		requestsByMonth: [
			{ month: 'Enero', approved: 2, rejected: 0, pending: 0 },
			{ month: 'Febrero', approved: 2, rejected: 0, pending: 0 },
			{ month: 'Marzo', approved: 3, rejected: 0, pending: 1 },
			{ month: 'Abril', approved: 2, rejected: 1, pending: 0 },
			{ month: 'Mayo', approved: 3, rejected: 1, pending: 1 },
			{ month: 'Junio', approved: 3, rejected: 1, pending: 1 },
			{ month: 'Julio', approved: 2, rejected: 0, pending: 0 },
			{ month: 'Agosto', approved: 2, rejected: 1, pending: 1 },
			{ month: 'Septiembre', approved: 1, rejected: 0, pending: 0 },
		],
		topSubjects: [
			{ name: 'Circuitos Digitales', requests: 8, approvalRate: 88 },
			{ name: 'Electrónica Analógica', requests: 6, approvalRate: 67 },
			{ name: 'Microprocesadores', requests: 5, approvalRate: 80 },
			{ name: 'Sistemas de Control', requests: 4, approvalRate: 75 },
			{ name: 'Telecomunicaciones', requests: 3, approvalRate: 67 },
		],
		averageResponseTime: 2.0,
		careerName: 'Ingeniería Electrónica',
	},
	mecanica: {
		totalUsers: 42,
		totalRequests: 14,
		approvedRequests: 11,
		rejectedRequests: 2,
		pendingRequests: 1,
		usersByRole: {
			students: 31,
			faculty: 5,
			admin: 6,
		},
		requestsByMonth: [
			{ month: 'Enero', approved: 0, rejected: 1, pending: 0 },
			{ month: 'Febrero', approved: 1, rejected: 0, pending: 0 },
			{ month: 'Marzo', approved: 0, rejected: 0, pending: 0 },
			{ month: 'Abril', approved: 1, rejected: 0, pending: 0 },
			{ month: 'Mayo', approved: 1, rejected: 0, pending: 0 },
			{ month: 'Junio', approved: 1, rejected: 0, pending: 0 },
			{ month: 'Julio', approved: 1, rejected: 0, pending: 1 },
			{ month: 'Agosto', approved: 1, rejected: 0, pending: 0 },
			{ month: 'Septiembre', approved: 5, rejected: 1, pending: 0 },
		],
		topSubjects: [
			{ name: 'Termodinámica', requests: 4, approvalRate: 75 },
			{ name: 'Mecánica de Fluidos', requests: 3, approvalRate: 100 },
			{ name: 'Diseño de Máquinas', requests: 3, approvalRate: 67 },
			{ name: 'Procesos de Manufactura', requests: 2, approvalRate: 100 },
			{ name: 'Vibraciones Mecánicas', requests: 2, approvalRate: 50 },
		],
		averageResponseTime: 2.8,
		careerName: 'Ingeniería Mecánica',
	},
};

export function Reports() {
	const [selectedPeriod, setSelectedPeriod] = useState('2024-2');
	const [selectedCareer, setSelectedCareer] = useState('all');
	const [activeTab, setActiveTab] = useState('overview');

	// Query para obtener datos de reportes
	const { data: reportData = mockReportData } = useQuery({
		queryKey: ['reports', selectedPeriod, selectedCareer],
		queryFn: async (): Promise<ReportData> => {
			await new Promise((resolve) => setTimeout(resolve, 800));
			// Si se selecciona una carrera específica, retornar los datos de esa carrera
			if (selectedCareer !== 'all' && mockDataByCareers[selectedCareer]) {
				return mockDataByCareers[selectedCareer];
			}
			// De lo contrario, retornar datos generales
			return mockReportData;
		},
	});

	// Calcular tasa de aprobación
	const approvalRate = reportData.totalRequests
		? Math.round((reportData.approvedRequests / reportData.totalRequests) * 100)
		: 0;

	// Colores para las gráficas
	const COLORS = {
		primary: '#006FEE',
		secondary: '#7828C8',
		success: '#17C964',
		warning: '#F5A524',
		danger: '#F31260',
	};

	// Datos para el gráfico de pastel de usuarios
	const usersPieData = [
		{
			name: 'Estudiantes',
			value: reportData.usersByRole.students,
			color: COLORS.primary,
		},
		{
			name: 'Profesores',
			value: reportData.usersByRole.faculty,
			color: COLORS.warning,
		},
		{
			name: 'Administradores',
			value: reportData.usersByRole.admin,
			color: COLORS.danger,
		},
	];

	// Datos para el gráfico de pastel de solicitudes
	const requestsPieData = [
		{
			name: 'Aprobadas',
			value: reportData.approvedRequests,
			color: COLORS.success,
		},
		{
			name: 'Rechazadas',
			value: reportData.rejectedRequests,
			color: COLORS.danger,
		},
		{
			name: 'Pendientes',
			value: reportData.pendingRequests,
			color: COLORS.warning,
		},
	];

	// Exportar reporte a CSV
	const handleExportCSV = () => {
		const careerSuffix =
			selectedCareer !== 'all' ? `_${selectedCareer}` : '_general';
		const csvContent = [
			['Métrica', 'Valor'],
			...(selectedCareer !== 'all'
				? [['Carrera', reportData.careerName || '']]
				: []),
			['Total de Usuarios', reportData.totalUsers],
			['Total de Solicitudes', reportData.totalRequests],
			['Solicitudes Aprobadas', reportData.approvedRequests],
			['Solicitudes Rechazadas', reportData.rejectedRequests],
			['Solicitudes Pendientes', reportData.pendingRequests],
			['Tasa de Aprobación', `${approvalRate}%`],
			[
				'Tiempo Promedio de Respuesta',
				`${reportData.averageResponseTime} días`,
			],
		]
			.map((row) => row.join(','))
			.join('\n');

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
		const link = document.createElement('a');
		const url = URL.createObjectURL(blob);
		link.setAttribute('href', url);
		link.setAttribute(
			'download',
			`reporte${careerSuffix}_${selectedPeriod}_${Date.now()}.csv`,
		);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Exportar reporte detallado a PDF (simulado)
	const handleExportPDF = () => {
		const careerInfo =
			selectedCareer !== 'all' ? ` de ${reportData.careerName}` : ' general';
		alert(
			`Generando reporte PDF${careerInfo} para el período ${selectedPeriod}...\n\nEn una implementación real, esto generaría un PDF con gráficos y análisis detallados.`,
		);
	};

	return (
		<div className="space-y-6">
			{/* Header con controles */}
			<Card>
				<CardHeader className="flex justify-between items-center">
					<div>
						<h2 className="text-2xl font-bold text-default-900">
							Reportes y Análisis
						</h2>
						<p className="text-base text-default-600 mt-1">
							{selectedCareer === 'all'
								? 'Métricas y estadísticas del sistema SIRHA'
								: `Métricas de ${reportData.careerName}`}
						</p>
					</div>
					<div className="flex gap-3 items-center flex-wrap">
						<Select
							label="Carrera"
							selectedKeys={[selectedCareer]}
							onSelectionChange={(keys) =>
								setSelectedCareer(Array.from(keys)[0] as string)
							}
							className="w-56"
							size="md"
						>
							{availableCareers.map((career) => (
								<SelectItem key={career.id}>{career.name}</SelectItem>
							))}
						</Select>
						<Select
							label="Período"
							selectedKeys={[selectedPeriod]}
							onSelectionChange={(keys) =>
								setSelectedPeriod(Array.from(keys)[0] as string)
							}
							className="w-32"
							size="md"
						>
							<SelectItem key="2024-1">2024-1</SelectItem>
							<SelectItem key="2024-2">2024-2</SelectItem>
							<SelectItem key="2025-1">2025-1</SelectItem>
						</Select>
						<Button
							color="primary"
							variant="flat"
							size="md"
							onPress={handleExportCSV}
						>
							Exportar CSV
						</Button>
						<Button
							color="primary"
							variant="solid"
							size="md"
							onPress={handleExportPDF}
						>
							Exportar PDF
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Tabs de navegación */}
			<Tabs
				aria-label="Secciones de reportes"
				selectedKey={activeTab}
				onSelectionChange={(key) => setActiveTab(key as string)}
				size="lg"
				color="primary"
				variant="underlined"
				classNames={{
					tabList: 'gap-6',
					tab: 'text-base font-medium',
					cursor: 'bg-primary',
				}}
			>
				<Tab key="overview" title="Resumen General" />
				<Tab key="requests" title="Solicitudes" />
				<Tab key="users" title="Usuarios" />
				<Tab key="subjects" title="Materias" />
			</Tabs>

			{/* Vista Resumen General */}
			{activeTab === 'overview' && (
				<div className="space-y-6">
					{/* Indicador de vista actual */}
					{selectedCareer !== 'all' && (
						<Card className="border-2 border-primary">
							<CardBody className="py-4">
								<div className="flex items-center gap-3">
									<Chip color="primary" size="lg" variant="flat">
										Vista de Carrera
									</Chip>
									<p className="text-base text-default-700">
										Mostrando reportes específicos de{' '}
										<span className="font-bold text-primary">
											{reportData.careerName}
										</span>
									</p>
								</div>
							</CardBody>
						</Card>
					)}

					{/* Métricas principales */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<Card shadow="sm">
							<CardBody className="gap-2 py-5">
								<p className="text-sm font-semibold text-default-600 uppercase tracking-wide">
									Total de Usuarios
								</p>
								<p className="text-4xl font-bold text-primary">
									{reportData.totalUsers}
								</p>
								<p className="text-sm text-default-500">
									{reportData.usersByRole.students} estudiantes
								</p>
							</CardBody>
						</Card>

						<Card shadow="sm">
							<CardBody className="gap-2 py-5">
								<p className="text-sm font-semibold text-default-600 uppercase tracking-wide">
									Total de Solicitudes
								</p>
								<p className="text-4xl font-bold text-secondary">
									{reportData.totalRequests}
								</p>
								<p className="text-sm text-default-500">
									{reportData.pendingRequests} pendientes
								</p>
							</CardBody>
						</Card>

						<Card shadow="sm">
							<CardBody className="gap-2 py-5">
								<p className="text-sm font-semibold text-default-600 uppercase tracking-wide">
									Tasa de Aprobación
								</p>
								<p className="text-4xl font-bold text-success">
									{approvalRate}%
								</p>
								<p className="text-sm text-default-500">
									{reportData.approvedRequests} aprobadas
								</p>
							</CardBody>
						</Card>

						<Card shadow="sm">
							<CardBody className="gap-2 py-5">
								<p className="text-sm font-semibold text-default-600 uppercase tracking-wide">
									Tiempo Promedio
								</p>
								<p className="text-4xl font-bold text-warning">
									{reportData.averageResponseTime}
								</p>
								<p className="text-sm text-default-500">días de respuesta</p>
							</CardBody>
						</Card>
					</div>

					{/* Distribución de usuarios */}
					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Distribución de Usuarios por Rol
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Total: {reportData.totalUsers} usuarios registrados
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="py-6">
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
								{/* Gráfico de pastel */}
								<div className="flex flex-col items-center">
									<h4 className="text-lg font-semibold text-default-800 mb-4">
										Gráfico de Distribución
									</h4>
									<ResponsiveContainer width="100%" height={300}>
										<PieChart>
											<Pie
												data={usersPieData}
												cx="50%"
												cy="50%"
												labelLine={true}
												label
												outerRadius={80}
												fill="#8884d8"
												dataKey="value"
											>
												{usersPieData.map((entry) => (
													<Cell key={entry.name} fill={entry.color} />
												))}
											</Pie>
											<Tooltip />
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</div>

								{/* Barras de progreso */}
								<div className="space-y-4">
									<h4 className="text-lg font-semibold text-default-800 mb-4">
										Detalles por Rol
									</h4>
									<div className="space-y-2">
										<div className="flex justify-between items-center mb-1">
											<span className="text-base font-medium text-default-700">
												Estudiantes
											</span>
											<span className="text-base font-bold text-primary">
												{reportData.usersByRole.students}
											</span>
										</div>
										<Progress
											value={
												(reportData.usersByRole.students /
													reportData.totalUsers) *
												100
											}
											color="primary"
											size="md"
											aria-label="Progreso estudiantes"
										/>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between items-center mb-1">
											<span className="text-base font-medium text-default-700">
												Profesores/Decanatura
											</span>
											<span className="text-base font-bold text-warning">
												{reportData.usersByRole.faculty}
											</span>
										</div>
										<Progress
											value={
												(reportData.usersByRole.faculty /
													reportData.totalUsers) *
												100
											}
											color="warning"
											size="md"
											aria-label="Progreso profesores"
										/>
									</div>

									<div className="space-y-2">
										<div className="flex justify-between items-center mb-1">
											<span className="text-base font-medium text-default-700">
												Administradores
											</span>
											<span className="text-base font-bold text-danger">
												{reportData.usersByRole.admin}
											</span>
										</div>
										<Progress
											value={
												(reportData.usersByRole.admin / reportData.totalUsers) *
												100
											}
											color="danger"
											size="md"
											aria-label="Progreso administradores"
										/>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>

					{/* Gráfico de solicitudes por estado */}
					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Estado de Solicitudes
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Distribución de solicitudes por estado actual
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="py-6">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={requestsPieData}
										cx="50%"
										cy="50%"
										labelLine={true}
										label
										outerRadius={100}
										fill="#8884d8"
										dataKey="value"
									>
										{requestsPieData.map((entry) => (
											<Cell key={entry.name} fill={entry.color} />
										))}
									</Pie>
									<Tooltip />
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>

					{/* Comparación entre carreras (solo en vista general) */}
					{selectedCareer === 'all' && (
						<Card>
							<CardHeader>
								<div>
									<h3 className="text-xl font-bold text-default-900">
										Comparación entre Carreras
									</h3>
									<p className="text-sm text-default-600 mt-1">
										Solicitudes y usuarios por programa académico
									</p>
								</div>
							</CardHeader>
							<Divider />
							<CardBody className="py-6">
								<ResponsiveContainer width="100%" height={350}>
									<BarChart
										data={[
											{
												name: 'Ing. Sistemas',
												Solicitudes: mockDataByCareers.sistemas.totalRequests,
												Usuarios: mockDataByCareers.sistemas.totalUsers,
											},
											{
												name: 'Ing. Industrial',
												Solicitudes: mockDataByCareers.industrial.totalRequests,
												Usuarios: mockDataByCareers.industrial.totalUsers,
											},
											{
												name: 'Ing. Civil',
												Solicitudes: mockDataByCareers.civil.totalRequests,
												Usuarios: mockDataByCareers.civil.totalUsers,
											},
											{
												name: 'Ing. Electrónica',
												Solicitudes:
													mockDataByCareers.electronica.totalRequests,
												Usuarios: mockDataByCareers.electronica.totalUsers,
											},
											{
												name: 'Ing. Mecánica',
												Solicitudes: mockDataByCareers.mecanica.totalRequests,
												Usuarios: mockDataByCareers.mecanica.totalUsers,
											},
										]}
										margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis
											dataKey="name"
											angle={-15}
											textAnchor="end"
											height={80}
										/>
										<YAxis />
										<Tooltip />
										<Legend />
										<Bar
											dataKey="Solicitudes"
											fill={COLORS.secondary}
											name="Solicitudes"
										/>
										<Bar
											dataKey="Usuarios"
											fill={COLORS.primary}
											name="Usuarios"
										/>
									</BarChart>
								</ResponsiveContainer>
							</CardBody>
						</Card>
					)}
				</div>
			)}

			{/* Vista Solicitudes */}
			{activeTab === 'requests' && (
				<div className="space-y-6">
					{/* Indicador de vista actual */}
					{selectedCareer !== 'all' && (
						<Card className="border-2 border-primary">
							<CardBody className="py-4">
								<div className="flex items-center gap-3">
									<Chip color="primary" size="lg" variant="flat">
										Vista de Carrera
									</Chip>
									<p className="text-base text-default-700">
										Mostrando solicitudes específicas de{' '}
										<span className="font-bold text-primary">
											{reportData.careerName}
										</span>
									</p>
								</div>
							</CardBody>
						</Card>
					)}

					{/* Gráfica de barras por mes */}
					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Tendencia de Solicitudes por Mes
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Visualización de solicitudes aprobadas, rechazadas y
									pendientes
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="py-6">
							<ResponsiveContainer width="100%" height={400}>
								<BarChart
									data={reportData.requestsByMonth}
									margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar
										dataKey="approved"
										fill={COLORS.success}
										name="Aprobadas"
									/>
									<Bar
										dataKey="rejected"
										fill={COLORS.danger}
										name="Rechazadas"
									/>
									<Bar
										dataKey="pending"
										fill={COLORS.warning}
										name="Pendientes"
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>

					{/* Gráfica de líneas para tendencias */}
					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Tendencia Temporal de Solicitudes
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Evolución del número de solicitudes a lo largo del tiempo
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="py-6">
							<ResponsiveContainer width="100%" height={350}>
								<LineChart
									data={reportData.requestsByMonth}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="month" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Line
										type="monotone"
										dataKey="approved"
										stroke={COLORS.success}
										strokeWidth={2}
										name="Aprobadas"
									/>
									<Line
										type="monotone"
										dataKey="rejected"
										stroke={COLORS.danger}
										strokeWidth={2}
										name="Rechazadas"
									/>
									<Line
										type="monotone"
										dataKey="pending"
										stroke={COLORS.warning}
										strokeWidth={2}
										name="Pendientes"
									/>
								</LineChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Solicitudes por Mes
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Distribución mensual de solicitudes por estado
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="overflow-x-auto">
							<Table
								aria-label="Tabla de solicitudes por mes"
								removeWrapper
								classNames={{
									th: 'text-sm font-bold',
									td: 'text-base',
								}}
							>
								<TableHeader>
									<TableColumn>MES</TableColumn>
									<TableColumn>APROBADAS</TableColumn>
									<TableColumn>RECHAZADAS</TableColumn>
									<TableColumn>PENDIENTES</TableColumn>
									<TableColumn>TOTAL</TableColumn>
								</TableHeader>
								<TableBody>
									{reportData.requestsByMonth.map((month) => (
										<TableRow key={month.month}>
											<TableCell className="font-semibold text-default-900">
												{month.month}
											</TableCell>
											<TableCell>
												<Chip color="success" variant="flat" size="md">
													{month.approved}
												</Chip>
											</TableCell>
											<TableCell>
												<Chip color="danger" variant="flat" size="md">
													{month.rejected}
												</Chip>
											</TableCell>
											<TableCell>
												<Chip color="warning" variant="flat" size="md">
													{month.pending}
												</Chip>
											</TableCell>
											<TableCell className="font-bold text-default-900">
												{month.approved + month.rejected + month.pending}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardBody>
					</Card>
				</div>
			)}

			{/* Vista Usuarios */}
			{activeTab === 'users' && (
				<div className="space-y-6">
					{/* Indicador de vista actual */}
					{selectedCareer !== 'all' && (
						<Card className="border-2 border-primary">
							<CardBody className="py-4">
								<div className="flex items-center gap-3">
									<Chip color="primary" size="lg" variant="flat">
										Vista de Carrera
									</Chip>
									<p className="text-base text-default-700">
										Mostrando usuarios específicos de{' '}
										<span className="font-bold text-primary">
											{reportData.careerName}
										</span>
									</p>
								</div>
							</CardBody>
						</Card>
					)}

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card shadow="sm">
							<CardBody className="gap-3 py-6">
								<div className="flex items-center justify-between">
									<p className="text-base font-semibold text-default-600 uppercase">
										Estudiantes
									</p>
									<Chip color="primary" variant="flat" size="lg">
										Activos
									</Chip>
								</div>
								<p className="text-5xl font-bold text-primary">
									{reportData.usersByRole.students}
								</p>
								<Progress
									value={
										(reportData.usersByRole.students / reportData.totalUsers) *
										100
									}
									color="primary"
									size="lg"
									showValueLabel
									aria-label="Porcentaje estudiantes"
								/>
							</CardBody>
						</Card>

						<Card shadow="sm">
							<CardBody className="gap-3 py-6">
								<div className="flex items-center justify-between">
									<p className="text-base font-semibold text-default-600 uppercase">
										Profesores
									</p>
									<Chip color="warning" variant="flat" size="lg">
										Activos
									</Chip>
								</div>
								<p className="text-5xl font-bold text-warning">
									{reportData.usersByRole.faculty}
								</p>
								<Progress
									value={
										(reportData.usersByRole.faculty / reportData.totalUsers) *
										100
									}
									color="warning"
									size="lg"
									showValueLabel
									aria-label="Porcentaje profesores"
								/>
							</CardBody>
						</Card>

						<Card shadow="sm">
							<CardBody className="gap-3 py-6">
								<div className="flex items-center justify-between">
									<p className="text-base font-semibold text-default-600 uppercase">
										Administradores
									</p>
									<Chip color="danger" variant="flat" size="lg">
										Activos
									</Chip>
								</div>
								<p className="text-5xl font-bold text-danger">
									{reportData.usersByRole.admin}
								</p>
								<Progress
									value={
										(reportData.usersByRole.admin / reportData.totalUsers) * 100
									}
									color="danger"
									size="lg"
									showValueLabel
									aria-label="Porcentaje administradores"
								/>
							</CardBody>
						</Card>
					</div>
					{/* Gráfica de barras comparativa */}
					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Comparativa de Usuarios por Rol
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Distribución visual de usuarios en el sistema
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="py-6">
							<ResponsiveContainer width="100%" height={350}>
								<BarChart
									data={[
										{
											name: 'Roles',
											Estudiantes: reportData.usersByRole.students,
											Profesores: reportData.usersByRole.faculty,
											Administradores: reportData.usersByRole.admin,
										},
									]}
									margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="name" />
									<YAxis />
									<Tooltip />
									<Legend />
									<Bar
										dataKey="Estudiantes"
										fill={COLORS.primary}
										name="Estudiantes"
									/>
									<Bar
										dataKey="Profesores"
										fill={COLORS.warning}
										name="Profesores"
									/>
									<Bar
										dataKey="Administradores"
										fill={COLORS.danger}
										name="Administradores"
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>
				</div>
			)}

			{/* Vista Materias */}
			{activeTab === 'subjects' && (
				<div className="space-y-6">
					{/* Indicador de vista actual */}
					{selectedCareer !== 'all' && (
						<Card className="border-2 border-primary">
							<CardBody className="py-4">
								<div className="flex items-center gap-3">
									<Chip color="primary" size="lg" variant="flat">
										Vista de Carrera
									</Chip>
									<p className="text-base text-default-700">
										Mostrando materias específicas de{' '}
										<span className="font-bold text-primary">
											{reportData.careerName}
										</span>
									</p>
								</div>
							</CardBody>
						</Card>
					)}

					{/* Gráfica de barras horizontales */}
					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Materias con Más Solicitudes
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Visualización de las materias más demandadas
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="py-6">
							<ResponsiveContainer width="100%" height={350}>
								<BarChart
									layout="vertical"
									data={reportData.topSubjects}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis type="number" />
									<YAxis dataKey="name" type="category" width={200} />
									<Tooltip />
									<Legend />
									<Bar
										dataKey="requests"
										fill={COLORS.secondary}
										name="Número de Solicitudes"
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>

					{/* Gráfica de tasa de aprobación */}
					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Tasa de Aprobación por Materia
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Porcentaje de aprobación para cada materia
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="py-6">
							<ResponsiveContainer width="100%" height={350}>
								<BarChart
									layout="vertical"
									data={reportData.topSubjects}
									margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
								>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis type="number" domain={[0, 100]} />
									<YAxis dataKey="name" type="category" width={200} />
									<Tooltip />
									<Legend />
									<Bar
										dataKey="approvalRate"
										fill={COLORS.success}
										name="Tasa de Aprobación (%)"
									/>
								</BarChart>
							</ResponsiveContainer>
						</CardBody>
					</Card>

					<Card>
						<CardHeader>
							<div>
								<h3 className="text-xl font-bold text-default-900">
									Top 5 Materias con Más Solicitudes
								</h3>
								<p className="text-sm text-default-600 mt-1">
									Materias más demandadas y su tasa de aprobación
								</p>
							</div>
						</CardHeader>
						<Divider />
						<CardBody className="overflow-x-auto">
							<Table
								aria-label="Tabla de materias más solicitadas"
								removeWrapper
								classNames={{
									th: 'text-sm font-bold',
									td: 'text-base',
								}}
							>
								<TableHeader>
									<TableColumn>MATERIA</TableColumn>
									<TableColumn>SOLICITUDES</TableColumn>
									<TableColumn>TASA DE APROBACIÓN</TableColumn>
									<TableColumn>PROGRESO</TableColumn>
								</TableHeader>
								<TableBody>
									{reportData.topSubjects.map((subject, idx) => (
										<TableRow key={subject.name}>
											<TableCell>
												<div>
													<p className="font-semibold text-default-900">
														{subject.name}
													</p>
													<p className="text-sm text-default-500">
														Ranking #{idx + 1}
													</p>
												</div>
											</TableCell>
											<TableCell>
												<Chip color="secondary" variant="flat" size="lg">
													{subject.requests}
												</Chip>
											</TableCell>
											<TableCell>
												<span className="text-lg font-bold text-success">
													{subject.approvalRate}%
												</span>
											</TableCell>
											<TableCell>
												<Progress
													value={subject.approvalRate}
													color={
														subject.approvalRate >= 85
															? 'success'
															: subject.approvalRate >= 70
																? 'warning'
																: 'danger'
													}
													size="md"
													className="max-w-md"
													aria-label={`Aprobación ${subject.name}`}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardBody>
					</Card>
				</div>
			)}

			<Spacer y={4} />
		</div>
	);
}
