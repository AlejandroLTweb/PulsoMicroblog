import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/posts.routes.js";
import { errorHandler, notFound } from "./middlewares/errors.js";
import { optionalAdmin } from "./middlewares/auth.js";
import { getPostImage } from "./controllers/posts.controller.js";

export const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(Object.assign(new Error("Origen no permitido por CORS"), { status: 403 }));
  },
}));
app.use(express.json({ limit: "32kb" }));
// Las imágenes también respetan la privacidad de su publicación. No usamos
// express.static porque expondría el archivo si alguien conociera su URL.
app.get("/uploads/:filename", optionalAdmin, getPostImage);

app.get("/api/health", (request, response) => response.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use(notFound);
app.use(errorHandler);
