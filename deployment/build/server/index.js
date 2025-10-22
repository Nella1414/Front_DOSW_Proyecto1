import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Links, ScrollRestoration, Scripts } from "react-router";
import { HeroUIProvider, Image, Button, Link, Alert, Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Select, SelectItem, Tabs, Tab, Card, CardHeader, CardBody, Divider, CardFooter, Form, Checkbox, Spinner, Tooltip, Accordion, AccordionItem, Progress, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, Textarea, ModalFooter, Avatar, ScrollShadow, Badge, Spacer } from "@heroui/react";
import { QueryClient, QueryClientProvider, useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import React, { createContext, useState, useCallback, useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const userAgent = request.headers.get("user-agent");
    const readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const queryClient = new QueryClient();
const ThemeContext = createContext(null);
const ThemeContextProvider = ({ children }) => {
  const [innerTheme, innerSetTheme] = useState("light");
  const setTheme = useCallback(
    (theme) => {
      if (document == null ? void 0 : document.documentElement.classList.contains(innerTheme)) {
        document.documentElement.classList.remove(innerTheme);
      }
      document.documentElement.classList.add(theme);
      return innerSetTheme(theme);
    },
    [innerTheme]
  );
  const value = {
    theme: innerTheme,
    setTheme
  };
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { value, children });
};
function Providers({ children }) {
  return /* @__PURE__ */ jsx(ThemeContextProvider, { children: /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(HeroUIProvider, { children }) }) });
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx("title", {
        children: "DOSW - Sistema de Gestión Académica"
      }), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(Providers, {
        children
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function meta$3() {
  return [{
    title: "SIRHA - Sistema Universitario"
  }, {
    name: "description",
    content: "Sistema de Reasignación de Horarios Académicos"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-white",
    children: [/* @__PURE__ */ jsxs("header", {
      className: "flex justify-between items-center px-6 py-3 bg-primary border-b border-gray-200",
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex items-center",
        children: /* @__PURE__ */ jsx(Image, {
          src: "/logo.jpg",
          alt: "Logo",
          width: 160,
          height: 67,
          className: "object-cover"
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex gap-3",
        children: [/* @__PURE__ */ jsx(Button, {
          as: Link,
          href: "/login",
          variant: "bordered",
          color: "default",
          size: "md",
          className: "border-white text-white hover:bg-white hover:text-primary",
          children: "Iniciar sesión"
        }), /* @__PURE__ */ jsx(Button, {
          as: Link,
          href: "/register",
          color: "default",
          size: "md",
          className: "bg-white text-primary hover:bg-gray-100",
          children: "Registrarse"
        })]
      })]
    }), /* @__PURE__ */ jsx("main", {
      className: "flex items-center justify-center min-h-[calc(100vh-120px)] px-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto gap-12",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex-1 text-left",
          children: [/* @__PURE__ */ jsx("h1", {
            className: "text-6xl md:text-8xl font-bold text-primary mb-6",
            children: "SIRHA"
          }), /* @__PURE__ */ jsx("p", {
            className: "text-2xl md:text-3xl text-gray-800 font-medium",
            children: "Sistema de Reasignación de Horarios Académicos"
          })]
        }), /* @__PURE__ */ jsx("div", {
          className: "flex-1",
          children: /* @__PURE__ */ jsx(Image, {
            src: "/universidad.jpg",
            alt: "Universidad",
            width: 571,
            height: 256,
            className: "object-cover rounded-lg shadow-lg"
          })
        })]
      })
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$3
}, Symbol.toStringTag, { value: "Module" }));
const mockUsers = [
  {
    id: "1",
    name: "Juan Pérez García",
    email: "juan.perez@escuelaing.edu.co",
    role: "STUDENT"
  },
  {
    id: "2",
    name: "María González López",
    email: "maria.gonzalez@escuelaing.edu.co",
    role: "DEAN"
  },
  {
    id: "3",
    name: "Carlos Rodríguez Silva",
    email: "carlos.rodriguez@escuelaing.edu.co",
    role: "ADMIN"
  },
  {
    id: "4",
    name: "Ana Martínez Torres",
    email: "ana.martinez@escuelaing.edu.co",
    role: "STUDENT"
  }
];
const generateRadicado = () => {
  return `RAD-${Date.now()}-${Math.floor(Math.random() * 1e3)}`;
};
const ROLES = [
  { label: "Estudiante", value: "STUDENT" },
  { label: "Decanatura", value: "DEAN" },
  { label: "Administrador", value: "ADMIN" }
];
const getRoleLabel = (roleValue) => {
  const role = ROLES.find((r) => r.value === roleValue);
  return role ? role.label : roleValue;
};
function RoleManagement() {
  const [selectedUser, setSelectedUser] = useState("");
  const [newRole, setNewRole] = useState("");
  const [success, setSuccess] = useState(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient2 = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockUsers;
    }
  });
  const updateRole = useMutation({
    mutationFn: async ({ userId, role }) => {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      const user = mockUsers.find((u) => u.id === userId);
      if (!user) throw new Error("Usuario no encontrado");
      console.log("Sending to backend:", { userId, role });
      return { name: user.name, role };
    },
    onSuccess: (data) => {
      setSuccess({ user: data.name, role: getRoleLabel(data.role) });
      queryClient2.invalidateQueries({ queryKey: ["users"] });
      setSelectedUser("");
      setNewRole("");
    }
  });
  const filteredUsers = users.filter(
    (user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
      case "administrador":
        return "danger";
      // Rojo para admin
      case "DEAN":
      case "decanatura":
        return "warning";
      // Amarillo para decanatura
      case "STUDENT":
      case "estudiante":
        return "primary";
      // Azul para estudiante
      default:
        return "default";
    }
  };
  const handleRoleUpdate = () => {
    if (selectedUser && newRole) {
      updateRole.mutate({ userId: selectedUser, role: newRole });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    success && /* @__PURE__ */ jsxs(Alert, { color: "success", title: "Rol actualizado exitosamente", children: [
      "Usuario: ",
      success.user,
      " | Nuevo rol: ",
      success.role
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex gap-4 items-end", children: /* @__PURE__ */ jsx(
      Input,
      {
        label: "Buscar usuario",
        placeholder: "Nombre o correo...",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        className: "flex-1"
      }
    ) }),
    /* @__PURE__ */ jsxs(Table, { "aria-label": "Tabla de usuarios", children: [
      /* @__PURE__ */ jsxs(TableHeader, { children: [
        /* @__PURE__ */ jsx(TableColumn, { children: "NOMBRE" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "CORREO" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "ROL ACTUAL" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "ACCIONES" })
      ] }),
      /* @__PURE__ */ jsx(TableBody, { isLoading, children: filteredUsers.map((user) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: user.name }),
        /* @__PURE__ */ jsx(TableCell, { children: user.email }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Chip, { color: getRoleColor(user.role), variant: "flat", children: getRoleLabel(user.role) }) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            variant: "light",
            onPress: () => setSelectedUser(user.id),
            children: "Cambiar rol"
          }
        ) })
      ] }, user.id)) })
    ] }),
    selectedUser && /* @__PURE__ */ jsxs("div", { className: "bg-default-50 p-4 rounded-lg space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Asignar nuevo rol" }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-end", children: [
        /* @__PURE__ */ jsx(
          Select,
          {
            label: "Nuevo rol",
            placeholder: "Selecciona un rol",
            selectedKeys: newRole ? [newRole] : [],
            onSelectionChange: (keys) => {
              const selected = Array.from(keys)[0];
              setNewRole(selected);
            },
            className: "flex-1",
            children: ROLES.map((role) => /* @__PURE__ */ jsx(SelectItem, { children: role.label }, role.value))
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            color: "primary",
            onPress: handleRoleUpdate,
            isLoading: updateRole.isPending,
            isDisabled: !newRole,
            children: "Asignar"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: "light",
            onPress: () => {
              setSelectedUser("");
              setNewRole("");
            },
            children: "Cancelar"
          }
        )
      ] })
    ] }),
    updateRole.error && /* @__PURE__ */ jsx(Alert, { color: "danger", title: "Error al actualizar rol", children: updateRole.error.message })
  ] });
}
const CAREERS = [
  "Ingeniería en Biotecnología",
  "Ingeniería de Inteligencia Artificial",
  "Ingeniería de Ciberseguridad",
  "Ingeniería Civil",
  "Ingeniería Ambiental",
  "Ingeniería Estadística",
  "Ingeniería Eléctrica",
  "Ingeniería de Sistemas",
  "Administración de empresas",
  "Matemáticas",
  "Ingeniería Mecánica",
  "Ingeniería Biomédica"
];
function StudentRegistration() {
  const [success, setSuccess] = useState(null);
  const registerStudent = useMutation({
    mutationFn: async (data) => {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      if (data.code === "1234567890") {
        throw new Error("El código de estudiante ya existe");
      }
      return { name: data.name, radicado: generateRadicado() };
    },
    onSuccess: (data) => {
      setSuccess({ name: data.name, radicado: data.radicado });
      form.reset();
    }
  });
  const form = useForm({
    defaultValues: {
      code: "",
      name: "",
      career: "",
      email: ""
    },
    onSubmit: async ({ value }) => {
      registerStudent.mutate(value);
    }
  });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    success && /* @__PURE__ */ jsxs(Alert, { color: "success", title: "Estudiante registrado exitosamente", children: [
      "Estudiante: ",
      success.name,
      " | Radicado: ",
      success.radicado
    ] }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          form.handleSubmit();
        },
        className: "space-y-4",
        children: [
          /* @__PURE__ */ jsx(
            form.Field,
            {
              name: "code",
              validators: {
                onChange: ({ value }) => {
                  if (!value) return "Código requerido";
                  if (!/^\d{10}$/.test(value))
                    return "Debe ser exactamente 10 dígitos";
                }
              },
              children: (field) => /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Código de Estudiante",
                  placeholder: "1234567890",
                  value: field.state.value,
                  onChange: (e) => field.handleChange(e.target.value),
                  isInvalid: !!field.state.meta.errors.length,
                  errorMessage: field.state.meta.errors[0],
                  maxLength: 10,
                  isRequired: true
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            form.Field,
            {
              name: "name",
              validators: {
                onChange: ({ value }) => {
                  if (!value) return "Nombre requerido";
                  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value))
                    return "Solo letras y espacios";
                }
              },
              children: (field) => /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Nombre Completo",
                  placeholder: "Juan Pérez García",
                  value: field.state.value,
                  onChange: (e) => field.handleChange(e.target.value),
                  isInvalid: !!field.state.meta.errors.length,
                  errorMessage: field.state.meta.errors[0],
                  isRequired: true
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            form.Field,
            {
              name: "career",
              validators: {
                onChange: ({ value }) => {
                  if (!value) return "Carrera requerida";
                  if (!CAREERS.includes(value)) return "Carrera no válida";
                }
              },
              children: (field) => /* @__PURE__ */ jsx(
                Select,
                {
                  label: "Carrera",
                  placeholder: "Selecciona una carrera",
                  selectedKeys: field.state.value ? [field.state.value] : [],
                  onSelectionChange: (keys) => {
                    const selected = Array.from(keys)[0];
                    field.handleChange(selected);
                  },
                  isInvalid: !!field.state.meta.errors.length,
                  errorMessage: field.state.meta.errors[0],
                  isRequired: true,
                  children: CAREERS.map((career) => /* @__PURE__ */ jsx(SelectItem, { className: "text-default-900", children: career }, career))
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            form.Field,
            {
              name: "email",
              validators: {
                onChange: ({ value }) => {
                  if (!value) return "Correo requerido";
                  const emailRegex = /^[a-zA-Z]+\.[a-zA-Z]+@escuelaing\.edu\.co$/;
                  if (!emailRegex.test(value))
                    return "Formato: nombre.apellido@escuelaing.edu.co";
                }
              },
              children: (field) => /* @__PURE__ */ jsx(
                Input,
                {
                  label: "Correo Institucional",
                  placeholder: "juan.perez@escuelaing.edu.co",
                  value: field.state.value,
                  onChange: (e) => field.handleChange(e.target.value),
                  isInvalid: !!field.state.meta.errors.length,
                  errorMessage: field.state.meta.errors[0],
                  isRequired: true
                }
              )
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              type: "submit",
              color: "primary",
              isLoading: registerStudent.isPending,
              className: "w-full",
              children: "Registrar Estudiante"
            }
          ),
          registerStudent.error && /* @__PURE__ */ jsx(Alert, { color: "danger", title: "Error al registrar", children: registerStudent.error.message })
        ]
      }
    )
  ] });
}
const admin = UNSAFE_withComponentProps(function AdminPage() {
  return /* @__PURE__ */ jsx("div", {
    className: "min-h-screen bg-default-50 p-6",
    children: /* @__PURE__ */ jsxs("div", {
      className: "max-w-6xl mx-auto",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold text-default-900 mb-8",
        children: "SIRHA - Panel de Administración"
      }), /* @__PURE__ */ jsxs(Tabs, {
        "aria-label": "Admin options",
        className: "w-full",
        children: [/* @__PURE__ */ jsx(Tab, {
          title: "Registro de Estudiantes",
          children: /* @__PURE__ */ jsxs(Card, {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold",
                children: "Registro de Nuevos Estudiantes"
              })
            }), /* @__PURE__ */ jsx(CardBody, {
              children: /* @__PURE__ */ jsx(StudentRegistration, {})
            })]
          })
        }, "students"), /* @__PURE__ */ jsx(Tab, {
          title: "Gestión de Roles",
          children: /* @__PURE__ */ jsxs(Card, {
            className: "mt-4",
            children: [/* @__PURE__ */ jsx(CardHeader, {
              children: /* @__PURE__ */ jsx("h2", {
                className: "text-xl font-semibold",
                children: "Asignación de Roles de Usuario"
              })
            }), /* @__PURE__ */ jsx(CardBody, {
              children: /* @__PURE__ */ jsx(RoleManagement, {})
            })]
          })
        }, "roles")]
      })]
    })
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: admin
}, Symbol.toStringTag, { value: "Module" }));
function DemoCredentials() {
  return /* @__PURE__ */ jsxs(Card, { className: "max-w-md mx-auto mt-4", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-center w-full", children: "Credenciales de Prueba" }) }),
    /* @__PURE__ */ jsx(Divider, {}),
    /* @__PURE__ */ jsxs(CardBody, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(Chip, { color: "danger", variant: "flat", size: "sm", children: "ADMIN" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Administrador" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs space-y-1 text-default-600", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Email:" }),
            " du.important@gmail.com"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Password:" }),
            " 123456789"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx(Divider, {}),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx(Chip, { color: "primary", variant: "flat", size: "sm", children: "STUDENT" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Estudiante" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs space-y-1 text-default-600", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Email:" }),
            " juan.perez@escuelaing.edu.co"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Password:" }),
            " 123456789"
          ] }),
          /* @__PURE__ */ jsxs("p", { children: [
            /* @__PURE__ */ jsx("strong", { children: "Programa:" }),
            " Ingeniería de Sistemas"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function meta$2() {
  return [{
    title: "Login - SIRHA - DOSW"
  }, {
    name: "description",
    content: "Login to SIRHA - DOSW"
  }];
}
const login = UNSAFE_withComponentProps(function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Login attempt:", {
        email,
        password
      });
      if (email === "du.important@gmail.com" && password === "123456789") {
        window.location.href = "/admin-dashboard";
      } else if (email === "juan.perez@escuelaing.edu.co" && password === "123456789") {
        window.location.href = "/student-dashboard";
      } else {
        alert("Credenciales inválidas. Verifica tu email y contraseña.");
      }
      setIsLoading(false);
    }, 2e3);
  };
  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      console.log("Google login attempt");
      setIsLoading(false);
    }, 1500);
  };
  useEffect(() => {
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen flex flex-col items-center justify-center bg-gradient-to-br dark:bg-gradient-to-tl from-content3 to-content1 p-4",
    children: [/* @__PURE__ */ jsxs(Card, {
      className: "w-full max-w-md container mx-auto bg-content4 shadow-medium",
      children: [/* @__PURE__ */ jsx(CardHeader, {
        className: "flex flex-col items-center pb-2 mt-5",
        children: /* @__PURE__ */ jsx(Button, {
          variant: "shadow",
          color: "primary",
          size: "lg",
          className: "mb-2",
          children: /* @__PURE__ */ jsx("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            className: "size-10",
            children: /* @__PURE__ */ jsx("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
            })
          })
        })
      }), /* @__PURE__ */ jsx(CardBody, {
        className: "flex flex-col items-center text-center",
        children: /* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-medium items-center text-2xl-900 mb-2",
          children: "SIRHA - DOSW"
        })
      }), /* @__PURE__ */ jsx(CardFooter, {
        className: "flex justify-center mb-5",
        children: /* @__PURE__ */ jsx("p", {
          className: "text-small text-default-600",
          children: "Academic Schedule Reassignment System"
        })
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      className: "w-full max-w-md shadow-medium container mx-auto bg-content4 mt-10",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "flex flex-col items-center pb-2 mt-5",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-2xl font-medium text-default-900 mb-2",
          children: "Sign In to Your Account!"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-default-600 text-center",
          children: "Enter your credentials to access your account"
        })]
      }), /* @__PURE__ */ jsxs(CardBody, {
        className: "space-y-5 px-5",
        children: [/* @__PURE__ */ jsxs(Form, {
          onSubmit: handleEmailLogin,
          className: "space-y-4",
          children: [/* @__PURE__ */ jsx(Input, {
            type: "email",
            label: "Email",
            placeholder: "you@email.com",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            isRequired: true,
            size: "lg",
            color: "primary",
            variant: "faded",
            className: "w-full"
          }), /* @__PURE__ */ jsx(Input, {
            type: "password",
            label: "Password",
            placeholder: "••••••••",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            isRequired: true,
            size: "lg",
            color: "primary",
            variant: "faded",
            className: "w-full"
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex justify-between items-center text-small w-full",
            children: [/* @__PURE__ */ jsx(Checkbox, {
              size: "sm",
              children: "Remember me"
            }), /* @__PURE__ */ jsx(Link, {
              href: "#",
              className: "text-primary-600 hover:text-primary-800",
              children: "Forgot your password?"
            })]
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            color: "primary",
            size: "lg",
            className: "loginButton w-full",
            isLoading,
            isDisabled: isLoading,
            children: isLoading ? "Iniciando sesión..." : "Iniciar sesión"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-3",
          children: [/* @__PURE__ */ jsx(Divider, {
            className: "flex-1"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-small text-default-100",
            children: "O continúa con"
          }), /* @__PURE__ */ jsx(Divider, {
            className: "flex-1"
          })]
        }), /* @__PURE__ */ jsx(Button, {
          onClick: handleGoogleLogin,
          variant: "bordered",
          size: "lg",
          className: "loginGoogle w-full",
          isLoading,
          isDisabled: isLoading,
          startContent: /* @__PURE__ */ jsxs("svg", {
            className: "w-5 h-5",
            viewBox: "0 0 24 24",
            "aria-label": "Google logo",
            role: "img",
            children: [/* @__PURE__ */ jsx("title", {
              children: "Google"
            }), /* @__PURE__ */ jsx("path", {
              fill: "currentColor",
              d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            }), /* @__PURE__ */ jsx("path", {
              fill: "currentColor",
              d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            }), /* @__PURE__ */ jsx("path", {
              fill: "currentColor",
              d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            }), /* @__PURE__ */ jsx("path", {
              fill: "currentColor",
              d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            })]
          }),
          children: isLoading ? "Conectando..." : "Continuar con Google"
        })]
      }), /* @__PURE__ */ jsx(CardFooter, {
        className: "flex justify-center mb-5",
        children: /* @__PURE__ */ jsxs("p", {
          className: "text-small text-default-600",
          children: ["¿No tienes cuenta?", " ", /* @__PURE__ */ jsx(Link, {
            href: "/register",
            className: "text-primary-600 hover:text-primary-800 font-medium",
            children: "Regístrate aquí"
          })]
        })
      })]
    }), /* @__PURE__ */ jsx(DemoCredentials, {})]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
function meta$1() {
  return [{
    title: "Registro de Estudiantes - SIRHA"
  }, {
    name: "description",
    content: "Registro de nuevos estudiantes en el sistema SIRHA"
  }];
}
const register = UNSAFE_withComponentProps(function Register() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-content1 p-4",
    children: [/* @__PURE__ */ jsx("div", {
      className: "max-w-4xl mx-auto mb-6",
      children: /* @__PURE__ */ jsx(Button, {
        as: Link,
        href: "/",
        variant: "light",
        color: "primary",
        startContent: /* @__PURE__ */ jsxs("svg", {
          className: "w-4 h-4",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          "aria-label": "Back icon",
          children: [/* @__PURE__ */ jsx("title", {
            children: "Back icon"
          }), /* @__PURE__ */ jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M15 19l-7-7 7-7"
          })]
        }),
        children: "Volver al inicio"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "max-w-4xl mx-auto",
      children: [/* @__PURE__ */ jsxs(Card, {
        className: "mb-6",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "text-center pb-2",
          children: /* @__PURE__ */ jsxs("div", {
            className: "w-full",
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-3xl font-bold text-primary mb-2",
              children: "Registro de Estudiantes"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-default-600",
              children: "Complete el formulario para registrarse en el sistema SIRHA"
            })]
          })
        }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx(CardBody, {
          className: "p-6",
          children: /* @__PURE__ */ jsx(StudentRegistration, {})
        })]
      }), /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardBody, {
          className: "text-center p-6",
          children: [/* @__PURE__ */ jsxs("p", {
            className: "text-small text-default-600 mb-4",
            children: ["¿Ya tienes una cuenta?", " ", /* @__PURE__ */ jsx(Link, {
              href: "/login",
              className: "text-primary-600 hover:text-primary-800 font-medium",
              children: "Inicia sesión aquí"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-tiny text-default-500",
            children: "Al registrarte, aceptas los términos y condiciones del sistema SIRHA"
          })]
        })
      })]
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: register,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const systemsEngineeringSubjects = [
  // Matemáticas
  {
    id: "1",
    name: "Matemáticas Básicas",
    credits: 4,
    status: "aprobada",
    grade: 4.1
  },
  {
    id: "2",
    name: "Cálculo Diferencial",
    credits: 4,
    status: "aprobada",
    grade: 3.8
  },
  {
    id: "3",
    name: "Cálculo Integral",
    credits: 4,
    status: "aprobada",
    grade: 4
  },
  {
    id: "4",
    name: "Cálculo Vectorial",
    credits: 4,
    status: "aprobada",
    grade: 3.9
  },
  {
    id: "5",
    name: "Ecuaciones Diferenciales",
    credits: 3,
    status: "aprobada",
    grade: 3.7
  },
  {
    id: "6",
    name: "Álgebra Lineal",
    credits: 3,
    status: "aprobada",
    grade: 4.2
  },
  {
    id: "7",
    name: "Matemáticas para Informática",
    credits: 3,
    status: "aprobada",
    grade: 4.3
  },
  {
    id: "8",
    name: "Lógica y Matemáticas Discretas",
    credits: 3,
    status: "aprobada",
    grade: 4
  },
  {
    id: "9",
    name: "Probabilidad y Estadística",
    credits: 3,
    status: "en_progreso"
  },
  // Física
  {
    id: "10",
    name: "Física Básica",
    credits: 4,
    status: "aprobada",
    grade: 3.6
  },
  { id: "11", name: "Física 1", credits: 4, status: "aprobada", grade: 3.8 },
  { id: "12", name: "Física 2", credits: 4, status: "aprobada", grade: 3.5 },
  // Programación y Sistemas
  {
    id: "13",
    name: "Introducción a la Programación",
    credits: 4,
    status: "aprobada",
    grade: 4.5
  },
  {
    id: "14",
    name: "Desarrollo Orientado por Objetos",
    credits: 4,
    status: "aprobada",
    grade: 4.2
  },
  {
    id: "15",
    name: "Diseño de Datos y Algoritmos",
    credits: 4,
    status: "aprobada",
    grade: 4
  },
  {
    id: "16",
    name: "Teoría de la Programación y la Computación",
    credits: 3,
    status: "aprobada",
    grade: 3.9
  },
  {
    id: "17",
    name: "Organización de los Sistemas de Cómputo",
    credits: 3,
    status: "aprobada",
    grade: 3.7
  },
  {
    id: "18",
    name: "Arquitectura y Servicios de Red",
    credits: 3,
    status: "en_progreso"
  },
  {
    id: "19",
    name: "Fundamentos de Seguridad de la Información",
    credits: 3,
    status: "en_progreso"
  },
  // Ingeniería de Software
  {
    id: "20",
    name: "Modelos y Servicios de Datos",
    credits: 4,
    status: "aprobada",
    grade: 4.1
  },
  {
    id: "21",
    name: "Desarrollo y Operaciones Software",
    credits: 4,
    status: "en_progreso"
  },
  {
    id: "22",
    name: "Arquitecturas de Software",
    credits: 4,
    status: "pendiente"
  },
  {
    id: "23",
    name: "Transformación Digital y Soluciones Empresariales",
    credits: 3,
    status: "pendiente"
  },
  // Proyectos Integradores
  {
    id: "24",
    name: "Proyecto Integrador 1 – Introducción a la Ingeniería de Sistemas",
    credits: 2,
    status: "aprobada",
    grade: 4.3
  },
  {
    id: "25",
    name: "Proyecto Integrador 2 – Estrategia de Organizaciones y Procesos",
    credits: 3,
    status: "pendiente"
  },
  {
    id: "26",
    name: "Proyecto Integrador 3 – Innovación Software Apoyada en Nuevas Tecnologías",
    credits: 3,
    status: "pendiente"
  },
  // Humanidades y Sociales
  {
    id: "27",
    name: "Fundamentos de la Comunicación 1",
    credits: 2,
    status: "aprobada",
    grade: 4
  },
  {
    id: "28",
    name: "Colombia: Realidad, Instituciones Políticas y Paz",
    credits: 2,
    status: "aprobada",
    grade: 3.8
  },
  {
    id: "29",
    name: "Historia y Geografía de Colombia",
    credits: 2,
    status: "aprobada",
    grade: 3.9
  },
  {
    id: "30",
    name: "Fundamentos Económicos",
    credits: 3,
    status: "aprobada",
    grade: 3.6
  },
  {
    id: "31",
    name: "Fundamentos de Proyectos",
    credits: 3,
    status: "aprobada",
    grade: 4.1
  },
  // Inteligencia Artificial
  {
    id: "32",
    name: "Principios y Tecnologías de Inteligencia Artificial",
    credits: 4,
    status: "pendiente"
  },
  // Opción de Grado
  {
    id: "33",
    name: "Seminario de Opción de Grado",
    credits: 2,
    status: "pendiente"
  },
  { id: "34", name: "Opción de Grado 1", credits: 3, status: "pendiente" },
  { id: "35", name: "Opción de Grado 2", credits: 3, status: "pendiente" },
  { id: "36", name: "Opción de Grado 3", credits: 3, status: "pendiente" },
  { id: "37", name: "Opción de Grado 4", credits: 3, status: "pendiente" },
  // Electivas
  { id: "38", name: "Electiva Técnica 1", credits: 3, status: "pendiente" },
  { id: "39", name: "Electiva Técnica 2", credits: 3, status: "pendiente" },
  { id: "40", name: "Electiva Técnica 3", credits: 3, status: "pendiente" },
  // Cursos de Libre Elección (solo algunos como ejemplo)
  { id: "41", name: "CLE 1", credits: 2, status: "aprobada", grade: 4 },
  { id: "42", name: "CLE 2", credits: 2, status: "aprobada", grade: 3.8 },
  { id: "43", name: "CLE 3", credits: 2, status: "pendiente" }
];
const mockProgress = {
  percentage: 68,
  totalSubjects: systemsEngineeringSubjects.length,
  completedSubjects: systemsEngineeringSubjects.filter(
    (s) => s.status === "aprobada"
  ).length,
  totalCredits: systemsEngineeringSubjects.reduce(
    (sum, s) => sum + s.credits,
    0
  ),
  completedCredits: systemsEngineeringSubjects.filter((s) => s.status === "aprobada").reduce((sum, s) => sum + s.credits, 0),
  inconsistent: Math.random() > 0.7,
  // 30% probabilidad de inconsistencia para testing
  lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
  subjects: systemsEngineeringSubjects
};
function SemaphoreIndicator({
  percentage,
  isLoading
}) {
  const getColor = () => {
    if (percentage >= 80) return "success";
    if (percentage >= 60) return "warning";
    if (percentage >= 40) return "danger";
    return "default";
  };
  const getDescription = () => {
    if (percentage >= 80) return "Excelente progreso académico";
    if (percentage >= 60) return "Buen progreso, mantén el ritmo";
    if (percentage >= 40) return "Progreso moderado, puedes mejorar";
    return "Necesitas acelerar tu progreso";
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Spinner, { size: "sm" }),
      /* @__PURE__ */ jsx("span", { className: "text-sm text-default-500", children: "Calculando..." })
    ] });
  }
  return /* @__PURE__ */ jsx(Tooltip, { content: `${percentage}% completado. ${getDescription()}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsx("div", { className: `w-6 h-6 rounded-full bg-${getColor()}` }),
    /* @__PURE__ */ jsxs("span", { className: "font-medium", children: [
      percentage,
      "%"
    ] })
  ] }) });
}
function SubjectDetails({
  subjects,
  totalCredits,
  completedCredits
}) {
  const [filter, setFilter] = useState("todas");
  const filteredSubjects = subjects.filter((subject) => {
    if (filter === "todas") return true;
    return subject.status === filter;
  });
  const getStatusColor = (status) => {
    switch (status) {
      case "aprobada":
        return "success";
      case "en_progreso":
        return "secondary";
      // Cambiado de warning a secondary (azul)
      case "pendiente":
        return "default";
      default:
        return "default";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "aprobada":
        return "Aprobada";
      case "en_progreso":
        return "En Progreso";
      case "pendiente":
        return "Pendiente";
      default:
        return status;
    }
  };
  return /* @__PURE__ */ jsx(Accordion, { children: /* @__PURE__ */ jsx(AccordionItem, { title: "Ver detalles de materias", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsx(
        Progress,
        {
          value: completedCredits / totalCredits * 100,
          color: "primary",
          label: "Progreso de créditos",
          showValueLabel: true
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm text-default-600", children: [
        /* @__PURE__ */ jsxs("span", { children: [
          subjects.filter((s) => s.status === "aprobada").length,
          "/",
          subjects.length,
          " materias"
        ] }),
        /* @__PURE__ */ jsxs("span", { children: [
          completedCredits,
          "/",
          totalCredits,
          " créditos"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      Select,
      {
        label: "Filtrar por estado",
        selectedKeys: [filter],
        onSelectionChange: (keys) => setFilter(Array.from(keys)[0]),
        className: "max-w-xs",
        children: [
          /* @__PURE__ */ jsx(SelectItem, { children: "Todas" }, "todas"),
          /* @__PURE__ */ jsx(SelectItem, { children: "Aprobadas" }, "aprobada"),
          /* @__PURE__ */ jsx(SelectItem, { children: "En Progreso" }, "en_progreso"),
          /* @__PURE__ */ jsx(SelectItem, { children: "Pendientes" }, "pendiente")
        ]
      }
    ),
    /* @__PURE__ */ jsxs(Table, { "aria-label": "Tabla de materias", children: [
      /* @__PURE__ */ jsxs(TableHeader, { children: [
        /* @__PURE__ */ jsx(TableColumn, { children: "MATERIA" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "CRÉDITOS" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "ESTADO" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "NOTA" })
      ] }),
      /* @__PURE__ */ jsx(TableBody, { children: filteredSubjects.map((subject) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: subject.name }),
        /* @__PURE__ */ jsx(TableCell, { children: subject.credits }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Chip,
          {
            color: subject.status === "en_progreso" ? "primary" : getStatusColor(subject.status),
            variant: "flat",
            className: subject.status === "en_progreso" ? "bg-blue-500 text-white" : "",
            children: getStatusLabel(subject.status)
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { children: subject.grade ? subject.grade.toFixed(1) : "-" })
      ] }, subject.id)) })
    ] })
  ] }) }, "details") });
}
function useAutoRefresh(refetch, intervalMinutes = 5) {
  const intervalRef = useRef(null);
  const [lastUpdated, setLastUpdated] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startInterval();
      } else {
        stopInterval();
      }
    };
    const startInterval = () => {
      stopInterval();
      intervalRef.current = setInterval(
        () => {
          refetch();
          setLastUpdated(/* @__PURE__ */ new Date());
        },
        intervalMinutes * 60 * 1e3
      );
    };
    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    startInterval();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refetch, intervalMinutes]);
  const manualRefresh = () => {
    refetch();
    setLastUpdated(/* @__PURE__ */ new Date());
  };
  return { lastUpdated, manualRefresh };
}
function AccessGuard({
  userRole,
  studentId,
  targetStudentId,
  children
}) {
  const hasAccess = ["STUDENT", "ADMIN", "DEAN"].includes(userRole);
  if (!hasAccess) {
    return /* @__PURE__ */ jsxs(Alert, { color: "danger", title: "Acceso Denegado", children: [
      "No tienes permisos para ver esta información académica.",
      /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          color: "primary",
          variant: "bordered",
          onPress: () => {
            window.location.href = "/login";
          },
          children: "Iniciar Sesión"
        }
      ) })
    ] });
  }
  if (userRole === "STUDENT" && targetStudentId && studentId !== targetStudentId) {
    return /* @__PURE__ */ jsxs(Alert, { color: "warning", title: "Acceso Restringido", children: [
      "Solo puedes ver tu propio progreso académico.",
      /* @__PURE__ */ jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsx(
        Button,
        {
          size: "sm",
          color: "primary",
          variant: "bordered",
          onPress: () => {
            window.location.href = "/student-dashboard";
          },
          children: "Ver Mi Progreso"
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsx(Fragment, { children });
}
function InconsistencyBanner({ show }) {
  if (!show) return null;
  return /* @__PURE__ */ jsx(
    Alert,
    {
      color: "warning",
      title: "Detectamos inconsistencias en tu información académica",
      className: "mb-4",
      children: /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsx("p", { className: "text-sm", children: "Algunos datos de tu historial académico no coinciden entre nuestros sistemas. Esto puede deberse a actualizaciones recientes o transferencias de créditos." }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              color: "warning",
              variant: "solid",
              onPress: () => window.open(
                "mailto:registro@escuelaing.edu.co?subject=Inconsistencia en Información Académica&body=Hola, he detectado inconsistencias en mi información académica en el sistema SIRHA. Mi código de estudiante es: [TU_CODIGO]. Por favor, ayuda a revisar y corregir esta información.",
                "_blank"
              ),
              children: "Contactar Registro Académico"
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              size: "sm",
              color: "warning",
              variant: "bordered",
              onPress: () => window.open(
                "https://wa.me/573001234567?text=Hola, necesito ayuda con inconsistencias en mi información académica en SIRHA",
                "_blank"
              ),
              children: "Soporte WhatsApp"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-default-600", children: [
          /* @__PURE__ */ jsx("strong", { children: "Qué hacer:" }),
          " Contacta al registro académico con tu código de estudiante. Ellos verificarán y corregirán cualquier inconsistencia en 1-2 días hábiles."
        ] })
      ] })
    }
  );
}
function AcademicSemaphore({
  userRole = "STUDENT",
  studentId,
  targetStudentId
}) {
  const queryClient2 = useQueryClient();
  const {
    data: progress,
    isLoading,
    refetch
  } = useQuery({
    queryKey: ["academic-progress"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return mockProgress;
    }
  });
  const { lastUpdated, manualRefresh } = useAutoRefresh(refetch);
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProgress;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["academic-progress"] });
    }
  });
  return /* @__PURE__ */ jsx(
    AccessGuard,
    {
      userRole,
      studentId,
      targetStudentId,
      children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        (progress == null ? void 0 : progress.inconsistent) && /* @__PURE__ */ jsx(InconsistencyBanner, { show: true }),
        /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardBody, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Progreso Académico" }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "light",
                onPress: manualRefresh,
                isLoading: refreshMutation.isPending,
                startContent: !refreshMutation.isPending && /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    className: "w-4 h-4",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    "aria-label": "Refresh icon",
                    children: [
                      /* @__PURE__ */ jsx("title", { children: "Refresh icon" }),
                      /* @__PURE__ */ jsx(
                        "path",
                        {
                          strokeLinecap: "round",
                          strokeLinejoin: "round",
                          strokeWidth: 2,
                          d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        }
                      )
                    ]
                  }
                ),
                children: "Actualizar"
              }
            ) })
          ] }),
          progress && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              SemaphoreIndicator,
              {
                percentage: progress.percentage,
                isLoading
              }
            ),
            /* @__PURE__ */ jsx(
              SubjectDetails,
              {
                subjects: progress.subjects,
                totalCredits: progress.totalCredits,
                completedCredits: progress.completedCredits
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-default-500", children: [
            "Última actualización: ",
            lastUpdated.toLocaleString()
          ] })
        ] }) })
      ] })
    }
  );
}
function meta() {
  return [{
    title: "Progreso Académico - SIRHA"
  }, {
    name: "description",
    content: "Visualiza tu progreso académico y estado de materias"
  }];
}
const academicProgress = UNSAFE_withComponentProps(function AcademicProgressPage() {
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen bg-content1 p-4",
    children: [/* @__PURE__ */ jsx("div", {
      className: "max-w-6xl mx-auto mb-6",
      children: /* @__PURE__ */ jsx(Button, {
        as: Link,
        href: "/",
        variant: "light",
        color: "primary",
        startContent: /* @__PURE__ */ jsxs("svg", {
          className: "w-4 h-4",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24",
          "aria-label": "Back icon",
          children: [/* @__PURE__ */ jsx("title", {
            children: "Back icon"
          }), /* @__PURE__ */ jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M15 19l-7-7 7-7"
          })]
        }),
        children: "Volver al inicio"
      })
    }), /* @__PURE__ */ jsxs("div", {
      className: "max-w-6xl mx-auto",
      children: [/* @__PURE__ */ jsxs(Card, {
        className: "mb-6",
        children: [/* @__PURE__ */ jsx(CardHeader, {
          className: "text-center pb-2",
          children: /* @__PURE__ */ jsxs("div", {
            className: "w-full",
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-3xl font-bold text-primary mb-2",
              children: "Mi Progreso Académico"
            }), /* @__PURE__ */ jsx("p", {
              className: "text-default-600",
              children: "Visualiza tu avance académico, materias y créditos completados"
            })]
          })
        }), /* @__PURE__ */ jsx(CardBody, {
          className: "p-6",
          children: /* @__PURE__ */ jsx(AcademicSemaphore, {
            userRole: "STUDENT"
          })
        })]
      }), /* @__PURE__ */ jsx(Card, {
        children: /* @__PURE__ */ jsxs(CardBody, {
          className: "text-center p-6",
          children: [/* @__PURE__ */ jsxs("p", {
            className: "text-small text-default-600 mb-4",
            children: ["¿Tienes dudas sobre tu progreso académico?", " ", /* @__PURE__ */ jsx(Link, {
              href: "mailto:registro@universidad.edu",
              className: "text-primary-600 hover:text-primary-800 font-medium",
              children: "Contacta al registro académico"
            })]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-tiny text-default-500",
            children: "La información se actualiza automáticamente cada 5 minutos"
          })]
        })
      })]
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: academicProgress,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const subjectsBySemester = [
  // Semestre 1
  {
    id: "1",
    name: "Matemáticas Básicas",
    credits: 4,
    status: "aprobada",
    grade: 4.1,
    semester: 1
  },
  {
    id: "2",
    name: "Introducción a la Programación",
    credits: 4,
    status: "aprobada",
    grade: 4.5,
    semester: 1
  },
  {
    id: "3",
    name: "Física Básica",
    credits: 4,
    status: "aprobada",
    grade: 3.6,
    semester: 1
  },
  {
    id: "4",
    name: "Fundamentos de la Comunicación 1",
    credits: 2,
    status: "aprobada",
    grade: 4,
    semester: 1
  },
  {
    id: "5",
    name: "Proyecto Integrador 1",
    credits: 2,
    status: "aprobada",
    grade: 4.3,
    semester: 1
  },
  // Semestre 2
  {
    id: "6",
    name: "Cálculo Diferencial",
    credits: 4,
    status: "aprobada",
    grade: 3.8,
    semester: 2
  },
  {
    id: "7",
    name: "Desarrollo Orientado por Objetos",
    credits: 4,
    status: "aprobada",
    grade: 4.2,
    semester: 2
  },
  {
    id: "8",
    name: "Física 1",
    credits: 4,
    status: "aprobada",
    grade: 3.8,
    semester: 2
  },
  {
    id: "9",
    name: "Lógica y Matemáticas Discretas",
    credits: 3,
    status: "aprobada",
    grade: 4,
    semester: 2
  },
  {
    id: "10",
    name: "Colombia: Realidad, Instituciones Políticas y Paz",
    credits: 2,
    status: "aprobada",
    grade: 3.8,
    semester: 2
  },
  // Semestre 3
  {
    id: "11",
    name: "Cálculo Integral",
    credits: 4,
    status: "aprobada",
    grade: 4,
    semester: 3
  },
  {
    id: "12",
    name: "Diseño de Datos y Algoritmos",
    credits: 4,
    status: "aprobada",
    grade: 4,
    semester: 3
  },
  {
    id: "13",
    name: "Física 2",
    credits: 4,
    status: "aprobada",
    grade: 3.5,
    semester: 3
  },
  {
    id: "14",
    name: "Matemáticas para Informática",
    credits: 3,
    status: "aprobada",
    grade: 4.3,
    semester: 3
  },
  {
    id: "15",
    name: "Historia y Geografía de Colombia",
    credits: 2,
    status: "aprobada",
    grade: 3.9,
    semester: 3
  },
  // Semestre 4
  {
    id: "16",
    name: "Cálculo Vectorial",
    credits: 4,
    status: "aprobada",
    grade: 3.9,
    semester: 4
  },
  {
    id: "17",
    name: "Teoría de la Programación y la Computación",
    credits: 3,
    status: "aprobada",
    grade: 3.9,
    semester: 4
  },
  {
    id: "18",
    name: "Organización de los Sistemas de Cómputo",
    credits: 3,
    status: "aprobada",
    grade: 3.7,
    semester: 4
  },
  {
    id: "19",
    name: "Álgebra Lineal",
    credits: 3,
    status: "aprobada",
    grade: 4.2,
    semester: 4
  },
  {
    id: "20",
    name: "Fundamentos Económicos",
    credits: 3,
    status: "aprobada",
    grade: 3.6,
    semester: 4
  },
  // Semestre 5
  {
    id: "21",
    name: "Ecuaciones Diferenciales",
    credits: 3,
    status: "aprobada",
    grade: 3.7,
    semester: 5
  },
  {
    id: "22",
    name: "Modelos y Servicios de Datos",
    credits: 4,
    status: "aprobada",
    grade: 4.1,
    semester: 5
  },
  {
    id: "23",
    name: "Arquitectura y Servicios de Red",
    credits: 3,
    status: "en_progreso",
    semester: 5
  },
  {
    id: "24",
    name: "Fundamentos de Proyectos",
    credits: 3,
    status: "aprobada",
    grade: 4.1,
    semester: 5
  },
  {
    id: "25",
    name: "CLE 1",
    credits: 2,
    status: "aprobada",
    grade: 4,
    semester: 5
  },
  // Semestre 6
  {
    id: "26",
    name: "Probabilidad y Estadística",
    credits: 3,
    status: "en_progreso",
    semester: 6
  },
  {
    id: "27",
    name: "Desarrollo y Operaciones Software",
    credits: 4,
    status: "en_progreso",
    semester: 6
  },
  {
    id: "28",
    name: "Fundamentos de Seguridad de la Información",
    credits: 3,
    status: "en_progreso",
    semester: 6
  },
  {
    id: "29",
    name: "Proyecto Integrador 2",
    credits: 3,
    status: "pendiente",
    semester: 6
  },
  {
    id: "30",
    name: "CLE 2",
    credits: 2,
    status: "aprobada",
    grade: 3.8,
    semester: 6
  },
  // Semestre 7
  {
    id: "31",
    name: "Arquitecturas de Software",
    credits: 4,
    status: "pendiente",
    semester: 7
  },
  {
    id: "32",
    name: "Principios y Tecnologías de Inteligencia Artificial",
    credits: 4,
    status: "pendiente",
    semester: 7
  },
  {
    id: "33",
    name: "Electiva Técnica 1",
    credits: 3,
    status: "pendiente",
    semester: 7
  },
  { id: "34", name: "CLE 3", credits: 2, status: "pendiente", semester: 7 },
  // Semestre 8
  {
    id: "35",
    name: "Transformación Digital y Soluciones Empresariales",
    credits: 3,
    status: "pendiente",
    semester: 8
  },
  {
    id: "36",
    name: "Electiva Técnica 2",
    credits: 3,
    status: "pendiente",
    semester: 8
  },
  {
    id: "37",
    name: "Electiva Técnica 3",
    credits: 3,
    status: "pendiente",
    semester: 8
  },
  {
    id: "38",
    name: "Proyecto Integrador 3",
    credits: 3,
    status: "pendiente",
    semester: 8
  },
  // Semestre 9
  {
    id: "39",
    name: "Seminario de Opción de Grado",
    credits: 2,
    status: "pendiente",
    semester: 9
  },
  {
    id: "40",
    name: "Opción de Grado 1",
    credits: 3,
    status: "pendiente",
    semester: 9
  },
  {
    id: "41",
    name: "Opción de Grado 2",
    credits: 3,
    status: "pendiente",
    semester: 9
  },
  // Semestre 10
  {
    id: "42",
    name: "Opción de Grado 3",
    credits: 3,
    status: "pendiente",
    semester: 10
  },
  {
    id: "43",
    name: "Opción de Grado 4",
    credits: 3,
    status: "pendiente",
    semester: 10
  }
];
function AcademicGrid() {
  const getStatusColor = (status) => {
    switch (status) {
      case "aprobada":
        return "success";
      case "en_progreso":
        return "secondary";
      case "pendiente":
        return "default";
      default:
        return "default";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "aprobada":
        return "Aprobada";
      case "en_progreso":
        return "En Progreso";
      case "pendiente":
        return "Pendiente";
      default:
        return status;
    }
  };
  const subjectsBySemesterGroup = subjectsBySemester.reduce(
    (acc, subject) => {
      if (!acc[subject.semester]) {
        acc[subject.semester] = [];
      }
      acc[subject.semester].push(subject);
      return acc;
    },
    {}
  );
  return /* @__PURE__ */ jsx("div", { className: "space-y-8", children: Object.entries(subjectsBySemesterGroup).sort(([a], [b]) => Number(a) - Number(b)).map(([semester, subjects]) => /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold text-primary mb-4", children: [
      "Semestre ",
      semester
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: subjects.map((subject) => /* @__PURE__ */ jsx(
      Card,
      {
        className: `border-2 ${subject.status === "aprobada" ? "border-success bg-success-50" : subject.status === "en_progreso" ? "border-blue-500 bg-blue-50" : "border-default-200 bg-default-50"}`,
        shadow: "sm",
        children: /* @__PURE__ */ jsxs(CardBody, { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-3", children: [
            /* @__PURE__ */ jsx(
              Chip,
              {
                color: subject.status === "en_progreso" ? "primary" : getStatusColor(subject.status),
                variant: "flat",
                size: "sm",
                className: subject.status === "en_progreso" ? "bg-blue-500 text-white" : "",
                children: getStatusLabel(subject.status)
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "text-xs text-default-500 font-medium", children: [
              subject.credits,
              " créditos"
            ] })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "text-sm font-semibold text-default-900 mb-2 leading-tight", children: subject.name }),
          subject.grade && /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-default-600", children: "Nota:" }),
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-success", children: subject.grade.toFixed(1) })
          ] })
        ] })
      },
      subject.id
    )) }),
    /* @__PURE__ */ jsx(Divider, { className: "mt-6" })
  ] }, semester)) });
}
const DAYS = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
const TIME_SLOTS = [
  "07:00–08:30",
  "08:30–10:00",
  "10:00–11:30",
  "11:30–13:00",
  "13:00–14:30",
  "14:30–16:00",
  "16:00–17:30",
  "17:30–19:00"
];
const mockScheduleData = {
  LUNES: {
    "07:00–08:30": {
      id: "1",
      subject: "Probabilidad y Estadística",
      classroom: "A-101",
      teacher: "Dr. García"
    },
    "14:30–16:00": {
      id: "2",
      subject: "Desarrollo y Operaciones Software",
      classroom: "L-201",
      teacher: "Ing. Martínez"
    }
  },
  MARTES: {
    "10:00–11:30": {
      id: "3",
      subject: "Arquitectura y Servicios de Red",
      classroom: "A-301",
      teacher: "Dra. López"
    },
    "16:00–17:30": {
      id: "4",
      subject: "Fundamentos de Seguridad",
      classroom: "A-201",
      teacher: "Dr. Rodríguez"
    }
  },
  MIÉRCOLES: {
    "07:00–08:30": {
      id: "5",
      subject: "Probabilidad y Estadística",
      classroom: "A-101",
      teacher: "Dr. García"
    },
    "13:00–14:30": {
      id: "6",
      subject: "Desarrollo y Operaciones Software",
      classroom: "L-201",
      teacher: "Ing. Martínez"
    }
  },
  JUEVES: {
    "10:00–11:30": {
      id: "7",
      subject: "Arquitectura y Servicios de Red",
      classroom: "A-301",
      teacher: "Dra. López"
    },
    "16:00–17:30": {
      id: "8",
      subject: "Fundamentos de Seguridad",
      classroom: "A-201",
      teacher: "Dr. Rodríguez"
    }
  },
  VIERNES: {
    "08:30–10:00": {
      id: "9",
      subject: "Probabilidad y Estadística",
      classroom: "A-101",
      teacher: "Dr. García"
    }
  },
  SÁBADO: {}
};
function AcademicSchedule() {
  const [scheduleData, setScheduleData] = useState(mockScheduleData);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [newClass, setNewClass] = useState({
    subject: "",
    teacher: "",
    classroom: "",
    notes: ""
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCellClick = (day, timeSlot) => {
    var _a;
    const existingClass = (_a = scheduleData[day]) == null ? void 0 : _a[timeSlot];
    if (!existingClass) {
      setSelectedSlot({ day, time: timeSlot });
      setNewClass({ subject: "", teacher: "", classroom: "", notes: "" });
      onOpen();
    }
  };
  const handleSaveClass = () => {
    if (!selectedSlot || !newClass.subject.trim()) return;
    const newClassBlock = {
      id: Date.now().toString(),
      subject: newClass.subject,
      classroom: newClass.classroom,
      teacher: newClass.teacher,
      notes: newClass.notes
    };
    setScheduleData((prev) => ({
      ...prev,
      [selectedSlot.day]: {
        ...prev[selectedSlot.day],
        [selectedSlot.time]: newClassBlock
      }
    }));
    onClose();
    setSelectedSlot(null);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { radius: "sm", shadow: "sm", children: [
      /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Horario Académico" }) }),
      /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("div", { className: "min-w-[800px]", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-7 border border-default-200 rounded-lg overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-default-100 p-3 border-r border-default-200 flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-default-700", children: "Horario" }) }),
        DAYS.map((day) => /* @__PURE__ */ jsx(
          "div",
          {
            className: "bg-default-100 p-3 border-r border-default-200 last:border-r-0 flex items-center justify-center",
            children: /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-default-700", children: day })
          },
          day
        )),
        TIME_SLOTS.map((timeSlot) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-default-50 p-3 border-r border-t border-default-200 flex items-center justify-end pr-4",
              children: /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-default-600", children: timeSlot })
            },
            `time-${timeSlot}`
          ),
          DAYS.map((day) => {
            var _a;
            const classBlock = (_a = scheduleData[day]) == null ? void 0 : _a[timeSlot];
            return /* @__PURE__ */ jsx(
              "div",
              {
                className: "border-r border-t border-default-200 last:border-r-0 min-h-[80px] p-1",
                children: classBlock ? /* @__PURE__ */ jsxs("div", { className: "h-full bg-red-500 text-white rounded-md p-2 shadow-sm flex flex-col justify-center", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs font-bold leading-tight mb-1", children: classBlock.subject }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs leading-tight mb-1", children: classBlock.classroom }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs leading-tight opacity-90", children: classBlock.teacher })
                ] }) : /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "w-full h-full min-h-[76px] hover:bg-default-100 rounded-md transition-colors",
                    onClick: () => handleCellClick(day, timeSlot)
                  }
                )
              },
              `${day}-${timeSlot}`
            );
          })
        ] }))
      ] }) }) }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { isOpen, onClose, size: "lg", children: /* @__PURE__ */ jsxs(ModalContent, { children: [
      /* @__PURE__ */ jsxs(ModalHeader, { children: [
        "Añadir Clase",
        selectedSlot && /* @__PURE__ */ jsxs("span", { className: "text-sm font-normal text-default-500 ml-2", children: [
          selectedSlot.day,
          " - ",
          selectedSlot.time
        ] })
      ] }),
      /* @__PURE__ */ jsxs(ModalBody, { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Nombre de la Materia",
            placeholder: "Ej: Cálculo Diferencial",
            value: newClass.subject,
            onChange: (e) => setNewClass((prev) => ({ ...prev, subject: e.target.value })),
            isRequired: true
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Profesor",
            placeholder: "Ej: Dr. García",
            value: newClass.teacher,
            onChange: (e) => setNewClass((prev) => ({ ...prev, teacher: e.target.value }))
          }
        ),
        /* @__PURE__ */ jsx(
          Input,
          {
            label: "Aula/Salón",
            placeholder: "Ej: A-101",
            value: newClass.classroom,
            onChange: (e) => setNewClass((prev) => ({ ...prev, classroom: e.target.value }))
          }
        ),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            label: "Notas (Opcional)",
            placeholder: "Información adicional...",
            value: newClass.notes,
            onChange: (e) => setNewClass((prev) => ({ ...prev, notes: e.target.value })),
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs(ModalFooter, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "light", onPress: onClose, children: "Cancelar" }),
        /* @__PURE__ */ jsx(
          Button,
          {
            color: "primary",
            onPress: handleSaveClass,
            isDisabled: !newClass.subject.trim(),
            children: "Guardar"
          }
        )
      ] })
    ] }) })
  ] });
}
const periodConfigs = {
  "pre-inscripcion": {
    title: "Período de Pre-inscripción",
    message: "El período de pre-inscripción está activo. Puedes revisar las materias disponibles y planificar tu horario.",
    ctaText: "Ver Materias Disponibles",
    color: "primary"
  },
  inscripcion: {
    title: "Período de Inscripción",
    message: "¡Es hora de inscribirte! Tienes tiempo limitado para seleccionar tus materias y grupos.",
    ctaText: "Ir a Inscripción",
    color: "success"
  },
  "post-inscripcion": {
    title: "Período Post-inscripción",
    message: "La inscripción ha finalizado. Revisa tu horario académico y prepárate para el inicio de clases.",
    ctaText: "",
    color: "warning"
  }
};
const generateSemesterDates = (year, semester) => {
  const enrollmentStart = new Date(year, semester === 1 ? 0 : 6, 1);
  const enrollmentEnd = new Date(year, semester === 1 ? 5 : 11, 15);
  const classesStart = new Date(year, semester === 1 ? 1 : 7, 1);
  const classesEnd = new Date(year, semester === 1 ? 5 : 11, 30);
  return {
    enrollmentStart: enrollmentStart.toISOString().split("T")[0],
    enrollmentEnd: enrollmentEnd.toISOString().split("T")[0],
    classesStart: classesStart.toISOString().split("T")[0],
    classesEnd: classesEnd.toISOString().split("T")[0]
  };
};
function useCurrentPeriod() {
  const now = /* @__PURE__ */ new Date();
  const currentMonth = now.getMonth() + 1;
  now.getDate();
  if (currentMonth >= 1 && currentMonth <= 2) {
    return "pre-inscripcion";
  } else if (currentMonth >= 3 && currentMonth <= 6) {
    return "inscripcion";
  } else {
    return "post-inscripcion";
  }
}
function usePeriodForSemester(semester) {
  const now = /* @__PURE__ */ new Date();
  const enrollmentStart = new Date(semester.enrollmentStart);
  const enrollmentEnd = new Date(semester.enrollmentEnd);
  const classesStart = new Date(semester.classesStart);
  if (now < enrollmentStart) {
    return "pre-inscripcion";
  } else if (now >= enrollmentStart && now <= enrollmentEnd) {
    return "inscripcion";
  } else if (now > enrollmentEnd && now < classesStart) {
    return "post-inscripcion";
  } else {
    return "post-inscripcion";
  }
}
function useSelectedSemester() {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
  const currentSemester = currentMonth <= 6 ? 1 : 2;
  const [selectedSemester, setSelectedSemester] = useState(
    () => {
      const dates = generateSemesterDates(currentYear, currentSemester);
      return {
        year: currentYear,
        semester: currentSemester,
        label: `${currentYear}-${currentSemester}`,
        ...dates
      };
    }
  );
  useEffect(() => {
    const saved = localStorage.getItem("selectedSemester");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedSemester(parsed);
      } catch (error) {
        console.warn("Error parsing saved semester:", error);
      }
    }
  }, []);
  const updateSemester = (semester) => {
    setSelectedSemester(semester);
    localStorage.setItem("selectedSemester", JSON.stringify(semester));
  };
  return [selectedSemester, updateSemester];
}
function InformativeMessage({
  period,
  onCtaClick
}) {
  const config = periodConfigs[period];
  return /* @__PURE__ */ jsxs(Card, { radius: "sm", shadow: "sm", className: `border-${config.color}-200`, children: [
    /* @__PURE__ */ jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(Chip, { color: config.color, variant: "flat", size: "sm", children: config.title }) }) }),
    /* @__PURE__ */ jsxs(CardBody, { className: "pt-0", children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm text-default-700 mb-3", children: config.message }),
      config.ctaText && /* @__PURE__ */ jsx(
        Button,
        {
          color: config.color,
          variant: "flat",
          size: "sm",
          onPress: onCtaClick,
          children: config.ctaText
        }
      )
    ] })
  ] });
}
function SemesterSelector({
  selectedSemester,
  onSemesterChange,
  className = ""
}) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const semesters = [];
  for (let year = currentYear; year >= currentYear - 3; year--) {
    for (let semester = 2; semester >= 1; semester--) {
      const dates = generateSemesterDates(year, semester);
      semesters.push({
        year,
        semester,
        label: `${year}-${semester}`,
        ...dates
      });
    }
  }
  return /* @__PURE__ */ jsx("div", { className: `flex flex-col sm:flex-row gap-2 ${className}`, children: /* @__PURE__ */ jsx(
    Select,
    {
      label: "Seleccionar Semestre",
      selectedKeys: [selectedSemester.label],
      onSelectionChange: (keys) => {
        const selectedKey = Array.from(keys)[0];
        const semester = semesters.find((s) => s.label === selectedKey);
        if (semester) {
          onSemesterChange(semester);
        }
      },
      className: "w-[200px]",
      children: semesters.map((semester) => /* @__PURE__ */ jsx(SelectItem, { children: semester.label }, semester.label))
    }
  ) });
}
function SemesterInfo({ semester }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };
  return /* @__PURE__ */ jsxs(Card, { radius: "sm", shadow: "sm", children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("h3", { className: "text-lg font-semibold", children: [
      "Información del Semestre ",
      semester.label
    ] }) }),
    /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-default-600", children: "Inicio de Inscripción:" }),
        /* @__PURE__ */ jsx("p", { className: "text-default-800", children: formatDate(semester.enrollmentStart) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-default-600", children: "Fin de Inscripción:" }),
        /* @__PURE__ */ jsx("p", { className: "text-default-800", children: formatDate(semester.enrollmentEnd) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-default-600", children: "Inicio de Clases:" }),
        /* @__PURE__ */ jsx("p", { className: "text-default-800", children: formatDate(semester.classesStart) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("span", { className: "font-medium text-default-600", children: "Fin de Clases:" }),
        /* @__PURE__ */ jsx("p", { className: "text-default-800", children: formatDate(semester.classesEnd) })
      ] })
    ] }) })
  ] });
}
function clsx$2(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Icon = {
  Dashboard: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-primary/40",
      "aria-hidden": true
    }
  ),
  Requests: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-secondary/50",
      "aria-hidden": true
    }
  ),
  Create: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-success/60",
      "aria-hidden": true
    }
  ),
  Management: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-warning/60",
      "aria-hidden": true
    }
  ),
  Reports: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-danger/50",
      "aria-hidden": true
    }
  ),
  Academic: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-info-500/60",
      "aria-hidden": true
    }
  ),
  Profile: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-default-400",
      "aria-hidden": true
    }
  ),
  Plan: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-medicine-500",
      "aria-hidden": true
    }
  ),
  Students: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-rooms-500",
      "aria-hidden": true
    }
  ),
  Roles: () => /* @__PURE__ */ jsx(
    "span",
    {
      className: "w-4 h-4 inline-block rounded-sm bg-admin-500",
      "aria-hidden": true
    }
  )
};
const BASE_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: /* @__PURE__ */ jsx(Icon.Dashboard, {}) },
  { key: "profile", label: "Perfil", icon: /* @__PURE__ */ jsx(Icon.Profile, {}) }
];
const ROLE_ITEMS = {
  student: [
    {
      key: "academic-progress",
      label: "Progreso Académico",
      icon: /* @__PURE__ */ jsx(Icon.Academic, {}),
      color: "secondary",
      moduleToken: "classes"
    },
    {
      key: "schedule",
      label: "Mi Horario",
      icon: /* @__PURE__ */ jsx(Icon.Academic, {}),
      color: "success",
      moduleToken: "classes"
    },
    {
      key: "academic-plan",
      label: "Plan Académico",
      icon: /* @__PURE__ */ jsx(Icon.Plan, {}),
      color: "primary",
      moduleToken: "medicine"
    },
    {
      key: "requests",
      label: "Solicitudes",
      icon: /* @__PURE__ */ jsx(Icon.Requests, {}),
      color: "primary"
    },
    {
      key: "create-request",
      label: "Nueva Solicitud",
      icon: /* @__PURE__ */ jsx(Icon.Create, {}),
      color: "success"
    }
  ],
  faculty: [
    {
      key: "management",
      label: "Gestión",
      icon: /* @__PURE__ */ jsx(Icon.Management, {}),
      color: "warning",
      moduleToken: "classes"
    },
    {
      key: "reports",
      label: "Reportes",
      icon: /* @__PURE__ */ jsx(Icon.Reports, {}),
      color: "secondary"
    }
  ],
  admin: [
    {
      key: "student-registration",
      label: "Registrar Estudiante",
      icon: /* @__PURE__ */ jsx(Icon.Students, {}),
      color: "success",
      moduleToken: "rooms"
    },
    {
      key: "role-management",
      label: "Roles",
      icon: /* @__PURE__ */ jsx(Icon.Roles, {}),
      color: "danger",
      moduleToken: "admin"
    },
    {
      key: "academic-progress",
      label: "Progreso Académico",
      icon: /* @__PURE__ */ jsx(Icon.Academic, {}),
      color: "secondary",
      moduleToken: "classes"
    },
    {
      key: "academic-plan",
      label: "Períodos Académicos",
      icon: /* @__PURE__ */ jsx(Icon.Plan, {}),
      color: "primary",
      moduleToken: "medicine"
    },
    {
      key: "management",
      label: "Gestión",
      icon: /* @__PURE__ */ jsx(Icon.Management, {}),
      color: "warning"
    },
    {
      key: "reports",
      label: "Reportes",
      icon: /* @__PURE__ */ jsx(Icon.Reports, {}),
      color: "secondary"
    }
  ]
};
function normalizeRole(raw) {
  if (!raw) return null;
  const r = raw.toLowerCase();
  if (["student", "estudiante"].includes(r)) return "student";
  if (["faculty", "decanatura", "profesor", "docente"].includes(r))
    return "faculty";
  if (["admin", "administrador", "administration"].includes(r)) return "admin";
  return null;
}
const Sidebar = ({
  user,
  currentView,
  onNavigate,
  className,
  collapsed: collapsedProp,
  onToggleCollapsed
}) => {
  const [internalCollapsed, setInternalCollapsed] = React.useState(false);
  const collapsed = collapsedProp ?? internalCollapsed;
  const handleToggle = () => {
    if (onToggleCollapsed) return onToggleCollapsed();
    setInternalCollapsed((c) => !c);
  };
  const role = normalizeRole(user == null ? void 0 : user.role);
  const roleItems = role ? ROLE_ITEMS[role] : [];
  const items = [...BASE_ITEMS, ...roleItems];
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: clsx$2(
        "group flex flex-col border-r border-content3/40 bg-content1 text-content1-foreground transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      ),
      "aria-label": "Barra lateral de navegación",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 h-14 shrink-0", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              isIconOnly: true,
              variant: "light",
              size: "sm",
              "aria-label": collapsed ? "Expandir sidebar" : "Colapsar sidebar",
              onPress: handleToggle,
              className: "text-default-600",
              children: collapsed ? "»" : "«"
            }
          ),
          !collapsed && /* @__PURE__ */ jsx("span", { className: "font-semibold tracking-wide text-sm", children: "SIRHA" })
        ] }),
        /* @__PURE__ */ jsx(Divider, { className: "mb-1" }),
        user && /* @__PURE__ */ jsx("div", { className: clsx$2("px-4 pb-3", collapsed && "px-2"), children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            Avatar,
            {
              name: user.name,
              className: "h-10 w-10 text-xs font-medium bg-primary/20 text-primary-600"
            }
          ),
          !collapsed && /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium truncate", children: user.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-default-500 truncate", children: user.email }),
            role && /* @__PURE__ */ jsx(
              Chip,
              {
                className: "mt-1",
                size: "sm",
                variant: "flat",
                color: role === "admin" ? "danger" : role === "faculty" ? "warning" : "primary",
                children: role
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ jsx(Divider, {}),
        /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsx(ScrollShadow, { className: "h-full py-2", size: 24, hideScrollBar: true, children: /* @__PURE__ */ jsx("ul", { className: "space-y-1 px-2", children: items.map((item) => {
          const active = currentView === item.key;
          const content = /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => onNavigate(item.key),
              "aria-current": active ? "page" : void 0,
              className: clsx$2(
                "group w-full flex items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-focus",
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-default-600 hover:bg-content2 hover:text-default-900"
              ),
              children: [
                item.icon,
                !collapsed && /* @__PURE__ */ jsx("span", { className: "truncate", children: item.label }),
                item.badge && !collapsed && /* @__PURE__ */ jsx(Badge, { color: item.color || "primary", children: item.badge })
              ]
            },
            item.key
          );
          return /* @__PURE__ */ jsx("li", { children: collapsed ? /* @__PURE__ */ jsx(Tooltip, { content: item.label, placement: "right", children: content }) : content }, item.key);
        }) }) }) }),
        /* @__PURE__ */ jsx("div", { className: "p-3 mt-auto", children: /* @__PURE__ */ jsx(
          Button,
          {
            fullWidth: true,
            variant: "flat",
            color: "danger",
            size: "sm",
            className: clsx$2(collapsed && "px-0"),
            onPress: () => onNavigate("dashboard"),
            children: collapsed ? "⏻" : "Cerrar sesión"
          }
        ) })
      ]
    }
  );
};
const studentUser = {
  id: "student-1",
  name: "Juan Pérez García",
  email: "juan.perez@escuelaing.edu.co",
  role: "student",
  studentId: "1234567890",
  academicStatus: "normal"
};
function useStudentViews(initial = "dashboard") {
  const [view, setView] = React.useState(initial);
  const navigate = (next) => setView(next);
  return {
    view,
    navigate
  };
}
function useStudentSemester() {
  const [selectedSemester, setSelectedSemester] = useSelectedSemester();
  const currentPeriod = useCurrentPeriod();
  const semesterPeriod = usePeriodForSemester(selectedSemester);
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
  const currentSemester = currentMonth <= 6 ? 1 : 2;
  const isCurrentSemester = selectedSemester.year === currentYear && selectedSemester.semester === currentSemester;
  return {
    selectedSemester,
    setSelectedSemester,
    currentPeriod,
    semesterPeriod,
    isCurrentSemester
  };
}
function clsx$1(...classes) {
  return classes.filter(Boolean).join(" ");
}
const StudentStatCard = ({
  title,
  value,
  color = "primary",
  note
}) => {
  const colorClass = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : color === "success" ? "text-success" : color === "warning" ? "text-warning" : color === "danger" ? "text-danger" : "text-default-700";
  return /* @__PURE__ */ jsx(Card, {
    className: "min-w-[160px] flex-1",
    radius: "sm",
    shadow: "sm",
    children: /* @__PURE__ */ jsxs(CardBody, {
      className: "gap-1 py-4",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-xs text-default-500 font-medium tracking-wide uppercase",
        children: title
      }), /* @__PURE__ */ jsx("p", {
        className: clsx$1("text-2xl font-semibold", colorClass),
        children: value
      }), note && /* @__PURE__ */ jsx("p", {
        className: "text-[11px] text-default-400",
        children: note
      })]
    })
  });
};
const StudentDashboardHome = () => {
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-col sm:flex-row gap-4",
      children: [/* @__PURE__ */ jsx(StudentStatCard, {
        title: "Progreso",
        value: "68%",
        color: "success",
        note: "Avance académico"
      }), /* @__PURE__ */ jsx(StudentStatCard, {
        title: "Materias",
        value: "24/43",
        color: "primary",
        note: "Completadas"
      }), /* @__PURE__ */ jsx(StudentStatCard, {
        title: "Créditos",
        value: "95/139",
        color: "secondary",
        note: "Obtenidos"
      }), /* @__PURE__ */ jsx(StudentStatCard, {
        title: "Promedio",
        value: "3.9",
        color: "warning",
        note: "Acumulado"
      })]
    }), /* @__PURE__ */ jsx(AcademicSemaphore, {
      userRole: "STUDENT",
      studentId: studentUser.studentId
    }), /* @__PURE__ */ jsxs(Card, {
      shadow: "sm",
      radius: "sm",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "flex flex-col items-start gap-1",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-lg font-semibold",
          children: "Información Académica"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xs text-default-500",
          children: "Detalles de tu programa académico"
        })]
      }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsxs(CardBody, {
        className: "space-y-3",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-sm font-medium",
            children: "Programa:"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-sm",
            children: "Ingeniería de Sistemas"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-sm font-medium",
            children: "Código:"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-sm",
            children: studentUser.studentId
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-sm font-medium",
            children: "Estado:"
          }), /* @__PURE__ */ jsx(Chip, {
            color: "success",
            variant: "flat",
            size: "sm",
            children: "Activo"
          })]
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex justify-between",
          children: [/* @__PURE__ */ jsx("span", {
            className: "text-sm font-medium",
            children: "Semestre actual:"
          }), /* @__PURE__ */ jsx("span", {
            className: "text-sm",
            children: "2024-2"
          })]
        })]
      })]
    })]
  });
};
const StudentProfileView = ({
  user
}) => /* @__PURE__ */ jsxs(Card, {
  radius: "sm",
  shadow: "sm",
  children: [/* @__PURE__ */ jsx(CardHeader, {
    children: /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-lg font-semibold",
        children: "Mi Perfil"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-xs text-default-500",
        children: "Información personal y académica"
      })]
    })
  }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsxs(CardBody, {
    className: "space-y-2 text-sm",
    children: [/* @__PURE__ */ jsxs("p", {
      children: [/* @__PURE__ */ jsx("span", {
        className: "font-medium",
        children: "Nombre:"
      }), " ", user.name]
    }), /* @__PURE__ */ jsxs("p", {
      children: [/* @__PURE__ */ jsx("span", {
        className: "font-medium",
        children: "Correo:"
      }), " ", user.email]
    }), /* @__PURE__ */ jsxs("p", {
      children: [/* @__PURE__ */ jsx("span", {
        className: "font-medium",
        children: "Código:"
      }), " ", user.studentId]
    }), /* @__PURE__ */ jsxs("p", {
      children: [/* @__PURE__ */ jsx("span", {
        className: "font-medium",
        children: "Programa:"
      }), " Ingeniería de Sistemas"]
    }), /* @__PURE__ */ jsx(Button, {
      size: "sm",
      color: "primary",
      variant: "flat",
      className: "mt-2 w-fit",
      children: "Editar perfil"
    })]
  })]
});
const SimplePlaceholder$1 = ({
  title,
  description
}) => /* @__PURE__ */ jsxs(Card, {
  radius: "sm",
  shadow: "sm",
  children: [/* @__PURE__ */ jsx(CardHeader, {
    children: /* @__PURE__ */ jsx("h2", {
      className: "text-lg font-semibold",
      children: title
    })
  }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx(CardBody, {
    children: /* @__PURE__ */ jsx("p", {
      className: "text-sm text-default-600",
      children: description || "Sección en construcción. Próximamente funcionalidades completas."
    })
  })]
});
const studentDashboard = UNSAFE_withComponentProps(function StudentDashboardRoute() {
  const {
    view,
    navigate
  } = useStudentViews("dashboard");
  const {
    selectedSemester,
    setSelectedSemester,
    semesterPeriod,
    isCurrentSemester
  } = useStudentSemester();
  let content;
  switch (view) {
    case "dashboard":
      content = /* @__PURE__ */ jsx(StudentDashboardHome, {});
      break;
    case "academic-progress":
      content = /* @__PURE__ */ jsx(AcademicSemaphore, {
        userRole: "STUDENT",
        studentId: studentUser.studentId
      });
      break;
    case "profile":
      content = /* @__PURE__ */ jsx(StudentProfileView, {
        user: studentUser
      });
      break;
    case "requests":
      content = /* @__PURE__ */ jsx(SimplePlaceholder$1, {
        title: "Mis Solicitudes",
        description: "Historial de solicitudes realizadas."
      });
      break;
    case "create-request":
      content = /* @__PURE__ */ jsx(SimplePlaceholder$1, {
        title: "Nueva Solicitud",
        description: "Formulario para crear una nueva solicitud."
      });
      break;
    case "academic-plan":
      content = /* @__PURE__ */ jsx(AcademicGrid, {});
      break;
    case "schedule":
      content = /* @__PURE__ */ jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          children: [isCurrentSemester && /* @__PURE__ */ jsx(InformativeMessage, {
            period: semesterPeriod,
            onCtaClick: () => {
              console.log("CTA clicked for period:", semesterPeriod);
            }
          }), /* @__PURE__ */ jsx("div", {
            className: "sm:ml-4 min-w-[200px]",
            children: /* @__PURE__ */ jsx(SemesterSelector, {
              selectedSemester,
              onSemesterChange: setSelectedSemester
            })
          })]
        }), /* @__PURE__ */ jsx(SemesterInfo, {
          semester: selectedSemester
        }), /* @__PURE__ */ jsx(AcademicSchedule, {})]
      });
      break;
    default:
      content = /* @__PURE__ */ jsx(SimplePlaceholder$1, {
        title: "Vista"
      });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "flex h-dvh w-dvw bg-content2 text-content2-foreground",
    children: [/* @__PURE__ */ jsx(Sidebar, {
      user: studentUser,
      currentView: view,
      onNavigate: navigate
    }), /* @__PURE__ */ jsx("main", {
      className: "flex-1 h-full overflow-y-auto p-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-7xl mx-auto",
        children: [/* @__PURE__ */ jsxs("header", {
          className: "flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-semibold tracking-tight",
              children: view === "dashboard" ? "Mi Dashboard" : view === "academic-progress" ? "Progreso Académico" : view === "schedule" ? "Mi Horario Académico" : view.replace("-", " ")
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-default-500",
              children: view === "dashboard" ? "Resumen de tu información académica." : view === "schedule" ? "Consulta tu horario de clases y materias." : "Gestión de la sección seleccionada."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-2",
            children: [/* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "flat",
              color: "secondary",
              onPress: () => navigate("dashboard"),
              children: "Inicio"
            }), /* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "flat",
              color: "primary",
              onPress: () => navigate("academic-progress"),
              children: "Mi Progreso"
            }), /* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "flat",
              color: "success",
              onPress: () => navigate("schedule"),
              children: "Mi Horario"
            })]
          })]
        }), content, /* @__PURE__ */ jsx(Spacer, {
          y: 12
        }), /* @__PURE__ */ jsxs("footer", {
          className: "pt-8 pb-6 text-center text-[11px] text-default-400",
          children: ["SIRHA · Dashboard Estudiantil ·", " ", (/* @__PURE__ */ new Date()).getFullYear()]
        })]
      })
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: studentDashboard
}, Symbol.toStringTag, { value: "Module" }));
const mockPeriods = [
  {
    id: "1",
    name: "2024-1",
    startDate: "2024-02-01",
    endDate: "2024-06-30",
    status: "cerrado"
  },
  {
    id: "2",
    name: "2024-2",
    startDate: "2024-08-01",
    endDate: "2024-12-15",
    status: "activo"
  },
  {
    id: "3",
    name: "2025-1",
    startDate: "2025-02-01",
    endDate: "2025-06-30",
    status: "futuro"
  }
];
function PeriodsManagement({
  userRole = "ADMIN"
}) {
  console.log("User role:", userRole);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingPeriod, setEditingPeriod] = useState(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const queryClient2 = useQueryClient();
  const { data: periods = [], isLoading } = useQuery({
    queryKey: ["academic-periods"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockPeriods;
    }
  });
  const savePeriodMutation = useMutation({
    mutationFn: async (period) => {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      const existingPeriod = mockPeriods.find(
        (p) => p.name === period.name && p.id !== period.id
      );
      if (existingPeriod) {
        throw new Error("Ya existe un período con ese nombre");
      }
      if (new Date(period.startDate) >= new Date(period.endDate)) {
        throw new Error(
          "La fecha de inicio debe ser anterior a la fecha de fin"
        );
      }
      const hasOverlap = mockPeriods.some((p) => {
        if (p.id === period.id) return false;
        const pStart = /* @__PURE__ */ new Date(p.startDate + "T00:00:00");
        const pEnd = /* @__PURE__ */ new Date(p.endDate + "T23:59:59");
        const newStart = /* @__PURE__ */ new Date(period.startDate + "T00:00:00");
        const newEnd = /* @__PURE__ */ new Date(period.endDate + "T23:59:59");
        return newStart < pEnd && newEnd > pStart;
      });
      if (hasOverlap) {
        throw new Error("Las fechas se solapan con otro período existente");
      }
      return period;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["academic-periods"] });
      onClose();
      setEditingPeriod(null);
    }
  });
  const deletePeriodMutation = useMutation({
    mutationFn: async (id) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return id;
    },
    onSuccess: () => {
      queryClient2.invalidateQueries({ queryKey: ["academic-periods"] });
      setDeleteConfirm(null);
    }
  });
  const form = useForm({
    defaultValues: {
      name: (editingPeriod == null ? void 0 : editingPeriod.name) || "",
      startDate: (editingPeriod == null ? void 0 : editingPeriod.startDate) || "",
      endDate: (editingPeriod == null ? void 0 : editingPeriod.endDate) || ""
    },
    onSubmit: async ({ value }) => {
      const periodData = {
        ...value,
        id: editingPeriod == null ? void 0 : editingPeriod.id,
        status: getStatusFromDates(value.startDate, value.endDate)
      };
      savePeriodMutation.mutate(periodData);
    }
  });
  const getStatusFromDates = (startDate, endDate) => {
    const now = /* @__PURE__ */ new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "futuro";
    if (now > end) return "cerrado";
    return "activo";
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "activo":
        return "success";
      case "cerrado":
        return "default";
      case "futuro":
        return "primary";
      default:
        return "default";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "activo":
        return "Activo";
      case "cerrado":
        return "Cerrado";
      case "futuro":
        return "Futuro";
      default:
        return status;
    }
  };
  const handleEdit = (period) => {
    setEditingPeriod(period);
    form.setFieldValue("name", period.name);
    form.setFieldValue("startDate", period.startDate);
    form.setFieldValue("endDate", period.endDate);
    onOpen();
  };
  const handleNew = () => {
    setEditingPeriod(null);
    form.reset();
    onOpen();
  };
  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      deletePeriodMutation.mutate(id);
    } else {
      setDeleteConfirm(id);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs(Card, { children: [
      /* @__PURE__ */ jsxs(CardHeader, { className: "flex justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold", children: "Períodos Académicos" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-default-500", children: "Gestión de períodos académicos del sistema" })
        ] }),
        /* @__PURE__ */ jsx(Button, { color: "primary", onPress: handleNew, children: "Nuevo Período" })
      ] }),
      /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsxs(Table, { "aria-label": "Tabla de períodos académicos", children: [
        /* @__PURE__ */ jsxs(TableHeader, { children: [
          /* @__PURE__ */ jsx(TableColumn, { children: "NOMBRE" }),
          /* @__PURE__ */ jsx(TableColumn, { children: "FECHA INICIO" }),
          /* @__PURE__ */ jsx(TableColumn, { children: "FECHA FIN" }),
          /* @__PURE__ */ jsx(TableColumn, { children: "ESTADO" }),
          /* @__PURE__ */ jsx(TableColumn, { children: "ACCIONES" })
        ] }),
        /* @__PURE__ */ jsx(TableBody, { isLoading, children: periods.map((period) => /* @__PURE__ */ jsxs(TableRow, { children: [
          /* @__PURE__ */ jsx(TableCell, { className: "font-medium", children: period.name }),
          /* @__PURE__ */ jsx(TableCell, { children: new Date(period.startDate).toLocaleDateString() }),
          /* @__PURE__ */ jsx(TableCell, { children: new Date(period.endDate).toLocaleDateString() }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(Chip, { color: getStatusColor(period.status), variant: "flat", children: getStatusLabel(period.status) }) }),
          /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "light",
                color: "primary",
                onPress: () => handleEdit(period),
                children: "Editar"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "light",
                color: "danger",
                onPress: () => handleDelete(period.id),
                children: deleteConfirm === period.id ? "Confirmar" : "Eliminar"
              }
            ),
            deleteConfirm === period.id && /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "light",
                onPress: () => setDeleteConfirm(null),
                children: "Cancelar"
              }
            )
          ] }) })
        ] }, period.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Modal, { isOpen, onClose, size: "lg", children: /* @__PURE__ */ jsx(ModalContent, { children: /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: (e) => {
          e.preventDefault();
          form.handleSubmit();
        },
        children: [
          /* @__PURE__ */ jsx(ModalHeader, { children: editingPeriod ? "Editar Período" : "Nuevo Período" }),
          /* @__PURE__ */ jsxs(ModalBody, { className: "space-y-4", children: [
            savePeriodMutation.error && /* @__PURE__ */ jsx(Alert, { color: "danger", title: "Error", children: savePeriodMutation.error.message }),
            /* @__PURE__ */ jsx(
              form.Field,
              {
                name: "name",
                validators: {
                  onChange: ({ value }) => {
                    if (!value) return "Nombre requerido";
                    if (value.length < 3) return "Mínimo 3 caracteres";
                  }
                },
                children: (field) => /* @__PURE__ */ jsx(
                  Input,
                  {
                    label: "Nombre del Período",
                    placeholder: "Ej: 2024-1",
                    value: field.state.value,
                    onChange: (e) => field.handleChange(e.target.value),
                    isInvalid: !!field.state.meta.errors.length,
                    errorMessage: field.state.meta.errors[0],
                    isRequired: true
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              form.Field,
              {
                name: "startDate",
                validators: {
                  onChange: ({ value }) => {
                    if (!value) return "Fecha de inicio requerida";
                  }
                },
                children: (field) => /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "date",
                    label: "Fecha de Inicio",
                    value: field.state.value,
                    onChange: (e) => field.handleChange(e.target.value),
                    isInvalid: !!field.state.meta.errors.length,
                    errorMessage: field.state.meta.errors[0],
                    isRequired: true
                  }
                )
              }
            ),
            /* @__PURE__ */ jsx(
              form.Field,
              {
                name: "endDate",
                validators: {
                  onChange: ({ value, fieldApi }) => {
                    if (!value) return "Fecha de fin requerida";
                    const startDate = fieldApi.form.getFieldValue("startDate");
                    if (startDate && new Date(value) <= new Date(startDate)) {
                      return "La fecha de fin debe ser posterior a la fecha de inicio";
                    }
                  }
                },
                children: (field) => /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "date",
                    label: "Fecha de Fin",
                    value: field.state.value,
                    onChange: (e) => field.handleChange(e.target.value),
                    isInvalid: !!field.state.meta.errors.length,
                    errorMessage: field.state.meta.errors[0],
                    isRequired: true
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(ModalFooter, { children: [
            /* @__PURE__ */ jsx(Button, { variant: "light", onPress: onClose, children: "Cancelar" }),
            /* @__PURE__ */ jsx(
              Button,
              {
                color: "primary",
                type: "submit",
                isLoading: savePeriodMutation.isPending,
                children: editingPeriod ? "Actualizar" : "Crear"
              }
            )
          ] })
        ]
      }
    ) }) })
  ] });
}
const mockStudents = [
  {
    id: "1",
    name: "Juan Pérez García",
    email: "juan.perez@escuelaing.edu.co",
    code: "1234567890",
    program: "Ingeniería de Sistemas",
    status: "activo"
  },
  {
    id: "2",
    name: "María González López",
    email: "maria.gonzalez@escuelaing.edu.co",
    code: "1234567891",
    program: "Ingeniería Civil",
    status: "activo"
  },
  {
    id: "3",
    name: "Carlos Rodríguez Silva",
    email: "carlos.rodriguez@escuelaing.edu.co",
    code: "1234567892",
    program: "Ingeniería de Sistemas",
    status: "activo"
  },
  {
    id: "4",
    name: "Ana Martínez Torres",
    email: "ana.martinez@escuelaing.edu.co",
    code: "1234567893",
    program: "Ingeniería Biomédica",
    status: "graduado"
  }
];
function StudentSelector({ onSelectStudent }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStudents = mockStudents.filter(
    (student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase()) || student.code.includes(searchTerm)
  );
  const getStatusColor = (status) => {
    switch (status) {
      case "activo":
        return "success";
      case "inactivo":
        return "warning";
      case "graduado":
        return "primary";
      default:
        return "default";
    }
  };
  const getStatusLabel = (status) => {
    switch (status) {
      case "activo":
        return "Activo";
      case "inactivo":
        return "Inactivo";
      case "graduado":
        return "Graduado";
      default:
        return status;
    }
  };
  return /* @__PURE__ */ jsxs(Card, { children: [
    /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "Seleccionar Estudiante" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-default-600 mb-4", children: "Selecciona un estudiante para ver su progreso académico" }),
      /* @__PURE__ */ jsx(
        Input,
        {
          placeholder: "Buscar por nombre, email o código...",
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value),
          className: "max-w-sm"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx(CardBody, { children: /* @__PURE__ */ jsxs(Table, { "aria-label": "Tabla de estudiantes", children: [
      /* @__PURE__ */ jsxs(TableHeader, { children: [
        /* @__PURE__ */ jsx(TableColumn, { children: "NOMBRE" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "CÓDIGO" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "PROGRAMA" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "ESTADO" }),
        /* @__PURE__ */ jsx(TableColumn, { children: "ACCIONES" })
      ] }),
      /* @__PURE__ */ jsx(TableBody, { children: filteredStudents.map((student) => /* @__PURE__ */ jsxs(TableRow, { children: [
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium", children: student.name }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-default-500", children: student.email })
        ] }) }),
        /* @__PURE__ */ jsx(TableCell, { children: student.code }),
        /* @__PURE__ */ jsx(TableCell, { children: student.program }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Chip,
          {
            color: getStatusColor(student.status),
            variant: "flat",
            size: "sm",
            children: getStatusLabel(student.status)
          }
        ) }),
        /* @__PURE__ */ jsx(TableCell, { children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "sm",
            color: "primary",
            variant: "flat",
            onPress: () => onSelectStudent(student),
            children: "Ver Progreso"
          }
        ) })
      ] }, student.id)) })
    ] }) })
  ] });
}
const adminUser = {
  id: "admin-1",
  name: "Administrador General",
  email: "admin@sirha.edu",
  role: "admin"
};
function useAdminViews(initial = "dashboard") {
  const [view, setView] = React.useState(initial);
  const navigate = (next) => setView(next);
  return {
    view,
    navigate
  };
}
function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}
const StatCard = ({
  title,
  value,
  color = "primary",
  note
}) => {
  const colorClass = color === "primary" ? "text-primary" : color === "secondary" ? "text-secondary" : color === "success" ? "text-success" : color === "warning" ? "text-warning" : color === "danger" ? "text-danger" : "text-default-700";
  return /* @__PURE__ */ jsx(Card, {
    className: "min-w-[160px] flex-1",
    radius: "sm",
    shadow: "sm",
    children: /* @__PURE__ */ jsxs(CardBody, {
      className: "gap-1 py-4",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-xs text-default-500 font-medium tracking-wide uppercase",
        children: title
      }), /* @__PURE__ */ jsx("p", {
        className: clsx("text-2xl font-semibold", colorClass),
        children: value
      }), note && /* @__PURE__ */ jsx("p", {
        className: "text-[11px] text-default-400",
        children: note
      })]
    })
  });
};
const DashboardHome = () => {
  return /* @__PURE__ */ jsxs("div", {
    className: "space-y-6",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex flex-col sm:flex-row gap-4",
      children: [/* @__PURE__ */ jsx(StatCard, {
        title: "Usuarios",
        value: 428,
        note: "Activos este mes"
      }), /* @__PURE__ */ jsx(StatCard, {
        title: "Solicitudes",
        value: 73,
        color: "secondary",
        note: "Pendientes de revisión"
      }), /* @__PURE__ */ jsx(StatCard, {
        title: "Aprobadas",
        value: 58,
        color: "success",
        note: "Últimos 7 días"
      }), /* @__PURE__ */ jsx(StatCard, {
        title: "Rechazadas",
        value: 15,
        color: "danger",
        note: "Últimos 7 días"
      })]
    }), /* @__PURE__ */ jsxs(Card, {
      shadow: "sm",
      radius: "sm",
      children: [/* @__PURE__ */ jsxs(CardHeader, {
        className: "flex flex-col items-start gap-1",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-lg font-semibold",
          children: "Actividad reciente"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-xs text-default-500",
          children: "Resumen de las últimas acciones del sistema"
        })]
      }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx(CardBody, {
        className: "overflow-x-auto",
        children: /* @__PURE__ */ jsxs(Table, {
          "aria-label": "Actividad reciente",
          removeWrapper: true,
          className: "min-w-[560px]",
          children: [/* @__PURE__ */ jsxs(TableHeader, {
            children: [/* @__PURE__ */ jsx(TableColumn, {
              children: "FECHA"
            }), /* @__PURE__ */ jsx(TableColumn, {
              children: "ACCIÓN"
            }), /* @__PURE__ */ jsx(TableColumn, {
              children: "USUARIO"
            }), /* @__PURE__ */ jsx(TableColumn, {
              children: "ESTADO"
            })]
          }), /* @__PURE__ */ jsx(TableBody, {
            children: [{
              id: "a1",
              d: "2025-09-20 09:12",
              act: "Registro estudiante",
              u: "mperez",
              s: "OK"
            }, {
              id: "a2",
              d: "2025-09-20 09:30",
              act: "Cambio rol",
              u: "admin",
              s: "OK"
            }, {
              id: "a3",
              d: "2025-09-20 10:05",
              act: "Solicitud sala",
              u: "lrojas",
              s: "Pendiente"
            }, {
              id: "a4",
              d: "2025-09-20 10:18",
              act: "Solicitud equipo deportivo",
              u: "jdiaz",
              s: "Rechazada"
            }].map((r) => /* @__PURE__ */ jsxs(TableRow, {
              children: [/* @__PURE__ */ jsx(TableCell, {
                className: "text-xs",
                children: r.d
              }), /* @__PURE__ */ jsx(TableCell, {
                className: "text-sm font-medium",
                children: r.act
              }), /* @__PURE__ */ jsx(TableCell, {
                className: "text-xs text-default-500",
                children: r.u
              }), /* @__PURE__ */ jsxs(TableCell, {
                children: [r.s === "OK" && /* @__PURE__ */ jsx(Chip, {
                  size: "sm",
                  color: "success",
                  variant: "flat",
                  children: r.s
                }), r.s === "Pendiente" && /* @__PURE__ */ jsx(Chip, {
                  size: "sm",
                  color: "warning",
                  variant: "flat",
                  children: r.s
                }), r.s === "Rechazada" && /* @__PURE__ */ jsx(Chip, {
                  size: "sm",
                  color: "danger",
                  variant: "flat",
                  children: r.s
                })]
              })]
            }, r.id))
          })]
        })
      })]
    })]
  });
};
const ProfileView = ({
  user
}) => /* @__PURE__ */ jsxs(Card, {
  radius: "sm",
  shadow: "sm",
  children: [/* @__PURE__ */ jsx(CardHeader, {
    children: /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-lg font-semibold",
        children: "Perfil"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-xs text-default-500",
        children: "Información básica del administrador"
      })]
    })
  }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsxs(CardBody, {
    className: "space-y-2 text-sm",
    children: [/* @__PURE__ */ jsxs("p", {
      children: [/* @__PURE__ */ jsx("span", {
        className: "font-medium",
        children: "Nombre:"
      }), " ", user.name]
    }), /* @__PURE__ */ jsxs("p", {
      children: [/* @__PURE__ */ jsx("span", {
        className: "font-medium",
        children: "Correo:"
      }), " ", user.email]
    }), /* @__PURE__ */ jsxs("p", {
      children: [/* @__PURE__ */ jsx("span", {
        className: "font-medium",
        children: "Rol:"
      }), " ", user.role]
    }), /* @__PURE__ */ jsx(Button, {
      size: "sm",
      color: "primary",
      variant: "flat",
      className: "mt-2 w-fit",
      children: "Editar perfil"
    })]
  })]
});
const SimplePlaceholder = ({
  title,
  description
}) => /* @__PURE__ */ jsxs(Card, {
  radius: "sm",
  shadow: "sm",
  children: [/* @__PURE__ */ jsx(CardHeader, {
    children: /* @__PURE__ */ jsx("h2", {
      className: "text-lg font-semibold",
      children: title
    })
  }), /* @__PURE__ */ jsx(Divider, {}), /* @__PURE__ */ jsx(CardBody, {
    children: /* @__PURE__ */ jsx("p", {
      className: "text-sm text-default-600",
      children: description || "Sección en construcción. Próximamente funcionalidades completas."
    })
  })]
});
const adminDashboard = UNSAFE_withComponentProps(function AdminDashboardRoute() {
  const {
    view,
    navigate
  } = useAdminViews("dashboard");
  let content;
  switch (view) {
    case "dashboard":
      content = /* @__PURE__ */ jsx(DashboardHome, {});
      break;
    case "role-management":
      content = /* @__PURE__ */ jsx(RoleManagement, {});
      break;
    case "student-registration":
      content = /* @__PURE__ */ jsx(StudentRegistration, {});
      break;
    case "profile":
      content = /* @__PURE__ */ jsx(ProfileView, {
        user: adminUser
      });
      break;
    case "requests":
      content = /* @__PURE__ */ jsx(SimplePlaceholder, {
        title: "Solicitudes",
        description: "Listado y gestión de solicitudes entrantes."
      });
      break;
    case "create-request":
      content = /* @__PURE__ */ jsx(SimplePlaceholder, {
        title: "Nueva Solicitud",
        description: "Formulario para creación manual de solicitud."
      });
      break;
    case "management":
      content = /* @__PURE__ */ jsx(SimplePlaceholder, {
        title: "Gestión",
        description: "Panel centralizado de operaciones administrativas."
      });
      break;
    case "reports":
      content = /* @__PURE__ */ jsx(SimplePlaceholder, {
        title: "Reportes",
        description: "Generación y descarga de reportes analíticos."
      });
      break;
    case "academic-progress":
      content = /* @__PURE__ */ jsxs("div", {
        className: "space-y-6",
        children: [/* @__PURE__ */ jsx(StudentSelector, {
          onSelectStudent: (student) => {
            console.log("Selected student:", student);
          }
        }), /* @__PURE__ */ jsx(AcademicSemaphore, {
          userRole: "ADMIN",
          studentId: "admin-view",
          targetStudentId: "1234567890"
        })]
      });
      break;
    case "academic-plan":
      content = /* @__PURE__ */ jsx(PeriodsManagement, {
        userRole: "ADMIN"
      });
      break;
    default:
      content = /* @__PURE__ */ jsx(SimplePlaceholder, {
        title: "Vista"
      });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "flex h-dvh w-dvw bg-content2 text-content2-foreground",
    children: [/* @__PURE__ */ jsx(Sidebar, {
      user: adminUser,
      currentView: view,
      onNavigate: navigate
    }), /* @__PURE__ */ jsx("main", {
      className: "flex-1 h-full overflow-y-auto p-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "max-w-7xl mx-auto",
        children: [/* @__PURE__ */ jsxs("header", {
          className: "flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("h1", {
              className: "text-2xl font-semibold tracking-tight",
              children: view === "dashboard" ? "Panel Administrativo" : view.replace("-", " ")
            }), /* @__PURE__ */ jsx("p", {
              className: "text-xs text-default-500",
              children: view === "dashboard" ? "Resumen general del sistema y métricas principales." : "Gestión de la sección seleccionada."
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex gap-2",
            children: [/* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "flat",
              color: "secondary",
              onPress: () => navigate("dashboard"),
              children: "Inicio"
            }), /* @__PURE__ */ jsx(Button, {
              size: "sm",
              variant: "flat",
              color: "primary",
              onPress: () => navigate("reports"),
              children: "Reportes"
            })]
          })]
        }), content, /* @__PURE__ */ jsx(Spacer, {
          y: 12
        }), /* @__PURE__ */ jsxs("footer", {
          className: "pt-8 pb-6 text-center text-[11px] text-default-400",
          children: ["SIRHA · Dashboard Administrativo ·", " ", (/* @__PURE__ */ new Date()).getFullYear()]
        })]
      })
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: adminDashboard
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CVsZnadg.js", "imports": ["/assets/index-BozS7dwg.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-B20Dg9-r.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/QueryClientProvider-C9Cpl-59.js", "/assets/query-Pcq8wdku.js", "/assets/filter-props-w36Z9eCG.js", "/assets/useModal-Co5K6ijZ.js", "/assets/global-config-B5DaTUF1.js"], "css": ["/assets/root-DhUPBJFC.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home/home": { "id": "routes/home/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-3_Q5qvci.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/filter-props-w36Z9eCG.js", "/assets/chunk-WBUKVQRU-D83Npybh.js", "/assets/index-DrMVgKsE.js", "/assets/chunk-JOT4BT4P-CA7sXvRI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin/admin": { "id": "routes/admin/admin", "parentId": "root", "path": "/admin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/admin-DfahEJFp.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/role-management-CvnvGvDc.js", "/assets/student-registration-B-iTyGcQ.js", "/assets/chunk-WBUKVQRU-D83Npybh.js", "/assets/chunk-ICU6NNET-Bz7BzOns.js", "/assets/useQuery-BCrtMYGT.js", "/assets/chunk-XJ2YRSUP-CDLwH12k.js", "/assets/filter-props-w36Z9eCG.js", "/assets/useMutation-D7hWThM1.js", "/assets/QueryClientProvider-C9Cpl-59.js", "/assets/chunk-SSA7SXE4-L4GPux4n.js", "/assets/query-Pcq8wdku.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login/login": { "id": "routes/login/login", "parentId": "root", "path": "/login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-D3yQDiUM.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/chunk-ICU6NNET-Bz7BzOns.js", "/assets/chunk-XJ2YRSUP-CDLwH12k.js", "/assets/chunk-WBUKVQRU-D83Npybh.js", "/assets/filter-props-w36Z9eCG.js", "/assets/chunk-SSA7SXE4-L4GPux4n.js", "/assets/chunk-JOT4BT4P-CA7sXvRI.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/register/register": { "id": "routes/register/register", "parentId": "root", "path": "/register", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/register-qRobXUQ0.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/student-registration-B-iTyGcQ.js", "/assets/chunk-WBUKVQRU-D83Npybh.js", "/assets/chunk-JOT4BT4P-CA7sXvRI.js", "/assets/chunk-ICU6NNET-Bz7BzOns.js", "/assets/useMutation-D7hWThM1.js", "/assets/filter-props-w36Z9eCG.js", "/assets/QueryClientProvider-C9Cpl-59.js", "/assets/chunk-SSA7SXE4-L4GPux4n.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/academic-progress/academic-progress": { "id": "routes/academic-progress/academic-progress", "parentId": "root", "path": "/academic-progress", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/academic-progress-jGLC-cWa.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/academic-semaphore-B3mugncz.js", "/assets/chunk-WBUKVQRU-D83Npybh.js", "/assets/chunk-JOT4BT4P-CA7sXvRI.js", "/assets/chunk-ICU6NNET-Bz7BzOns.js", "/assets/useQuery-BCrtMYGT.js", "/assets/useMutation-D7hWThM1.js", "/assets/filter-props-w36Z9eCG.js", "/assets/QueryClientProvider-C9Cpl-59.js", "/assets/chunk-XJ2YRSUP-CDLwH12k.js", "/assets/query-Pcq8wdku.js", "/assets/useModal-Co5K6ijZ.js", "/assets/index-BkE0-fgG.js", "/assets/global-config-B5DaTUF1.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/student-dashboard/student-dashboard": { "id": "routes/student-dashboard/student-dashboard", "parentId": "root", "path": "/student-dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/student-dashboard-Dtzc33wo.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/chunk-ICU6NNET-Bz7BzOns.js", "/assets/chunk-XJ2YRSUP-CDLwH12k.js", "/assets/sidebar-DE08m5e8.js", "/assets/chunk-SSA7SXE4-L4GPux4n.js", "/assets/chunk-WBUKVQRU-D83Npybh.js", "/assets/academic-semaphore-B3mugncz.js", "/assets/useMutation-D7hWThM1.js", "/assets/useQuery-BCrtMYGT.js", "/assets/filter-props-w36Z9eCG.js", "/assets/index-DrMVgKsE.js", "/assets/QueryClientProvider-C9Cpl-59.js", "/assets/useModal-Co5K6ijZ.js", "/assets/index-BkE0-fgG.js", "/assets/global-config-B5DaTUF1.js", "/assets/query-Pcq8wdku.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/admin-dashboard/admin-dashboard": { "id": "routes/admin-dashboard/admin-dashboard", "parentId": "root", "path": "/admin-dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/admin-dashboard-Dlt111zr.js", "imports": ["/assets/index-BozS7dwg.js", "/assets/academic-semaphore-B3mugncz.js", "/assets/student-registration-B-iTyGcQ.js", "/assets/useQuery-BCrtMYGT.js", "/assets/QueryClientProvider-C9Cpl-59.js", "/assets/useMutation-D7hWThM1.js", "/assets/sidebar-DE08m5e8.js", "/assets/chunk-ICU6NNET-Bz7BzOns.js", "/assets/chunk-WBUKVQRU-D83Npybh.js", "/assets/chunk-XJ2YRSUP-CDLwH12k.js", "/assets/chunk-SSA7SXE4-L4GPux4n.js", "/assets/role-management-CvnvGvDc.js", "/assets/filter-props-w36Z9eCG.js", "/assets/useModal-Co5K6ijZ.js", "/assets/index-BkE0-fgG.js", "/assets/global-config-B5DaTUF1.js", "/assets/query-Pcq8wdku.js", "/assets/index-DrMVgKsE.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-8008811e.js", "version": "8008811e", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home/home": {
    id: "routes/home/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/admin/admin": {
    id: "routes/admin/admin",
    parentId: "root",
    path: "/admin",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/login/login": {
    id: "routes/login/login",
    parentId: "root",
    path: "/login",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/register/register": {
    id: "routes/register/register",
    parentId: "root",
    path: "/register",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/academic-progress/academic-progress": {
    id: "routes/academic-progress/academic-progress",
    parentId: "root",
    path: "/academic-progress",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/student-dashboard/student-dashboard": {
    id: "routes/student-dashboard/student-dashboard",
    parentId: "root",
    path: "/student-dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/admin-dashboard/admin-dashboard": {
    id: "routes/admin-dashboard/admin-dashboard",
    parentId: "root",
    path: "/admin-dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
