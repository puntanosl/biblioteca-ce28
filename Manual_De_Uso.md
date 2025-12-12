# MANUAL DE USO Y CARACTERÍSTICAS TÉCNICAS
**Aplicación Web: Biblioteca Dr. René Favaloro**
**Versión:** 12.0 (Final)
**Desarrollado por:** Cristian Manuel Escudero (DNI: 26.858.047)

---

## 1. RESUMEN GENERAL
Esta aplicación es una **Progressive Web App (PWA)** diseñada para gestionar la comunicación, el inventario y las actividades educativas de la Biblioteca. Funciona en tiempo real conectada a la nube (Firebase), permitiendo interacción instantánea entre alumnos, docentes y administradores.

La aplicación cuenta con características avanzadas como:
- **Inteligencia Artificial (IA)** integrada para asistencia al usuario.
- **Sistema de Chat en Vivo** para consultas.
- **Portal de Actividades** para intercambio de material educativo.
- **Gestión Jerárquica de Usuarios** con múltiples niveles de administración.
- **Seguridad** con cambio de contraseña obligatorio y protección de código.

---

## 2. ROLES Y PERMISOS DE USUARIO
El sistema divide a los usuarios en categorías con permisos específicos:

### A. SUPER ADMINISTRADOR (Encargada/Jefe)
**Acceso:** Total e Irrestricto.
- **Gestión de Usuarios:** Puede crear nuevos administradores y asignarles roles específicos.
- **Comunicaciones:** Puede enviar "Difusiones" (Notificaciones masivas) a grados o divisiones específicas.
- **Control Total:** Acceso a editar/borrar en todas las secciones (Libros, Actividades, Chat).
- **Identificación:** Usuarios específicos (ej. Cristian Escudero, Marcela Hernández).

### B. ADMINISTRADOR DOCENTE
**Acceso:** Seccionado (Área Educativa).
- **Función:** Gestionar el "Portal Docente" y "Actividades".
- **Permisos:** Subir archivos, tareas o comunicados educativos. Borrar material obsoleto.
- **Restricción:** No puede modificar el inventario de libros ni crear nuevos administradores.

### C. ADMINISTRADOR BIBLIOTECA
**Acceso:** Seccionado (Área Inventario).
- **Función:** Gestionar el catálogo de libros.
- **Permisos:** Agregar nuevos libros al sistema, editar estados (Prestado/Disponible) y gestionar el inventario.
- **Restricción:** No tiene control sobre las actividades docentes ni gestión de usuarios avanzados.

### D. DOCENTE
- **Permisos:** Similar al Admin Docente, pero enfocado en compartir material para sus cursos.

### E. ALUMNO / PADRE (Usuario General)
- **Catálogo:** Puede buscar libros y ver disponibilidad, pero no editar.
- **Actividades:** Puede descargar material, pero no subir ni borrar.
- **Chat:** Puede enviar consultas en el chat público.
- **IA:** Puede consultar a la IA para ayuda sobre la app.

---

## 3. FUNCIONES DETALLADAS

### 🤖 Asistente IA (Inteligentcia Artificial)
- Un bot integrado responde preguntas frecuentes sobre el uso de la app (Cómo entrar, cómo buscar libros, qué hacer si olvidé la clave).
- Disponible desde la pantalla de bienvenida para invitados.

### 📚 Catálogo Digital
- Buscador en tiempo real por Título o Autor.
- Indicadores visuales de estado: "🟢 Disponible" o "⚫ Prestado".
- Fichas de detalle con descripción del libro.

### 📢 Sistema de Difusión
- Herramienta exclusiva para Super Admins.
- Permite enviar alertas visibles en la pantalla de inicio de todos los usuarios (ej. "Mañana biblioteca cerrada").

### 🔐 Seguridad y Auditoría
- **Contraseñas Seguras:** Los nuevos administradores reciben una clave temporal ("Admin123") y el sistema les **OBLIGA** a cambiarla en su primer ingreso.
- **Protección de Código:** Se ha bloqueado el "Clic Derecho" y las herramientas de inspección (F12) para proteger la propiedad intelectual del diseño.
- **Pie de Página Legal:** Todas las pantallas incluyen el copyright y la autoría de Cristian Manuel Escudero.

---

## 4. GUÍA DE INGRESO PARA NUEVOS ADMINS
1. El Super Admin crea la cuenta ingresando el email del nuevo usuario y seleccionando su ROL.
2. El sistema genera el usuario con la contraseña `Admin123`.
3. El nuevo usuario ingresa su email y la contraseña `Admin123`.
4. **Automáticamente**, la App detecta que es su primera vez y bloquea la pantalla, mostrando un formulario para crear su NUEVA contraseña personal.
5. Una vez cambiada, obtiene acceso a sus funciones.

---
© 2025 BIBLIOTECA CENTRO EDUCATIVO N° 28 DR. RENÉ FAVALORO
