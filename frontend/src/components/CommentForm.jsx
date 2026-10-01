import { useEffect, useState } from "react";

export default function CommentForm({ onSubmit, busy, isAdmin, adminName }) {
  const [nombre, setNombre] = useState("");
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (isAdmin && !nombre) setNombre(adminName || "Administrador");
  }, [isAdmin, adminName, nombre]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (await onSubmit({ nombre, texto })) {
      setTexto("");
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <input aria-label="Tu nombre" placeholder="Tu nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} minLength="2" maxLength="40" required />
      <div className="comment-row">
        <input aria-label="Comentario" placeholder="Escribe una respuesta…" value={texto} onChange={(event) => setTexto(event.target.value)} maxLength="300" required />
        <button className="button compact" disabled={busy}>Enviar</button>
      </div>
    </form>
  );
}
