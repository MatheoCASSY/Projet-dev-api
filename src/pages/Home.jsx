import { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useRawg from '../services/rawgService';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import GamesGrid from '../components/GamesGrid';
import GameCard from '../components/GameCard';
import PageContainer from '../components/PageContainer';

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [input, setInput] = useState('');

  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const urlSearch = params.get('search') || '';
  const urlGenre = params.get('genre') || '';
  const urlPage = Number(params.get('page') || 1);

  useEffect(() => { setInput(urlSearch); }, [urlSearch]);

  const opts = useMemo(() => ({ search: urlSearch, genre: urlGenre || '', page: urlPage }), [urlSearch, urlGenre, urlPage]);
  const { games, loading, error } = useRawg(opts);

  const categories = (() => {
    const items = (games || []).flatMap(g => (g.genres || []).map(ge => ({ name: ge.name, slug: ge.slug })));
    const map = new Map();
    for (const it of items) {
      if (!map.has(it.slug)) map.set(it.slug, it);
    }
    return Array.from(map.values()).slice(0, 12);
  })();

  const onSearch = (e) => {
    e?.preventDefault();
    const p = new URLSearchParams();
    if (input) p.set('search', input);
    if (urlGenre) p.set('genre', urlGenre);
    if (p.has('search')) p.delete('page');
    navigate(`${location.pathname}${p.toString() ? `?${p.toString()}` : ''}`);
  };

  const filteredGames = games || [];

  const onCategoryClick = (c) => {
    const p = new URLSearchParams();
    if (c) p.set('genre', c);
    if (urlSearch) p.set('search', urlSearch);
    if (p.has('genre')) p.delete('page');
    navigate(`${location.pathname}${p.toString() ? `?${p.toString()}` : ''}`);
  };

  const handleBackReset = () => {
    navigate(location.pathname);
  };

  return (
  <PageContainer showBack={Boolean(urlSearch || urlGenre)} onBack={handleBackReset}>
      {/* Header : barre de recherche */}
      <header className="d-flex align-items-center justify-content-between mb-4 gap-3">
        <h1 className="h4 mb-0">JeuScope</h1>
        <div className="flex-grow-1 ms-3">
            <form onSubmit={onSearch} className="input-group">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              className="form-control"
              placeholder="Rechercher un jeu..."
            />
            <button type="submit" className="btn btn-primary">Rechercher</button>
          </form>
        </div>
      </header>

      {/* Gestion de l’état */}
      {loading && <div className="text-center text-muted my-4">Chargement...</div>}
      {error && <div className="alert alert-danger my-4">Erreur : {String(error)}</div>}

      {/* Si une recherche ou un filtre actif → vue “store” */}
  {(urlSearch || urlGenre) ? (
        <>
          <h2 className="display-6 mb-4">Bibliothèque</h2>
          {(urlSearch || urlGenre) && (
            <p className="small text-muted">
              {urlSearch && <>Résultats pour : <strong>{urlSearch}</strong> </>}
              {urlGenre && <> | Catégorie : <strong>{urlGenre}</strong></>}
            </p>
          )}
          {!loading && !error && (
            <>
              <GamesGrid games={filteredGames} />
              <div className="text-center my-4">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => {
                    const next = new URLSearchParams(location.search);
                    const cur = Number(next.get('page') || 1);
                    next.set('page', String(cur + 1));
                    navigate(`${location.pathname}?${next.toString()}`);
                  }}
                  disabled={loading}
                >
                  Charger plus
                </button>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          {/* Carrousel vedette */}
          <section className="mb-4 wireframe-section p-3">
            <h2 className="h5 text-white">Jeux en vedette</h2>
            <div className="mt-3">
              {!loading && !error && <FeaturedCarousel games={(games || []).slice(0, 12)} />}
            </div>
          </section>

          {/* Catégories */}
          <section className="mb-4 wireframe-section p-3">
            <h2 className="h5 text-white">Catégories</h2>
            <div className="mt-3">
                <CategoryCarousel
                  categories={categories}
                  onCategoryClick={onCategoryClick}
                />
            </div>
            <p className="small text-muted mt-3">
              Cliquez sur une catégorie pour filtrer les jeux ci-dessous.
            </p>
          </section>

          {/* Derniers jeux */}
          <section className="mb-4 wireframe-section p-3">
            <h2 className="h5 text-white">Derniers jeux parus</h2>
            <div className="row g-3 mt-2">
              {(games || []).slice(0, 4).map(g => (
                <div key={g.id} className="col-6 col-md-3">
                  <GameCard game={g} />
                </div>
              ))}
            </div>
          </section>

          {/* Tous les jeux récents */}
          <section className="mb-4 wireframe-section p-3">
            <h2 className="h5 text-white">Tous les jeux (récents d’abord)</h2>
            <div className="mt-3">
              <GamesGrid
                games={(games || []).slice().sort(
                  (a, b) => new Date(b.released) - new Date(a.released)
                )}
              />
            </div>
          </section>
        </>
      )}
    </PageContainer>
  );
}
