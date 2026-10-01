import { ObjectId } from "mongodb";
import { getDatabase } from "../config/db.js";

const posts = () => getDatabase().collection("publicaciones");

function publicPost(document) {
  if (!document) return null;
  return {
    id: document._id.toString(),
    contenido: document.contenido,
    autor: document.autor,
    imagenUrl: document.imagenUrl || null,
    privado: Boolean(document.privado),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    likes: document.reactions?.likes?.length || 0,
    dislikes: document.reactions?.dislikes?.length || 0,
    comments: (document.comments || []).map((comment) => ({
      id: comment._id.toString(),
      nombre: comment.nombre,
      texto: comment.texto,
      createdAt: comment.createdAt,
      autorAdmin: Boolean(comment.autorAdmin),
    })),
  };
}

export async function listPosts({ includePrivate = false } = {}) {
  // La privacidad se aplica en la consulta. Así una publicación privada ni
  // siquiera sale de MongoDB cuando quien consulta es un visitante.
  const filter = includePrivate ? {} : { privado: { $ne: true } };
  const documents = await posts().find(filter).sort({ createdAt: -1 }).toArray();
  return documents.map(publicPost);
}

export function findPostDocument(id) {
  return posts().findOne({ _id: new ObjectId(id) });
}

export function findPostByImageUrl(imagenUrl) {
  return posts().findOne({ imagenUrl });
}

export async function createPost({ contenido, adminId, autor, imagenUrl = null, privado = false }) {
  const now = new Date();
  const document = {
    contenido,
    adminId: new ObjectId(adminId),
    autor,
    imagenUrl,
    privado,
    createdAt: now,
    updatedAt: now,
    reactions: { likes: [], dislikes: [] },
    comments: [],
  };
  const result = await posts().insertOne(document);
  return publicPost({ ...document, _id: result.insertedId });
}

export async function updatePost(id, changes) {
  const result = await posts().updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...changes, updatedAt: new Date() } },
  );
  if (result.matchedCount === 0) return null;
  return publicPost(await posts().findOne({ _id: new ObjectId(id) }));
}

export async function deletePost(id) {
  return posts().deleteOne({ _id: new ObjectId(id) });
}

export async function addComment(id, { nombre, texto, autorAdmin = false }, { includePrivate = false } = {}) {
  const comment = {
    _id: new ObjectId(),
    nombre,
    texto,
    autorAdmin,
    createdAt: new Date(),
  };
  const accessFilter = includePrivate
    ? { _id: new ObjectId(id) }
    : { _id: new ObjectId(id), privado: { $ne: true } };
  const result = await posts().updateOne(
    accessFilter,
    { $push: { comments: comment } },
  );
  if (result.matchedCount === 0) return null;
  return publicPost(await posts().findOne(accessFilter));
}

export async function deleteComment(postId, commentId) {
  const result = await posts().updateOne(
    { _id: new ObjectId(postId) },
    { $pull: { comments: { _id: new ObjectId(commentId) } }, $set: { updatedAt: new Date() } },
  );
  if (result.matchedCount === 0) return null;
  return publicPost(await posts().findOne({ _id: new ObjectId(postId) }));
}

export async function toggleReaction(id, { tipo, visitorId }, { includePrivate = false } = {}) {
  const selected = tipo === "like" ? "likes" : "dislikes";
  const opposite = tipo === "like" ? "dislikes" : "likes";
  const accessFilter = includePrivate
    ? { _id: new ObjectId(id) }
    : { _id: new ObjectId(id), privado: { $ne: true } };
  const current = await posts().findOne(accessFilter);
  if (!current) return null;

  const alreadySelected = current.reactions?.[selected]?.includes(visitorId);
  // No modificamos el mismo campo con dos operadores en una sola actualización,
  // porque MongoDB lo considera un conflicto. Cada rama toca rutas distintas.
  const update = alreadySelected
    ? { $pull: { [`reactions.${selected}`]: visitorId }, $set: { updatedAt: new Date() } }
    : {
        $pull: { [`reactions.${opposite}`]: visitorId },
        $addToSet: { [`reactions.${selected}`]: visitorId },
        $set: { updatedAt: new Date() },
      };

  await posts().updateOne(accessFilter, update);
  return publicPost(await posts().findOne(accessFilter));
}
