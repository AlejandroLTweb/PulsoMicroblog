# PLAN · Microblog Pulso

## Objetivo

Crear una mini aplicación full stack tipo X donde una única cuenta administradora publique y gestione entradas. Los visitantes pueden leer, reaccionar y comentar con un nombre sin registrarse.

## Alcance

- Entidad principal: `publicaciones`, con CRUD completo desde React.
- Autenticación del administrador con usuario existente, contraseña hasheada y JWT.
- Interacción pública: listado, likes, dislikes y comentarios.
- Publicaciones privadas visibles solo para el administrador, con privacidad editable, y moderación mediante borrado de comentarios.
- Imagen o GIF opcional en cada publicación.
- API Express conectada a MongoDB Atlas mediante el driver oficial.
- Pruebas unitarias, archivo HTTP y colección Postman.
- Documentación del uso crítico de IA.

## Campos principales

| Campo | Tipo | Regla |
|---|---|---|
| `contenido` | String | obligatorio, 1 a 500 caracteres |
| `adminId` | ObjectId | procede del token, nunca del body |
| `autor` | String | nombre visible del administrador |
| `reactions.likes` | String[] | identificadores locales de visitante |
| `reactions.dislikes` | String[] | excluyente respecto al like |
| `comments` | Array | nombre, texto, fecha e id |
| `privado` | Boolean | indica si la publicación solo puede verla el administrador |
| `imagenUrl` | String o null | URL local generada por Multer |
| `createdAt` / `updatedAt` | Date | asignadas por el servidor |

## Fases

1. Revisar sesiones de MongoDB, Express, JWT, React y despliegue.
2. Definir contrato REST, modelo y reglas de autorización.
3. Implementar backend por capas sin Mongoose.
4. Implementar frontend React/Vite y conectar todas las operaciones.
5. Probar validaciones, build y peticiones de integración.
6. Documentar prompts, correcciones, decisiones y reflexión.
7. Crear repositorio y desplegar con las cuentas del alumno.

## Fuera de alcance

- Registro o perfiles de visitantes.
- Subida de imágenes.
- Moderación avanzada, recuperación de contraseña o panel multiadministrador.
- Prevención fuerte de fraude en votos; el identificador local es deliberadamente ligero.
