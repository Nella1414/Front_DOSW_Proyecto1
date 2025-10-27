import type { Config } from '@react-router/dev/config';
import { vercelPreset } from '@vercel/react-router/vite';

export default {
	// Config options...
	// Enable server-side rendering for production deployment
	// SSR provides better SEO, performance, and handles routing correctly on Azure
	ssr: true,
	presets: [vercelPreset()],
} satisfies Config;
