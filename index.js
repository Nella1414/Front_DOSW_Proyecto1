// Simple wrapper to import and run the ES module server
// This file stays in CommonJS to work with Azure's default loader
import('./server.mjs').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
