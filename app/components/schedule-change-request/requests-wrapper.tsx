import { Card, CardBody, Tab, Tabs } from '@heroui/react';
import { useState } from 'react';
import { CourseEnrollmentView } from './course-enrollment-view';
import { CreateRequestView } from './create-request-view';

export const RequestsWrapper: React.FC = () => {
	const [selectedTab, setSelectedTab] = useState<string>('enrollment');

	return (
		<div className="space-y-4">
			<Card shadow="sm" radius="sm">
				<CardBody className="p-0">
					<Tabs
						aria-label="Opciones de solicitud"
						selectedKey={selectedTab}
						onSelectionChange={(key) => setSelectedTab(key as string)}
						className="w-full"
						classNames={{
							tabList: 'w-full',
							tab: 'h-12',
						}}
					>
						<Tab
							key="enrollment"
							title={
								<div className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5"
										aria-label="Icono de inscripción"
										role="img"
									>
										<title>Inscripción</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
										/>
									</svg>
									<span>Inscripción de Materia</span>
								</div>
							}
						/>
						<Tab
							key="change"
							title={
								<div className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="w-5 h-5"
										aria-label="Icono de solicitud de cambio"
										role="img"
									>
										<title>Solicitud de Cambio</title>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
										/>
									</svg>
									<span>Solicitud de Cambio</span>
								</div>
							}
						/>
					</Tabs>
				</CardBody>
			</Card>

			<div className="mt-6">
				{selectedTab === 'enrollment' ? (
					<CourseEnrollmentView />
				) : (
					<CreateRequestView />
				)}
			</div>
		</div>
	);
};
