export default function GameCard({ game }) {
  const platforms = (game.platforms || []).map(p => p.platform?.name).filter(Boolean);

  return (
    <div className="card h-100 border-0 shadow-sm game-card" style={{ overflow: 'hidden' }}>
      <div className="position-relative">
        <img
          src={game.background_image || '/logo192.png'}
          alt={game.name}
          className="card-img-top img-fluid"
          style={{ height: 180, objectFit: 'cover', width: '100%' }}
        />
        {/* badge rating */}
        <span className="badge bg-warning text-dark position-absolute" style={{ left: 12, bottom: 12 }}>
          ⭐ {game.rating || '—'}
        </span>
      </div>
      <div className="card-body p-3 d-flex flex-column">
        <h5 className="card-title mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.2' }}>{game.name}</h5>
        <p className="card-text text-muted mb-2 small">{platforms.slice(0, 3).join(' • ')}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <button className="btn btn-sm btn-outline-primary">Ajouter au panier</button>
          <small className="text-muted">{game.released || ''}</small>
        </div>
      </div>
    </div>
  );
}
