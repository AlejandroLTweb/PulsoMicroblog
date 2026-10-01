import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import LoginPanel from "./components/LoginPanel.jsx";
import PostComposer from "./components/PostComposer.jsx";
import PostCard from "./components/PostCard.jsx";
import { api } from "./services/api.js";

function getVisitorId() {
  const stored = localStorage.getItem("microblogVisitorId");
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem("microblogVisitorId", id);
  return id;
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const visitorId = useMemo(getVisitorId, []);

  function loadPosts(token) {
    return api.listPosts(token)
      .then(setPosts)
      .catch((error) => setMessage(error.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function replacePost(updated) {
    setPosts((current) => current.map((post) => post.id === updated.id ? updated : post));
  }

  async function run(action) {
    setBusy(true);
    setMessage("");
    try {
      return await action();
    } catch (error) {
      setMessage(error.message);
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function login(credentials) {
    const result = await run(() => api.login(credentials));
    if (result) {
      setSession(result);
      const adminPosts = await run(() => api.listPosts(result.token));
      if (adminPosts) setPosts(adminPosts);
    }
    return Boolean(result);
  }

  async function create(contenido, imagen, privado) {
    const created = await run(() => api.createPost(contenido, imagen, privado, session.token));
    if (created) setPosts((current) => [created, ...current]);
    return Boolean(created);
  }

  async function update(id, contenido, imageChanges) {
    const updated = await run(() => api.updatePost(id, contenido, imageChanges, session.token));
    if (updated) replacePost(updated);
    return Boolean(updated);
  }

  async function remove(id) {
    if (!window.confirm("¿Borrar esta publicación y todos sus comentarios?")) return;
    const result = await run(async () => {
      await api.deletePost(id, session.token);
      return true;
    });
    if (result) setPosts((current) => current.filter((post) => post.id !== id));
  }

  async function comment(id, data) {
    const updated = await run(() => api.comment(id, data, session?.token));
    if (updated) replacePost(updated);
    return Boolean(updated);
  }

  async function deleteComment(postId, commentId) {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    const updated = await run(() => api.deleteComment(postId, commentId, session.token));
    if (updated) replacePost(updated);
  }

  async function logout() {
    setSession(null);
    const publicPosts = await run(() => api.listPosts());
    if (publicPosts) setPosts(publicPosts);
  }

  async function react(id, tipo) {
    const updated = await run(() => api.react(id, { tipo, visitorId }, session?.token));
    if (updated) replacePost(updated);
  }

  return (
    <div className="app-shell">
      <Header admin={session?.usuario} onLogout={logout} />
      <main>
        <section className="hero">
          <p className="eyebrow">IDEAS Y PEQUEÑOS DESCUBRIMIENTOS</p>
          <h2>Notas espontáneas<br /><em>en progreso.</em></h2>
          <p>Un espacio breve para compartir avances. Puedes leer, reaccionar y responder sin crear una cuenta.</p>
        </section>

        {message && <div className="notice" role="alert">{message}</div>}
        {session ? <PostComposer onCreate={create} busy={busy} /> : <LoginPanel onLogin={login} busy={busy} />}

        <section className="feed" aria-label="Publicaciones">
          <div className="feed-heading"><span>ÚLTIMAS PUBLICACIONES</span><span>{posts.length} EN TOTAL</span></div>
          {loading && <p className="status">Cargando publicaciones…</p>}
          {!loading && posts.length === 0 && <p className="status">Aún no hay publicaciones. El administrador estrenará el muro pronto.</p>}
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              isAdmin={Boolean(session)}
              adminName={session?.usuario}
              adminToken={session?.token}
              onReact={react}
              onComment={comment}
              onUpdate={update}
              onDelete={remove}
              onDeleteComment={deleteComment}
              busy={busy}
            />
          ))}
        </section>
      </main>
      <footer>PEC 5 · Desarrollo Web Full Stack · React + Express + MongoDB</footer>
    </div>
  );
}
