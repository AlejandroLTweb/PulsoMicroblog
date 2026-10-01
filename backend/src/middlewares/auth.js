import jwt from "jsonwebtoken";
import { findAdminById } from "../models/user.model.js";

async function resolveAdmin(request) {
  const [scheme, token] = (request.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) return null;

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await findAdminById(payload.sub);
  if (!admin) throw Object.assign(new Error("Administrador no válido"), { status: 401 });
  return { id: admin._id.toString(), usuario: admin.usuario };
}

export async function requireAdmin(request, response, next) {
  try {
    request.admin = await resolveAdmin(request);
    if (!request.admin) {
      return response.status(401).json({ error: "Debes iniciar sesión como administrador" });
    }
    next();
  } catch (error) {
    next(Object.assign(new Error("Sesión no válida o caducada"), { status: 401 }));
  }
}

/**
 * Permite acciones públicas sin cuenta, pero reconoce al administrador cuando
 * envía un token. Así la misma ruta puede incluir publicaciones privadas.
 */
export async function optionalAdmin(request, response, next) {
  void response;
  try {
    request.admin = await resolveAdmin(request);
    next();
  } catch (error) {
    next(Object.assign(new Error("Sesión no válida o caducada"), { status: 401 }));
  }
}
