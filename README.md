# ✈️ SkyLimit

> Plataforma web de reserva de vuelos transparente y honesta

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 📋 Descripción

**SkyLimit** es una aplicación web fullstack diseñada para revolucionar la forma en que reservamos vuelos online. En un mercado donde los precios dinámicos y las cookies manipulan las tarifas, SkyLimit ofrece **transparencia total** y **precios justos** sin algoritmos ocultos.

### 🎯 El Problema

Las plataformas actuales de reserva de vuelos utilizan:
- 🔍 Seguimiento de cookies para inflar precios
- 📊 Algoritmos de precios dinámicos basados en tu comportamiento
- 💰 Tarifas que cambian según el número de visitas

**Resultado:** Los usuarios se ven obligados a usar modo incógnito para conseguir precios justos.

### ✨ La Solución

SkyLimit elimina estas prácticas ofreciendo:
- ✅ Precios reales sin manipulación
- ✅ Transparencia total en la tarificación
- ✅ Mismo precio para todos los usuarios
- ✅ Búsqueda avanzada sin penalizaciones

## 🚀 Características Principales

- **🔐 Sistema de Autenticación**: Registro e inicio de sesión seguro
- **🎫 Gestión de Reservas**: Historial completo de tus vuelos
- **🔎 Búsqueda Avanzada**: Filtros por fecha, precio, origen y destino
- **📡 Datos en Tiempo Real**: Integración con APIs de Amadeus y SkyScanner
- **💼 Interfaz Moderna**: Diseño responsive y centrado en el usuario
- **🌐 Arquitectura Escalable**: Preparada para crecer contigo

## 🛠️ Stack Tecnológico

### Frontend (detected versions)
- **React** 19.2.0 + **TypeScript** ~5.9.3 - UI reactiva y tipado seguro
- **Vite** ^7.2.4 - Bundler / dev server
- **React Router** ^7.13.0 - Navegación SPA
- **Axios** ^1.13.4 - Comunicación HTTP
- **TailwindCSS** ^4.1.18 - Utilidades CSS
- **Zustand** ^5.0.11 - Gestión de estado

### Backend (detected versions)
- **NestJS** ^11.0.1 + **TypeScript** ^5.7.3 - Arquitectura robusta y mantenible
- **Node.js** 20 (images: `node:20-alpine`) - Runtime utilizado en Dockerfiles
- **@prisma/client / prisma** 6.19.2 - ORM y cliente Prisma
- **Express.js** - Framework base (usado por NestJS)

### Base de Datos & DevTools
- **PostgreSQL** 16 (image: `postgres:16-alpine`) - Base de datos relacional
- **pgAdmin** image: `dpage/pgadmin4:latest` - Interfaz de administración
- **Docker / Docker Compose** - Contenerización (compose file in repo)

> Notas: versiones detectadas desde `backend/package.json`, `frontend/package.json`, los Dockerfiles y `docker-compose.yml`.

### DevOps
- **Docker** - Contenedorización de la aplicación
- **Docker Compose** - Orquestación de servicios

## 📁 Estructura del Proyecto

```
skylimit/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── package.json
├── backend/           # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   ├── services/
│   │   └── prisma/
│   └── package.json
├── .env.example       # Variables de entorno de ejemplo
├── docker-compose.yml
└── README.md
```

## 🚦 Comenzando

### Prerequisitos

- Node.js >= 18.x
- Docker & Docker Compose
- PostgreSQL (si no usas Docker)

### Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/skylimit.git
cd skylimit
```

2. **Configura las variables de entorno**
```bash
cp .env.example .env
```

3. **Inicia con Docker Compose**
```bash
docker-compose up -d
```

4. **O instala manualmente**
```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# Frontend
cd frontend
npm install
npm run dev
```

### Acceso a la aplicación

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000
- **Base de Datos**: localhost:5432

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Carlos Esteban Díez**

- Ciclo Formativo: Desarrollo de Aplicaciones Web
- I.E.S. Juan de la Cierva
- Curso: 2025/2026

## 🙏 Agradecimientos

- APIs de vuelos: [Amadeus](https://developers.amadeus.com/) y [SkyScanner](https://www.partners.skyscanner.net/)
- Stack tecnológico moderno que hace posible este proyecto
- Comunidad de desarrollo web por los recursos y documentación

---

<p align="center">
  Hecho con ❤️ por <a href="https://github.com/new-CarlosEst">Carlos Esteban Díez</a>
</p>

<p align="center">
  ⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! ⭐
</p>
