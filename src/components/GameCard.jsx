import { Link } from 'react-router-dom';
import useSteam from '../services/steamService';

export default function GameCard({ game }) {
  const platforms = (game.platforms || []).map(p => p.platform?.name).filter(Boolean);

  // detect steam appid from RAWG stores if present
  const steamStoreCandidate = (game.stores || []).find(
    (s) => (s.store && s.store.slug === 'steam') || (s.url && s.url.includes('store.steampowered.com'))
  );
  let steamAppId = null;
  if (steamStoreCandidate) {
    const url = steamStoreCandidate.url || steamStoreCandidate.store?.url || steamStoreCandidate.url_en || steamStoreCandidate.url_ru;
    const m = url && url.match(/\/app\/(\d+)/);
    if (m) steamAppId = m[1];
  }

  // call hook unconditionally (steamAppId may be null)
  const { store: steamData, review_summary: steamReviewSummary, retry: retrySteam, steamUrl } = useSteam(steamAppId);

  return (
    <Link to={`/game/${game.id}`} className="text-decoration-none text-reset">
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
          {/* Steam price badge */}
          {steamData && steamData.price_overview && (
            <span className="badge bg-success position-absolute" style={{ right: 12, top: 12 }}>
              {steamData.price_overview.discount_percent > 0 ? `-${steamData.price_overview.discount_percent}%` : 'Prix'}
            </span>
          )}
          {/* Steam review short */}
          {steamReviewSummary && (
            <span className="badge bg-dark text-light position-absolute" style={{ right: 12, bottom: 12 }}>
              {steamReviewSummary.review_score_desc || ''}
            </span>
          )}
        </div>
        <div className="card-body p-3 d-flex flex-column">
          <h5 className="card-title mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.2' }}>{game.name}</h5>
          <p className="card-text text-muted mb-2 small">{platforms.slice(0, 3).join(' • ')}</p>
          {steamData && steamData.price_overview && (
            <div className="mb-2">
              <span className="fw-bold">{(steamData.price_overview.final / 100).toFixed(2)} {steamData.price_overview.currency}</span>
              {steamData.price_overview.discount_percent > 0 && (
                <span className="ms-2 text-success">-{steamData.price_overview.discount_percent}%</span>
              )}
            </div>
          )}
          {!steamData && steamAppId && (
            <div className="mb-2 small text-warning d-flex flex-column">
              <div className="d-flex align-items-center gap-2 mb-1">
                <span>Données Steam indisponibles</span>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => { console.warn('Steam fetch failed for appid', steamAppId); retrySteam(); }}>Réessayer</button>
                {steamUrl && <a className="btn btn-sm btn-link" href={steamUrl} target="_blank" rel="noreferrer">Voir sur Steam</a>}
              </div>
              {/* RAWG fallback: show RAWG rating if available */}
              {game && game.rating && (
                <div className="small text-muted">Note RAWG: {game.rating} / 5</div>
              )}
              {game && (game.stores || []).length > 0 && (
                <div className="small text-muted">Disponible sur : {(game.stores || []).map(s => s.store?.name || s.url).filter(Boolean).slice(0,3).join(', ')}</div>
              )}
            </div>
          )}
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <button className="btn btn-sm btn-outline-primary">+ d'infos</button>
            <small className="text-muted">{game.released || ''}</small>
          </div>
        </div>
      </div>
    </Link>
  );
}
