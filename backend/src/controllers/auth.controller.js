import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUserByName } from "../models/user.model.js";
import { cleanText } from "../utils/validation.js";

export async function login(request, response, next) {
  try {
    const usuario = cleanText(request.body?.usuario);
    const password = typeof request.body?.password === "string" ? request.body.password : "";
    if (!usuario || !password) {
      return response.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    const admin = await findUserByName(usuario);
    const valid = admin?.rol === "admin" && (await bcrypt.compare(password, admin.password));
    if (!valid) return response.status(401).json({ error: "Credenciales incorrectas" });

    const token = jwt.sign({ sub: admin._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    response.json({ token, usuario: admin.usuario });
  } catch (error) {
    next(error);
  }
}

export function currentAdmin(request, response) {
  response.json({ usuario: request.admin.usuario });
}
