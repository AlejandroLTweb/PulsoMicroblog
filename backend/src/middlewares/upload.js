import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDirectory = path.resolve(currentDirectory, "../../uploads");
mkdirSync(uploadsDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadsDirectory,
  filename(request, file, callback) {
    void request;
    // Conservamos la extensión para que el navegador reconozca GIF, WebP,
    // AVIF y otros formatos, pero nunca reutilizamos el nombre del usuario.
    const extension = path.extname(file.originalname)
      .toLowerCase()
      .replace(/[^.a-z0-9]/g, "")
      .slice(0, 12) || ".img";
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024, files: 1 },
  fileFilter(request, file, callback) {
    void request;
    if (file.mimetype.startsWith("image/")) return callback(null, true);
    callback(Object.assign(new Error("El archivo debe ser una imagen"), { status: 400 }));
  },
});
