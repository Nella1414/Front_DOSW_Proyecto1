import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HeroUIProvider } from '@heroui/react';
import React from 'react';

// Creamos el cliente de React Query una sola vez
// Este maneja todo el cache y estado de las peticiones HTTP
const queryClient = new QueryClient();

// Componente que envuelve toda la app con los providers necesarios
// React Query para manejo de datos y HeroUI para los componentes de interfaz
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider>
        {children}
      </HeroUIProvider>
    </QueryClientProvider>
  );
}