import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDatabase, closeDatabase } from "../src/config/db.js";

const usuario = process.env.ADMIN_USERNAME?.trim();
const password = process.env.ADMIN_PASSWORD;

if (!usuario || !password || password.length < 8) {
  console.error("Define ADMIN_USERNAME y ADMIN_PASSWORD (mínimo 8 caracteres) en backend/.env");
  process.exit(1);
}

try {
  const db = await connectDatabase();
  const hash = await bcrypt.hash(password, 12);
  await db.collection("usuarios").updateOne(
    { usuario },
    { $set: { usuario, password: hash, rol: "admin", updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );
  console.log(`Administrador '${usuario}' preparado en MongoDB`);
} finally {
  await closeDatabase();
}
