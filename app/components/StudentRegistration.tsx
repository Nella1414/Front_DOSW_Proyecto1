import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { Input, Select, SelectItem, Button, Alert } from '@heroui/react';
import { generateRadicado } from '../lib/api';

// Lista de todas las carreras disponibles en la universidad
const CAREERS = [
  'Ingeniería en Biotecnología',
  'Ingeniería de Inteligencia Artificial',
  'Ingeniería de Ciberseguridad',
  'Ingeniería Civil',
  'Ingeniería Ambiental',
  'Ingeniería Estadística',
  'Ingeniería Eléctrica',
  'Ingeniería de Sistemas',
  'Administración de empresas',
  'Matemáticas',
  'Ingeniería Mecánica',
  'Ingeniería Biomédica'
];

interface StudentData {
  code: string;
  name: string;
  career: string;
  email: string;
}

// Componente para registrar nuevos estudiantes
// Maneja validaciones, envío de datos y muestra mensajes de éxito/error
export function StudentRegistration() {
  // Estado para mostrar mensaje de éxito cuando se registra un estudiante
  const [success, setSuccess] = useState<{ name: string; radicado: string } | null>(null);

  // Mutación para registrar el estudiante
  // Simula una llamada al servidor con delay y validación de código duplicado
  const registerStudent = useMutation({
    mutationFn: async (data: StudentData) => {
      // Simula delay de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simula error si el código ya existe
      if (data.code === '1234567890') {
        throw new Error('El código de estudiante ya existe');
      }
      return { name: data.name, radicado: generateRadicado() };
    },
    onSuccess: (data) => {
      // Cuando se registra exitosamente, muestra el mensaje y limpia el form
      setSuccess({ name: data.name, radicado: data.radicado });
      form.reset();
    }
  });

  // Configuración del formulario con TanStack Form
  // Maneja el estado de todos los campos y las validaciones
  const form = useForm({
    defaultValues: {
      code: '',
      name: '',
      career: '',
      email: ''
    },
    onSubmit: async ({ value }) => {
      registerStudent.mutate(value);
    }
  });

  return (
    <div className="space-y-6">
      {success && (
        <Alert color="success" title="Estudiante registrado exitosamente">
          Estudiante: {success.name} | Radicado: {success.radicado}
        </Alert>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Campo para el código del estudiante - debe ser exactamente 10 dígitos */}
        <form.Field
          name="code"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Código requerido';
              if (!/^\d{10}$/.test(value)) return 'Debe ser exactamente 10 dígitos';
            }
          }}
        >
          {(field) => (
            <Input
              label="Código de Estudiante"
              placeholder="1234567890"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors[0]}
              maxLength={10}
              isRequired
            />
          )}
        </form.Field>

        {/* Campo para el nombre - solo acepta letras, espacios y acentos */}
        <form.Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Nombre requerido';
              if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) return 'Solo letras y espacios';
            }
          }}
        >
          {(field) => (
            <Input
              label="Nombre Completo"
              placeholder="Juan Pérez García"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors[0]}
              isRequired
            />
          )}
        </form.Field>

        {/* Select para elegir la carrera - valida que esté en la lista */}
        <form.Field
          name="career"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Carrera requerida';
              if (!CAREERS.includes(value)) return 'Carrera no válida';
            }
          }}
        >
          {(field) => (
            <Select
              label="Carrera"
              placeholder="Selecciona una carrera"
              selectedKeys={field.state.value ? [field.state.value] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                field.handleChange(selected);
              }}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors[0]}
              isRequired
            >
              {CAREERS.map((career) => (
                <SelectItem key={career}>
                  {career}
                </SelectItem>
              ))}
            </Select>
          )}
        </form.Field>

        {/* Campo de email - debe seguir el formato institucional */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value) return 'Correo requerido';
              const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@escuelaing\.edu\.co$/;
              if (!emailRegex.test(value)) return 'Formato: nombre.apellido@escuelaing.edu.co';
            }
          }}
        >
          {(field) => (
            <Input
              label="Correo Institucional"
              placeholder="juan.perez@escuelaing.edu.co"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              isInvalid={!!field.state.meta.errors.length}
              errorMessage={field.state.meta.errors[0]}
              isRequired
            />
          )}
        </form.Field>

        <Button
          type="submit"
          color="primary"
          isLoading={registerStudent.isPending}
          className="w-full"
        >
          Registrar Estudiante
        </Button>

        {registerStudent.error && (
          <Alert color="danger" title="Error al registrar">
            {registerStudent.error.message}
          </Alert>
        )}
      </form>
    </div>
  );
}