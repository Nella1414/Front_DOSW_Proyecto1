import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequestHandler } from '@react-router/express';
import compression from 'compression';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(compression());
app.disable('x-powered-by');

// Serve static assets
app.use(
	'/assets',
	express.static(join(__dirname, '..', 'build', 'client', 'assets'), {
		immutable: true,
		maxAge: '1y',
	}),
);

app.use(
	express.static(join(__dirname, '..', 'build', 'client'), { maxAge: '1h' }),
);

// Handle SSR requests
const requestHandler = createRequestHandler({
	build: await import('../build/server/index.js'),
});

app.use(requestHandler);

// Export for Vercel serverless
export default app;
