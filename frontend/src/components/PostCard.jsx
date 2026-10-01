import { useEffect, useRef, useState } from "react";
import CommentForm from "./CommentForm.jsx";
import { api } from "../services/api.js";

const formatter = new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" });

function PostImage({ imageUrl, token }) {
  const [source, setSource] = useState("");

  useEffect(() => {
    let active = true;
    let objectUrl = "";
    api.loadImage(imageUrl, token).then((blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob);
      setSource(objectUrl);
    }).catch(() => {
      if (active) setSource("");
    });
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [imageUrl, token]);

  return source
    ? <img className="post-image" src={source} alt="Imagen de la publicación" />
    : <p className="muted">Cargando imagen…</p>;
}

export default function PostCard({ post, isAdmin, adminName, adminToken, onReact, onComment, onUpdate, onDelete, onDeleteComment, busy }) {
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.contenido);
  const [privateDraft, setPrivateDraft] = useState(Boolean(post.privado));
  const [removeImage, setRemoveImage] = useState(false);
  const editImageInput = useRef(null);

  async function saveEdit() {
    const imagen = editImageInput.current?.files?.[0] || null;
    if (await onUpdate(post.id, draft, { imagen, eliminarImagen: removeImage, privado: privateDraft })) {
      setEditing(false);
      setRemoveImage(false);
    }
  }

  return (
    <article className="post-card">
      <div className="avatar">{post.autor?.slice(0, 1).toUpperCase() || "A"}</div>
      <div className="post-content">
        <div className="post-meta">
          <strong>@{post.autor}</strong>
          {post.privado && <span className="private-badge">PUBLICACIÓN PRIVADA</span>}
          <span>·</span>
          <time dateTime={post.createdAt}>{formatter.format(new Date(post.createdAt))}</time>
        </div>

        {editing ? (
          <div className="edit-area">
            <textarea value={draft} onChange={(event) => setDraft(event.target.value)} maxLength="500" />
            <label className="image-picker compact-picker">
              Sustituir imagen
              <input ref={editImageInput} type="file" accept="image/*" />
            </label>
            {post.imagenUrl && (
              <label className="private-toggle">
                <input type="checkbox" checked={removeImage} onChange={(event) => setRemoveImage(event.target.checked)} />
                Eliminar la imagen actual
              </label>
            )}
            <label className="private-toggle">
              <input type="checkbox" checked={privateDraft} onChange={(event) => setPrivateDraft(event.target.checked)} />
              Publicación privada - solo visible al administrador
            </label>
            <button className="button compact" onClick={saveEdit} disabled={busy}>Guardar</button>
            <button className="button ghost compact" onClick={() => { setDraft(post.contenido); setPrivateDraft(Boolean(post.privado)); setRemoveImage(false); setEditing(false); }}>Cancelar</button>
          </div>
        ) : <p className="post-text">{post.contenido}</p>}

        {post.imagenUrl && !editing && (
          <PostImage imageUrl={post.imagenUrl} token={adminToken} />
        )}

        <div className="post-actions">
          <button onClick={() => onReact(post.id, "like")} disabled={busy} aria-label="Me gusta">♡ <span>{post.likes}</span></button>
          <button onClick={() => onReact(post.id, "dislike")} disabled={busy} aria-label="No me gusta">↓ <span>{post.dislikes}</span></button>
          <button onClick={() => setShowComments((value) => !value)} aria-expanded={showComments}>◌ <span>{post.comments.length}</span></button>
          {isAdmin && <button onClick={() => setEditing(true)}>Editar</button>}
          {isAdmin && <button className="danger" onClick={() => onDelete(post.id)}>Borrar</button>}
        </div>

        {showComments && (
          <section className="comments" aria-label="Comentarios">
            {post.comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <div className="comment-heading">
                  <strong>{comment.nombre}</strong>
                  {comment.autorAdmin && <span className="comment-badge">ADMIN</span>}
                  {isAdmin && <button className="delete-comment" onClick={() => onDeleteComment(post.id, comment.id)} disabled={busy}>Eliminar</button>}
                </div>
                <p>{comment.texto}</p>
              </div>
            ))}
            {post.comments.length === 0 && <p className="muted">Todavía no hay respuestas.</p>}
            <CommentForm onSubmit={(data) => onComment(post.id, data)} busy={busy} isAdmin={isAdmin} adminName={adminName} />
          </section>
        )}
      </div>
    </article>
  );
}
