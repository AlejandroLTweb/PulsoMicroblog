import { ObjectId } from "mongodb";

export function isValidObjectId(id) {
  return typeof id === "string" && /^[0-9a-f]{24}$/i.test(id) && ObjectId.isValid(id);
}

export function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

export function validatePost(body) {
  const contenido = cleanText(body?.contenido);
  if (!contenido || contenido.length > 500) {
    return { error: "La publicación debe tener entre 1 y 500 caracteres" };
  }
  return {
    contenido,
    privado: body?.privado === true || body?.privado === "true",
  };
}

export function validateComment(body) {
  const nombre = cleanText(body?.nombre);
  const texto = cleanText(body?.texto);

  if (nombre.length < 2 || nombre.length > 40) {
    return { error: "El nombre debe tener entre 2 y 40 caracteres" };
  }
  if (!texto || texto.length > 300) {
    return { error: "El comentario debe tener entre 1 y 300 caracteres" };
  }
  return { nombre, texto };
}

export function validateReaction(body) {
  const tipo = body?.tipo;
  const visitorId = cleanText(body?.visitorId);

  if (!["like", "dislike"].includes(tipo)) {
    return { error: "La reacción debe ser like o dislike" };
  }
  if (!/^[a-zA-Z0-9-]{12,80}$/.test(visitorId)) {
    return { error: "Identificador de visitante no válido" };
  }
  return { tipo, visitorId };
}
