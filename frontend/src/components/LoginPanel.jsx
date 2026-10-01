import { useState } from "react";

export default function LoginPanel({ onLogin, busy }) {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const ok = await onLogin({ usuario, password });
    if (ok) {
      setPassword("");
      setOpen(false);
    }
  }

  if (!open) {
    return <button className="admin-link" onClick={() => setOpen(true)}>Acceso de administración</button>;
  }

  return (
    <form className="login-panel" onSubmit={handleSubmit}>
      <div>
        <p className="eyebrow">ZONA PRIVADA</p>
        <h2>Entrar para publicar</h2>
      </div>
      <label>
        Usuario
        <input value={usuario} onChange={(event) => setUsuario(event.target.value)} autoComplete="username" required />
      </label>
      <label>
        Contraseña
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
      </label>
      <button className="button primary" disabled={busy}>{busy ? "Comprobando…" : "Entrar"}</button>
      <button type="button" className="button ghost" onClick={() => setOpen(false)}>Cancelar</button>
    </form>
  );
}
