import { useParams, Link } from 'react-router-dom';
import useRawgGame from '../services/rawgDetailsService';
import useSteam from '../services/steamService';

export default function GameDetail() {
  const { id } = useParams();
  const { game, screenshots, loading, error } = useRawgGame(id);
  // Try to detect Steam appid from RAWG game stores (safe before early returns)
  const steamStoreCandidate = game?.stores?.find(s => (s.store && s.store.slug === 'steam') || (s.url && s.url.includes('store.steampowered.com')));
  let steamAppId = null;
  if (steamStoreCandidate) {
    const url = steamStoreCandidate.url || steamStoreCandidate.store?.url;
    const m = url && url.match(/\/app\/(\d+)/);
    if (m) steamAppId = m[1];
  }

  // Call hook unconditionally (can accept null appid)
  const { store: steamStoreData, achievements: steamAchievements, global: steamGlobal, reviews: steamReviews, review_summary: steamReviewSummary, loading: steamLoading, error: steamError, retry: retrySteam, steamUrl } = useSteam(steamAppId);

  // Traduction supprimée — affichage original conservé

  if (loading) return <div className="container py-4">Chargement...</div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">Erreur : {String(error)}</div></div>;
  if (!game) return <div className="container py-4">Jeu introuvable.</div>;

  return (
    <div className="container py-4">
      <div className="mb-3">
        <Link to="/store" className="btn btn-link">← Retour à la boutique</Link>
      </div>

      <div className="card mb-4 bg-dark text-white border-0 overflow-hidden">
        <img src={game.background_image || '/logo192.png'} alt={game.name} className="card-img" style={{ height: 420, objectFit: 'cover', filter: 'brightness(0.5)' }} />
        <div className="card-img-overlay d-flex flex-column justify-content-end">
          <h1 className="display-5 mb-2">{game.name}</h1>
          <div className="mb-3">
            <span className="badge bg-warning text-dark me-2">⭐ {game.rating || '—'}</span>
            <span className="text-light small">{game.released}</span>
          </div>
          <div>
            <a href={game.website || '#'} className="btn btn-outline-light me-2">Site officiel</a>
            {game.stores && game.stores.length > 0 && (
              <a href={game.stores[0].url || '#'} className="btn btn-primary">Voir sur le magasin</a>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Description</h5>
              </div>

              <div className="text-muted mt-2">
                <div dangerouslySetInnerHTML={{ __html: game.description || '<p>Aucune description</p>' }} />
              </div>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <h5>Captures d'écran</h5>
              <div className="row g-2">
                {screenshots.map(s => (
                  <div key={s.id} className="col-6 col-md-4">
                    <img src={s.image} alt="screenshot" className="img-fluid rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="col-lg-4">
          <div className="card mb-3">
            <div className="card-body">
              <h6>Infos</h6>
              <ul className="list-unstyled small text-muted">
                <li><strong>Éditeur:</strong> {game.esrb_rating?.name || '—'}</li>
                <li><strong>Genres:</strong> {(game.genres || []).map(g => g.name).join(', ')}</li>
                <li><strong>Plateformes:</strong> {(game.platforms || []).map(p => p.platform?.name).slice(0,5).join(', ')}</li>
                <li><strong>Stores:</strong> {(game.stores || []).map(s => s.store?.name).join(', ') || '—'}</li>
                {steamStoreData && steamStoreData.price_overview && (
                  <li>
                    <strong>Prix:</strong> <span className="fw-bold">{(steamStoreData.price_overview.final / 100).toFixed(2)} {steamStoreData.price_overview.currency}</span>
                    {steamStoreData.price_overview.discount_percent > 0 && (
                      <span className="ms-2 text-success">-{steamStoreData.price_overview.discount_percent}%</span>
                    )}
                  </li>
                )}
                {!steamStoreData && steamAppId && (
                  <li><em>Infos Steam non disponibles (CORS ou réseau).</em></li>
                )}
              </ul>
              <div className="mt-3">
                <a href={game.website || '#'} className="btn btn-outline-light me-2">Site officiel</a>
                {((steamUrl) || (game.stores && game.stores.length > 0 && (game.stores[0].url))) && (
                  <a href={steamUrl || game.stores[0].url} className="btn btn-primary" target="_blank" rel="noreferrer">{steamUrl ? 'Voir sur Steam' : 'Voir sur le magasin'}</a>
                )}
              </div>
            </div>
          </div>

              {steamAppId && (
                <div className="card mb-3">
                  <div className="card-body">
                    <h6>Succès (Steam)</h6>
                    {steamLoading && <div className="small text-muted">Chargement des données Steam...</div>}
                    {steamError && (
                      <div>
                        <div className="small text-warning">Données Steam indisponibles (CORS ou réseau). Affichage des infos RAWG en fallback.</div>
                        <div className="mt-2 d-flex gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={() => { console.warn('Steam error:', steamError); retrySteam(); }}>Réessayer</button>
                          {steamUrl && <a className="btn btn-sm btn-link" href={steamUrl} target="_blank" rel="noreferrer">Voir sur Steam</a>}
                          {game && (game.stores && game.stores.length > 0) && (
                            <a className="btn btn-sm btn-primary" href={game.stores[0].url || '#'} target="_blank" rel="noreferrer">Voir sur le magasin</a>
                          )}
                        </div>
                        {/* RAWG fallback summary */}
                        {game && (
                          <div className="mt-2 small text-muted">
                            <div>Note RAWG : {game.rating || '—'} / 5</div>
                            <div>{(game.ratings || []).length > 0 ? `Détails des évaluations disponibles sur RAWG` : ''}</div>
                          </div>
                        )}
                      </div>
                    )}
                    {!steamLoading && !steamError && (
                      <div>
                        {steamAchievements && steamAchievements.length > 0 ? (
                          <div className="row g-2">
                            {steamAchievements.slice(0,12).map(a => {
                              const percentObj = (steamGlobal || []).find(g => g.name === a.name);
                              const percent = percentObj ? percentObj.percent : undefined;
                              return (
                                <div key={a.name} className="col-12">
                                  <div className="d-flex gap-2 align-items-start">
                                    {a.icon && (
                                      <img src={a.icon} alt={a.displayName || a.name} style={{ width: 40, height: 40, objectFit: 'cover' }} className="rounded" />
                                    )}
                                    <div>
                                      <div className="fw-semibold">{a.displayName || a.name}</div>
                                      {a.description && <div className="small text-muted">{a.description}</div>}
                                      {typeof percent !== 'undefined' && <div className="small text-muted">Débloqué par ~{percent.toFixed(1)}% des joueurs</div>}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="small text-muted">Aucun succès disponibles via l'API Steam (ou clé manquante). {steamUrl && <a href={steamUrl} target="_blank" rel="noreferrer">Voir sur Steam</a>}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

                    {steamAppId && (
                      <div className="card mb-3">
                        <div className="card-body">
                          <h6>Avis de la communauté (Steam)</h6>
                          {steamLoading && <div className="small text-muted">Chargement des avis...</div>}
                          {steamError && (
                            <div className="small text-warning d-flex flex-column">
                              <div>Données Steam indisponibles (CORS ou réseau).</div>
                              <div className="mt-2">
                                <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => { console.warn('Steam error:', steamError); retrySteam(); }}>Réessayer</button>
                                {steamUrl && <a className="btn btn-sm btn-link" href={steamUrl} target="_blank" rel="noreferrer">Voir sur Steam</a>}
                              </div>
                            </div>
                          )}
                          {!steamLoading && !steamError && (
                            <div>
                              {steamStoreData && steamStoreData.recommendations && (
                                <p className="mb-2"><strong>{steamStoreData.recommendations.total || '—'}</strong> personnes recommandent ce jeu</p>
                              )}
                              {steamReviewSummary && (
                                <p className="small text-muted mb-2">Résumé : {steamReviewSummary.review_score_desc || ''} — {steamReviewSummary.total_reviews || 0} avis</p>
                              )}
                              {Array.isArray(steamReviews) && steamReviews.length > 0 ? (
                                <ul className="list-unstyled small">
                                  {steamReviews.slice(0,3).map((r, i) => (
                                    <li key={i} className="mb-2">
                                      <div className="fw-bold">{r.author?.steamid ? r.author.steamid : (r.author?.steamid ? r.author.steamid : 'Utilisateur')}</div>
                                      <div className="text-muted">{r.voted_up ? 'Positif' : 'Négatif'} — {new Date(r.timestamp_created * 1000).toLocaleDateString()}</div>
                                      <div>{r.review?.slice(0,240) || r.text?.slice(0,240) || ''}{(r.review && r.review.length > 240) || (r.text && r.text.length > 240) ? '…' : ''}</div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <div className="small text-muted">Aucun avis disponibles via l'API publique Steam.</div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

          {/* If no Steam data found, show short hint */}
          {!steamAppId && (
            <div className="card">
              <div className="card-body">
                <h6>Succès / Achievements</h6>
                <p className="small text-muted">RAWG ne fournit pas toujours la liste des succès. Si le jeu est sur Steam, ajoutez l'URL Steam dans RAWG ou fournissez une appid pour afficher les succès via l'API Steam.</p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
