# SKILLS · Prompts y técnicas usadas con IA

## Prompts principales

### Contexto del curso

> Revisa los resúmenes del curso y adapta la solución a lo realmente trabajado: driver oficial de MongoDB, Express, JWT, bcrypt, React, fetch y Vite. No uses Mongoose.

### Arquitectura

> Diseña un microblog con CRUD completo de publicaciones. Solo un administrador existente en la base puede publicar; los visitantes sin registro pueden reaccionar y comentar indicando un nombre. Separa rutas, controladores, acceso a datos, middlewares y componentes.

### Seguridad

> Revisa que el cliente no pueda elegir el autor ni ejecutar crear, editar o borrar sin un JWT válido. Explica los límites de un identificador anónimo para reacciones.

### Revisión de MongoDB

> Comprueba las operaciones de actualización de arrays con el driver oficial y detecta conflictos entre operadores de MongoDB.

### Frontend

> Crea una interfaz React/Vite responsive con publicaciones en cascada, formularios controlados, estados de carga/error y actualización local solo después de una respuesta correcta de la API.

### Privacidad, moderación e imágenes

> Permite al administrador decidir si cada publicación es pública o privada y cambiarlo más tarde. Filtra las publicaciones privadas y sus imágenes en el servidor. Mantén los comentarios públicos, permite moderarlos y añade imágenes/GIF con Multer, FormData y nombres de archivo seguros.

### Verificación y documentación

> Añade pruebas unitarias para las validaciones, construye el frontend en producción y documenta instalación, estructura, decisiones, errores corregidos y reflexión crítica.

## Técnicas reutilizables

- Dar restricciones negativas explícitas: “sin Mongoose” y “sin registro público”.
- Pedir primero el contrato y el modelo; después generar cada capa.
- Probar funciones puras sin depender de MongoDB.
- Revisar el código por flujo: navegador → API → validación → MongoDB → respuesta → estado React.
- Convertir los errores encontrados en documentación de aprendizaje, no ocultarlos.

## Qué decide el alumno

La idea, alcance, rol único, experiencia anónima, campos finales, estilo visual, proveedor de despliegue y credenciales. La IA propone y acelera, pero el alumno debe ejecutar, probar, comprender y poder explicar cada bloque.
