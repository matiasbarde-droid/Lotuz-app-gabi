# Lotuz Entrega 2 (estructura ordenada)

Este repositorio se organiza en dos carpetas para evitar desorden:

- `Lotuz Entrega 2/` — Entrega actual (frontend React + backend Spring Boot)
  - Frontend: `index.html`, `src/`, `public/`, `package.json`, `vite.config.js`
  - Backend: `proyecto_Lotuz/` (Maven + Spring Boot)
- `Lotuz Entrega 1/` — Contenido previo (sitio estático y materiales)
  - Sitio legacy: `Lotuz/`
  - Materiales: diagramas PNG, documento ERS

## Requisitos
- Node.js 18+ y npm
- Java 17+ (JDK)
- Maven Wrapper (`mvnw.cmd`)

## Ejecutar Frontend (Entrega 2)
```bash
cd "Lotuz Entrega 2"
npm install
npm run dev
```
- Dev server: `http://localhost:5173` (o el puerto que asigne Vite)

## Ejecutar Backend (Entrega 2)
```bash
cd "Lotuz Entrega 2/proyecto_Lotuz"
./mvnw.cmd spring-boot:run -DskipTests
```
- API base: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`
- OpenAPI: `http://localhost:8080/openapi.json`

## Notas
- Se usa `springdoc-openapi-starter-webmvc-ui` para servir Swagger UI.
- Si aparece un warning de validación (Jakarta Bean Validation), agregar `hibernate-validator` en `pom.xml`.