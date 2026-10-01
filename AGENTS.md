# AGENTS · Instrucciones para herramientas de IA

## Proyecto

Microblog full stack llamado Pulso. Solo el administrador autenticado puede crear, editar y borrar publicaciones. Los visitantes leen, reaccionan y comentan sin registro.

## Stack obligatorio

- Backend: Node.js, Express y driver oficial `mongodb`. No usar Mongoose.
- Autenticación: JWT y hash bcrypt compatible.
- Frontend: React con Vite y CSS propio.
- Base de datos: MongoDB Atlas, colecciones `usuarios` y `publicaciones`.

## Convenciones y reglas

- JavaScript ES modules; nombres de variables y funciones en `camelCase`.
- Respuestas de API en JSON salvo `204 No Content`.
- Secretos solo en archivos `.env` locales; no subirlos ni publicar archivos de ejemplo con esa extensión.
- El autor de una publicación siempre se obtiene del token, nunca del body.
- No crear endpoint de registro público.
- Las publicaciones privadas deben filtrarse en el backend; nunca basta con ocultarlas en React.
- Solo el administrador puede crear o cambiar publicaciones privadas y eliminar comentarios.
- Todos los comentarios son públicos; la privacidad pertenece a la publicación completa.
- Las imágenes se reciben con Multer, se renombran y deben limitarse a un archivo `image/*` de 15 MB.
- Validar identificadores, texto, longitudes y tipo de reacción en el backend.
- Añadir comentarios de código solo para decisiones no evidentes.
- Mantener componentes pequeños y peticiones HTTP centralizadas en `services/api.js`.
- No añadir endpoints o campos fuera de `PLAN.md` sin actualizar antes el plan.

## Comandos de comprobación

```bash
npm run install:all
npm test --prefix backend
npm run build --prefix frontend
```
