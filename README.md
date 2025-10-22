# Lotuz Entrega 2

Backend y frontend de Lotuz integrados en un único repositorio para la entrega 2.

## Estructura

- `proyecto_Lotuz/` — Backend Spring Boot (Maven)
- `src/`, `package.json` — Frontend Vite + React
- `src/main/resources/static/openapi.json` — Especificación OpenAPI para Swagger UI

## Requisitos

- Node.js 18+ y npm
- Java 17+ (JDK)
- Maven Wrapper incluido (`mvnw.cmd`)

## Ejecutar Frontend

```bash
npm install
npm run dev
```

- Dev server: `http://localhost:5173` (puede variar según Vite)

## Ejecutar Backend

```bash
./mvnw.cmd spring-boot:run -DskipTests
```

- API base: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI: `http://localhost:8080/openapi.json`

## Endpoints Documentados

- Autenticación: `POST /api/auth/register`, `POST /api/auth/login`
- Productos: `GET /api/productos`, `GET /api/productos/{sku}`
- Checkout: `POST /api/checkout`

## Notas

- Se usa `springdoc-openapi-starter-webmvc-ui` para servir Swagger UI.
- Si aparece un warning de validación (Jakarta Bean Validation), agregar `hibernate-validator` en `pom.xml`.

## Licencia

Uso académico/educativo para la entrega; sin licencia explícita.