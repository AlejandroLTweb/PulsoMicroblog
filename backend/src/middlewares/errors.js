export function notFound(request, response) {
  response.status(404).json({ error: "Endpoint no encontrado" });
}

// Los cuatro parámetros son necesarios para que Express reconozca este middleware.
export function errorHandler(error, request, response, next) {
  void request;
  void next;
  console.error(error);
  const multerStatus = error.name === "MulterError" ? 400 : null;
  const status = error.status || multerStatus || 500;
  response.status(status).json({
    error: status < 500 ? error.message : "Error interno del servidor",
  });
}
