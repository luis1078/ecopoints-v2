# EcoPoints v2

Plataforma de gamificación de reciclaje: los usuarios completan misiones, validan
códigos para sumar puntos y los canjean por recompensas.

Este proyecto es una reescritura completa de [EcoPoints v1](https://github.com/luis1078/EcoPoints) —
originalmente un frontend Angular + Bootstrap con backend propio — que preferí
actualizar en vez de seguir iterando sobre el repo anterior. Se mantiene la
identidad visual (paleta verde, tipografías, layout general) pero con una base
técnica nueva: backend en .NET y frontend en Next.js, separados y comunicándose
por API REST.

## Stack

**Backend** (`backend/EcoPoints.Api`)
- .NET 9 (Minimal APIs, organizadas por *vertical slices* en `Features/`)
- Entity Framework Core 9 + Npgsql (PostgreSQL)
- Autenticación con JWT (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- FluentValidation, BCrypt.Net para hashing de contraseñas

**Frontend** (`frontend`)
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4 (paleta y modo oscuro personalizados)
- TanStack React Query para estado de servidor

## Estructura del proyecto

```
Ecopoints-v2/
├─ backend/
│  └─ EcoPoints.Api/
│     ├─ Auth/            # Generación de JWT
│     ├─ Data/            # DbContext + datos de siembra (SeedData)
│     ├─ Domain/          # Entidades (Usuario, Mision, Recompensa, Canje, ...)
│     ├─ Features/        # Un endpoint por carpeta: Auth, Misiones, Codigos,
│     │                   # Recompensas, Canjes, Usuarios
│     ├─ Migrations/      # Migraciones de EF Core
│     └─ Program.cs       # Composición de la app y registro de rutas
└─ frontend/
   ├─ app/                # Rutas (App Router): páginas públicas y protegidas
   ├─ components/         # Nav, Footer, guards de autenticación/rol, etc.
   ├─ lib/                # Cliente de API, contexto de auth, tema (dark mode)
   └─ public/img/         # Assets visuales heredados del diseño v1
```

## Requisitos previos

- .NET SDK 9
- Node.js 20+
- Docker (para levantar PostgreSQL — no se incluye ninguna base de datos en
  el repo, solo su definición como servicio)

## Base de datos

El repo incluye un `docker-compose.yml` en la raíz que levanta un PostgreSQL
16 con las credenciales que espera `appsettings.Development.json` de ejemplo
más abajo, y un volumen nombrado para que los datos persistan entre reinicios:

```bash
docker compose up -d
```

Esto crea el contenedor `ecopoints-db`, escuchando en `localhost:5432`. Para
borrar todo y empezar de cero: `docker compose down -v`.

## Puesta en marcha

### Backend

1. Configura `backend/EcoPoints.Api/appsettings.Development.json` (ignorado por
   git) con tu cadena de conexión y una clave JWT propia:

   ```json
   {
     "ConnectionStrings": {
       "Default": "Host=localhost;Port=5432;Database=ecopoints;Username=ecopoints;Password=devpassword"
     },
     "Jwt": {
       "Key": "una-clave-larga-y-aleatoria",
       "Issuer": "ecopoints-api",
       "Audience": "ecopoints-client",
       "ExpiresInMinutes": 60
     }
   }
   ```

2. Ejecuta la API — en `Development` aplica las migraciones y siembra datos
   automáticamente al iniciar:

   ```bash
   cd backend/EcoPoints.Api
   dotnet run
   ```

   Queda escuchando en `http://localhost:5142` (ver `Properties/launchSettings.json`).

### Frontend

```bash
cd frontend
cp .env.example .env.local   # ajusta NEXT_PUBLIC_API_URL si tu backend corre en otro puerto
npm install
npm run dev
```

Disponible en `http://localhost:3000`.

## Usuario de prueba

El *seed* de desarrollo (`SeedData.cs`) crea un administrador fijo la primera
vez que se levanta la base de datos:

```
admin@ecopoints.local / Admin123!
```

Se mantiene así intencionalmente: este ambiente corre sobre una base de datos
de Docker para pruebas, no una instancia productiva, así que no hace falta
rotar la credencial. Con ese usuario se accede al panel `/admin` para crear
misiones, generar códigos de validación y publicar recompensas.

## Funcionalidades principales

- **Autenticación**: registro / login con JWT (`/login`, `/registro`).
- **Inicio**: panel de bienvenida con saldo y accesos rápidos (`/inicio`).
- **Misiones**: catálogo y detalle de cada misión con validación de código
  integrada (`/misiones`, `/misiones/[id]`).
- **Validar código**: canje directo de un código ya obtenido (`/validar`).
- **Recompensas**: catálogo canjeable por puntos (`/recompensas`).
- **Mis canjes**: historial y estado de las recompensas canjeadas (`/mis-canjes`).
- **Mi cuenta**: saldo e historial de movimientos de puntos (`/mi-cuenta`).
- **Administración**: alta de misiones/recompensas y generación de códigos,
  solo para el rol `admin` (`/admin`).
- **Contacto** y **landing pública** para visitantes sin sesión (`/`, `/contacto`).
- Modo oscuro con paleta propia (no depende de grises genéricos).
