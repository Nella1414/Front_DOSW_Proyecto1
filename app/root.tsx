import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from 'react-router';

import type { Route } from './+types/root';
import './app.css';
import { Select, SelectItem, Snippet } from '@heroui/react';
import { Providers, themes, useTheme } from './providers';

// Aquí configuramos las fuentes que va a usar toda la app
// Preconectamos a Google Fonts para que cargue más rápido
export const links: Route.LinksFunction = () => [
	{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
	{
		rel: 'preconnect',
		href: 'https://fonts.gstatic.com',
		crossOrigin: 'anonymous',
	},
	{
		rel: 'stylesheet',
		href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
	},
];

// Este es el layout base de toda la aplicación
// Envuelve todo en los providers y configura el HTML básico

// light | dark | theme2light | theme2dark | citrus | corporate
// earth | cyberpunk | neonInk | forestMist | solarEclipse | retroWave
// oceanDepths | brand
export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{/* Aquí metemos todos los providers (React Query, HeroUI, etc.) */}
				<Providers>{children}</Providers>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

// El componente principal - básicamente solo renderiza las rutas
export default function App() {
	const { theme, setTheme } = useTheme();

	return (
		<>
			<Select
				selectedKeys={[theme]}
				onSelectionChange={(keys) =>
					setTheme((keys.currentKey as typeof theme) || 'brand')
				}
				className="fixed top-4 right-4 z-50 w-[8rem]"
				classNames={{
					value: 'capitalize',
				}}
				size="sm"
			>
				{themes.map((theme) => (
					<SelectItem key={theme} className="capitalize">
						{theme}
					</SelectItem>
				))}
			</Select>
			<Outlet />
		</>
	);
}

// Maneja todos los errores que puedan pasar en la app
// Si es 404 muestra un mensaje específico, si no, muestra el error genérico
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = 'Oops!';
	let details = 'An unexpected error occurred.';
	let stack: string | undefined;

	// Checa si es un error de ruta (como 404)
	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? '404' : 'Error';
		details =
			error.status === 404
				? 'The requested page could not be found.'
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		// En desarrollo, muestra más detalles del error
		details = error.message;
		stack = error.stack;
	}

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{/* Solo muestra el stack trace en desarrollo */}
			{stack && (
				<Snippet className="w-full" hideCopyButton variant="bordered">
					{stack}
				</Snippet>
			)}
		</main>
	);
}
