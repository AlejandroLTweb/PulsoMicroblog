import { useRef, useState } from "react";

export default function PostComposer({ onCreate, busy }) {
  const [contenido, setContenido] = useState("");
  const [privado, setPrivado] = useState(false);
  const imageInput = useRef(null);
  const remaining = 500 - contenido.length;

  async function handleSubmit(event) {
    event.preventDefault();
    const imagen = imageInput.current?.files?.[0] || null;
    if (await onCreate(contenido, imagen, privado)) {
      setContenido("");
      setPrivado(false);
      if (imageInput.current) imageInput.current.value = "";
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <div className="avatar admin-avatar">A</div>
      <div className="composer-body">
        <label htmlFor="new-post">Nueva publicación</label>
        <textarea
          id="new-post"
          placeholder="¿Qué quieres compartir?"
          value={contenido}
          onChange={(event) => setContenido(event.target.value)}
          maxLength="500"
          required
        />
        <label className="image-picker">
          Imagen o GIF
          <input ref={imageInput} type="file" accept="image/*" />
          <small>Cualquier formato de imagen reconocido por el navegador, máximo 15 MB.</small>
        </label>
        <label className="private-toggle">
          <input type="checkbox" checked={privado} onChange={(event) => setPrivado(event.target.checked)} />
          Publicación privada - solo visible al administrador
        </label>
        <div className="composer-footer">
          <span className={remaining < 50 ? "counter warning" : "counter"}>{remaining}</span>
          <button className="button primary" disabled={busy || !contenido.trim()}>{busy ? "Publicando…" : "Publicar"}</button>
        </div>
      </div>
    </form>
  );
}
