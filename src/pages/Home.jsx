import { useState } from 'react';
import useRawg from '../services/rawgService';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoryCarousel from '../components/CategoryCarousel';
import GamesGrid from '../components/GamesGrid';
import GameCard from '../components/GameCard';
import PageContainer from '../components/PageContainer';

export default function Home() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(null);
  const { games, loading, error } = useRawg({ search, genre: filter || '' });

  // Liste des catégories uniques
  const categories = Array.from(
    new Set((games || []).flatMap(g => (g.genres || []).map(ge => ge.name)))
  ).slice(0, 12);

  const onSearch = (e) => {
    e?.preventDefault();
    // Ne fait qu’actualiser le hook avec le nouveau terme
  };

  const filteredGames = filter
    ? (games || []).filter(g => (g.genres || []).some(ge => ge.name === filter))
    : games || [];

  return (
    <PageContainer>
      {/* Header : barre de recherche */}
      <header className="d-flex align-items-center justify-content-between mb-4 gap-3">
        <h1 className="h4 mb-0">Nom du site</h1>
        <div className="flex-grow-1 ms-3">
          <form onSubmit={onSearch} className="input-group">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
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
      {(search || filter) ? (
        <>
          <h2 className="display-6 mb-4">🛒 Boutique</h2>
          {(search || filter) && (
            <p className="small text-muted">
              {search && <>Résultats pour : <strong>{search}</strong> </>}
              {filter && <> | Catégorie : <strong>{filter}</strong></>}
            </p>
          )}
          {!loading && !error && <GamesGrid games={filteredGames} />}
        </>
      ) : (
        <>
          {/* Carrousel vedette */}
          <section className="mb-4 wireframe-section p-3">
            <h2 className="h5 text-muted">Jeux en vedette</h2>
            <div className="mt-3">
              {!loading && !error && <FeaturedCarousel games={(games || []).slice(0, 12)} />}
            </div>
          </section>

          {/* Catégories */}
          <section className="mb-4 wireframe-section p-3">
            <h2 className="h5 text-muted">Catégories</h2>
            <div className="mt-3">
              <CategoryCarousel
                categories={categories}
                onCategoryClick={setFilter}
              />
            </div>
            <p className="small text-muted mt-3">
              Cliquez sur une catégorie pour filtrer les jeux ci-dessous.
            </p>
          </section>

          {/* Derniers jeux */}
          <section className="mb-4 wireframe-section p-3">
            <h2 className="h5 text-muted">Derniers jeux parus</h2>
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
            <h2 className="h5 text-muted">Tous les jeux (récents d’abord)</h2>
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
