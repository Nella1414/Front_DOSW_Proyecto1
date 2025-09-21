import { useState } from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab } from '@heroui/react';
import { StudentRegistration } from '../components/StudentRegistration';
import { RoleManagement } from '../components/RoleManagement';

// Página principal del panel de administración
// Tiene dos pestañas: una para registrar estudiantes y otra para manejar roles
export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          SIRHA - Panel de Administración
        </h1>
        
        {/* Tabs para organizar las diferentes funciones del admin */}
        <Tabs aria-label="Admin options" className="w-full">
          {/* Pestaña para registrar nuevos estudiantes */}
          <Tab key="students" title="Registro de Estudiantes">
            <Card className="mt-4">
              <CardHeader>
                <h2 className="text-xl font-semibold">Registro de Nuevos Estudiantes</h2>
              </CardHeader>
              <CardBody>
                <StudentRegistration />
              </CardBody>
            </Card>
          </Tab>
          
          {/* Pestaña para manejar roles de usuarios existentes */}
          <Tab key="roles" title="Gestión de Roles">
            <Card className="mt-4">
              <CardHeader>
                <h2 className="text-xl font-semibold">Asignación de Roles de Usuario</h2>
              </CardHeader>
              <CardBody>
                <RoleManagement />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}