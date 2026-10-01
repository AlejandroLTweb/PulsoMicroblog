import { promises as fs } from "node:fs";
import path from "node:path";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  findPostByImageUrl,
  findPostDocument,
  listPosts,
  toggleReaction,
  updatePost,
} from "../models/post.model.js";
import { uploadsDirectory } from "../middlewares/upload.js";
import {
  isValidObjectId,
  validateComment,
  validatePost,
  validateReaction,
} from "../utils/validation.js";

export async function getPosts(request, response, next) {
  try {
    response.json(await listPosts({ includePrivate: Boolean(request.admin) }));
  } catch (error) {
    next(error);
  }
}

export async function postPost(request, response, next) {
  try {
    const data = validatePost(request.body);
    if (data.error) {
      await removeImageFile(request.file && `/uploads/${request.file.filename}`);
      return response.status(400).json({ error: data.error });
    }
    const post = await createPost({
      ...data,
      adminId: request.admin.id,
      autor: request.admin.usuario,
      imagenUrl: request.file ? `/uploads/${request.file.filename}` : null,
    });
    response.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export async function patchPost(request, response, next) {
  try {
    if (!isValidObjectId(request.params.id)) {
      await removeImageFile(request.file && `/uploads/${request.file.filename}`);
      return response.status(404).json({ error: "Publicación no encontrada" });
    }
    const data = validatePost(request.body);
    if (data.error) {
      await removeImageFile(request.file && `/uploads/${request.file.filename}`);
      return response.status(400).json({ error: data.error });
    }

    const previous = await findPostDocument(request.params.id);
    if (!previous) {
      await removeImageFile(request.file && `/uploads/${request.file.filename}`);
      return response.status(404).json({ error: "Publicación no encontrada" });
    }

    // La privacidad puede cambiarse tantas veces como sea necesario al editar.
    const changes = { contenido: data.contenido, privado: data.privado };
    let removePreviousImage = false;
    if (request.file) {
      changes.imagenUrl = `/uploads/${request.file.filename}`;
      removePreviousImage = true;
    } else if (request.body?.eliminarImagen === "true") {
      changes.imagenUrl = null;
      removePreviousImage = true;
    }

    const post = await updatePost(request.params.id, changes);
    if (!post) return response.status(404).json({ error: "Publicación no encontrada" });
    if (removePreviousImage) await removeImageFile(previous.imagenUrl);
    response.json(post);
  } catch (error) {
    next(error);
  }
}

export async function removePost(request, response, next) {
  try {
    if (!isValidObjectId(request.params.id)) return response.status(404).json({ error: "Publicación no encontrada" });
    const previous = await findPostDocument(request.params.id);
    const result = await deletePost(request.params.id);
    if (result.deletedCount === 0) return response.status(404).json({ error: "Publicación no encontrada" });
    await removeImageFile(previous?.imagenUrl);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

export async function postComment(request, response, next) {
  try {
    if (!isValidObjectId(request.params.id)) return response.status(404).json({ error: "Publicación no encontrada" });
    const data = validateComment(request.body);
    if (data.error) return response.status(400).json({ error: data.error });
    const isAdmin = Boolean(request.admin);
    const post = await addComment(
      request.params.id,
      {
        ...data,
        autorAdmin: isAdmin,
      },
      { includePrivate: isAdmin },
    );
    if (!post) return response.status(404).json({ error: "Publicación no encontrada" });
    response.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export async function removeComment(request, response, next) {
  try {
    if (!isValidObjectId(request.params.id) || !isValidObjectId(request.params.commentId)) {
      return response.status(404).json({ error: "Comentario no encontrado" });
    }
    const post = await deleteComment(request.params.id, request.params.commentId);
    if (!post) return response.status(404).json({ error: "Publicación no encontrada" });
    response.json(post);
  } catch (error) {
    next(error);
  }
}

async function removeImageFile(imageUrl) {
  if (!imageUrl) return;
  const filename = path.basename(imageUrl);
  const target = path.resolve(uploadsDirectory, filename);
  if (path.dirname(target) !== uploadsDirectory) return;
  try {
    await fs.unlink(target);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

export async function postReaction(request, response, next) {
  try {
    if (!isValidObjectId(request.params.id)) return response.status(404).json({ error: "Publicación no encontrada" });
    const data = validateReaction(request.body);
    if (data.error) return response.status(400).json({ error: data.error });
    const post = await toggleReaction(request.params.id, data, { includePrivate: Boolean(request.admin) });
    if (!post) return response.status(404).json({ error: "Publicación no encontrada" });
    response.json(post);
  } catch (error) {
    next(error);
  }
}

export async function getPostImage(request, response, next) {
  try {
    const filename = path.basename(request.params.filename);
    if (filename !== request.params.filename) {
      return response.status(404).json({ error: "Imagen no encontrada" });
    }
    const imagenUrl = `/uploads/${filename}`;
    const post = await findPostByImageUrl(imagenUrl);
    if (!post || (post.privado && !request.admin)) {
      return response.status(404).json({ error: "Imagen no encontrada" });
    }
    response.sendFile(path.resolve(uploadsDirectory, filename));
  } catch (error) {
    next(error);
  }
}
