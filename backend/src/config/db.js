import { MongoClient } from "mongodb";

let client;
let database;

/**
 * Mantiene una sola conexión durante la vida del servidor. Abrir una conexión
 * nueva en cada endpoint sería más lento y agotaría el límite de conexiones.
 */
export async function connectDatabase() {
  if (database) return database;

  if (!process.env.MONGODB_URI) {
    throw new Error("Falta la variable de entorno MONGODB_URI");
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  database = client.db(process.env.MONGODB_DB || "microblog_pec5");

  await database.collection("usuarios").createIndex({ usuario: 1 }, { unique: true });
  await database.collection("publicaciones").createIndex({ createdAt: -1 });

  return database;
}

export function getDatabase() {
  if (!database) throw new Error("La base de datos todavía no está conectada");
  return database;
}

export async function closeDatabase() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
}
