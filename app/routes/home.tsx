import { Button, ButtonGroup, Checkbox } from '@heroui/react';

export function meta() {
	return [
		{ title: 'SIRHA - DOSW' },
		{ name: 'description', content: 'Welcome to SIRHA - DOSW!' },
	];
}

export default function Home() {
	return (
		<div className="w-dvw h-dvh grid place-items-center">
			<h1 className="text-7xl">Hola DOSW</h1>
			<Button color="primary" size="lg" className="mt-4">
				¡Bienvenido a SIRHA - DOSW!
			</Button>
		</div>
	);
}
