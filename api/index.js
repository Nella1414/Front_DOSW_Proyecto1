import { createRequestHandler } from '@react-router/express';
import express from 'express';

const app = express();

// Serve static assets from the build directory
app.use(
	'/assets',
	express.static('build/client/assets', {
		immutable: true,
		maxAge: '1y',
	}),
);

app.use(express.static('build/client', { maxAge: '1h' }));

// Handle all other requests with React Router
app.all(
	'*',
	createRequestHandler({
		build: await import('../build/server/index.js'),
	}),
);

export default app;
