import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";

// Este archivo no es un esquema de Mongoose: usa directamente el driver oficial.
export function findUserByName(usuario) {
  return getDatabase().collection("usuarios").findOne({ usuario });
}

export function findAdminById(id) {
  return getDatabase().collection("usuarios").findOne({
    _id: new ObjectId(id),
    rol: "admin",
  });
}
