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
}

// Mock data para reportes
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

export function Reports() {
	const [selectedPeriod, setSelectedPeriod] = useState('2024-2');
	const [activeTab, setActiveTab] = useState('overview');

	// Query para obtener datos de reportes
	const { data: reportData = mockReportData } = useQuery({
		queryKey: ['reports', selectedPeriod],
		queryFn: async (): Promise<ReportData> => {
			await new Promise((resolve) => setTimeout(resolve, 800));
			return mockReportData;
		},
	}); // Calcular tasa de aprobación
	const approvalRate = reportData.totalRequests
		? Math.round((reportData.approvedRequests / reportData.totalRequests) * 100)
		: 0;

	// Exportar reporte a CSV
	const handleExportCSV = () => {
		const csvContent = [
			['Métrica', 'Valor'],
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
			`reporte_${selectedPeriod}_${Date.now()}.csv`,
		);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	// Exportar reporte detallado a PDF (simulado)
	const handleExportPDF = () => {
		alert(
			`Generando reporte PDF para el período ${selectedPeriod}...\n\nEn una implementación real, esto generaría un PDF con gráficos y análisis detallados.`,
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
							Métricas y estadísticas del sistema SIRHA
						</p>
					</div>
					<div className="flex gap-3 items-center">
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
						<CardBody className="space-y-4 py-6">
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
										(reportData.usersByRole.students / reportData.totalUsers) *
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
										(reportData.usersByRole.faculty / reportData.totalUsers) *
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
										(reportData.usersByRole.admin / reportData.totalUsers) * 100
									}
									color="danger"
									size="md"
									aria-label="Progreso administradores"
								/>
							</div>
						</CardBody>
					</Card>
				</div>
			)}

			{/* Vista Solicitudes */}
			{activeTab === 'requests' && (
				<div className="space-y-6">
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
				</div>
			)}

			{/* Vista Materias */}
			{activeTab === 'subjects' && (
				<div className="space-y-6">
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
