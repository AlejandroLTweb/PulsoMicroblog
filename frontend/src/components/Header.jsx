export default function Header({ admin, onLogout }) {
  return (
    <header className="site-header">
      <div className="brand-mark" aria-hidden="true">P</div>
      <div>
        <p className="eyebrow">MICROBLOG INDEPENDIENTE</p>
        <h1>Pulso</h1>
      </div>
      <div className="header-actions">
        <span className="live-dot"><i /> En abierto</span>
        {admin && <button className="button ghost" onClick={onLogout}>Salir · @{admin}</button>}
      </div>
    </header>
  );
}
