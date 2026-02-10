# Notes App Pro 📝✨

Una aplicación de notas moderna, rápida y minimalista construida con **Next.js 15**, **Prisma** y **SQLite**. Diseñada para ofrecer una experiencia de escritura fluida con una interfaz limpia y profesional.

## ✨ Características

- **Gestión Completa de Notas**: Crea, edita y organiza tus pensamientos al instante.
- **Arquitectura Moderna**: Construida sobre los últimos estándares de Next.js (App Router, Server Actions).
- **Persistencia con Prisma**: Gestión de base de datos robusta y tipado seguro.
- **Diseño Responsivo**: Totalmente adaptable a móviles y escritorio.
- **Búsqueda Instantánea**: Encuentra tus notas rápidamente (Próximamente).
- **Modo Oscuro/Claro Nativo**: Adaptable a las preferencias de tu sistema.

## 🛠 Tecnologías Utilizadas

- **Frontend/Framework**: Next.js 15 (React 19)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos**: Prisma ORM con SQLite
- **Iconografía**: Lucide React / Heroicons

## 🚀 Super Instalación (Un solo comando)

Copia y pega esto en tu terminal (CMD o PowerShell) para clonar y arrancar el proyecto al instante:

```bash
git clone https://github.com/Ivancitoo-N/Notes-app.git && cd Notes-app && start.bat
```

---

## 🛠 Instalación Paso a Paso (Manual)
   ```bash
   npm install
   ```
3. **Configuración de Base de Datos**:
   Ejecuta las migraciones de Prisma para preparar la base de datos local:
   ```bash
   npx prisma migrate dev --name init
   ```
4. **Ejecución**:
   Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abre **http://localhost:3000** en tu navegador.

## 📁 Estructura del Proyecto

- `src/app/`: Rutas y páginas de la aplicación.
- `src/components/`: Componentes de UI reutilizables.
- `src/lib/`: Utilidades y acciones del servidor.
- `prisma/`: Esquema de la base de datos y migraciones.

---
Desarrollado con pasión para una productividad sin distracciones. 🚀
