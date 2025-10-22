import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequestHandler } from '@react-router/express';
import compression from 'compression';
import express from 'express';
import morgan from 'morgan';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteDevServer =
	process.env.NODE_ENV === 'production'
		? undefined
		: await import('vite').then((vite) =>
				vite.createServer({
					server: { middlewareMode: true },
				}),
			);

const app = express();

// Add middleware
app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// handle asset requests
if (viteDevServer) {
	app.use(viteDevServer.middlewares);
} else {
	// Vite fingerprints its assets so we can cache forever.
	app.use(
		'/assets',
		express.static('build/client/assets', { immutable: true, maxAge: '1y' }),
	);
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('build/client', { maxAge: '1h' }));

app.use(morgan('tiny'));

// handle SSR requests - use app.use instead of app.all for Express 5 compatibility
app.use(
	createRequestHandler({
		build: viteDevServer
			? () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
			: await import('./build/server/index.js'),
	}),
);

// Read PORT and HOST from environment variables
// Azure App Service sets PORT dynamically (usually 8080)
// HOST should be 0.0.0.0 to listen on all network interfaces
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, host, () => {
	console.log(`[server] Express server listening on http://${host}:${port}`);
	console.log(`[server] Environment: ${process.env.NODE_ENV || 'development'}`);
});
