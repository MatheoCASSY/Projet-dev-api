import GameCard from './GameCard';

export default function GamesGrid({ games }) {
  if (!games || games.length === 0) {
    return <p className="text-center text-muted">Aucun jeu trouvé.</p>;
  }

  const hero = games[0];
  const rest = games.slice(1);

  return (
    <div>
      {/* Featured hero */}
      {hero && (
        <div className="mb-4">
          <div className="card bg-dark text-white border-0 overflow-hidden">
            <img
              src={hero.background_image || '/logo192.png'}
              className="card-img"
              alt={hero.name}
              style={{ height: 320, objectFit: 'cover', filter: 'brightness(0.6)' }}
            />
            <div className="card-img-overlay d-flex flex-column justify-content-end">
              <h3 className="card-title display-6">{hero.name}</h3>
              <p className="card-text text-light small mb-2">{(hero.platforms || []).map(p => p.platform?.name).filter(Boolean).slice(0,3).join(' • ')}</p>
              <div>
                <button className="btn btn-primary me-2">Voir le jeu</button>
   
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="h4 mb-0">Tendances</h3>
      </div>

      <div className="row g-3">
        {rest.map((g) => (
          <div key={g.id} className="col-6 col-md-4 col-lg-3">
            <GameCard game={g} />
          </div>
        ))}
      </div>
    </div>
  );
}
