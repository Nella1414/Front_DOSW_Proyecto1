// Health check endpoint for Azure Container Apps
// This route is used by Azure to verify the application is running correctly

import type { Route } from './+types/health';

export function loader({ request }: Route.LoaderArgs) {
	return new Response(
		JSON.stringify({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			environment: process.env.NODE_ENV || 'development',
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
			},
		},
	);
}
