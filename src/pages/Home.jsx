import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GamesGrid from '../components/GamesGrid';
import GameCard from '../components/GameCard';
import useRawg from '../services/rawgService';
import FeaturedCarousel from '../components/FeaturedCarousel';
import CategoryCarousel from '../components/CategoryCarousel';

export default function Home() {
  const { games, loading, error } = useRawg();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const categories = Array.from(new Set((games || []).flatMap(g => (g.genres || []).map(ge => ge.name)))).slice(0, 12);

  const onSearch = (e) => {
    e?.preventDefault();
    if (!search) return;
    navigate(`/store?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="container py-4 home-root" style={{ background: '#0b0b0b', minHeight: '100vh', color: '#fff' }}>
      {/* Header: nom du site + barre de recherche */}
      <header className="d-flex align-items-center justify-content-between mb-4 gap-3">
        <h1 className="h4 mb-0">Nom du site</h1>
        <div className="flex-grow-1 ms-3">
          <form onSubmit={onSearch} className="input-group">
            <input value={search} onChange={e => setSearch(e.target.value)} className="form-control" placeholder="Barre de recherche" />
            <button type="submit" className="btn btn-primary">Rechercher</button>
          </form>
        </div>
      </header>

      {/* Featured carousel */}
      <section className="mb-4 wireframe-section p-3">
        <h2 className="h5 text-muted">Carrousel avec les jeux en vedette</h2>
        <div className="mt-3">
          {loading && <div className="text-muted">Chargement...</div>}
          {error && <div className="text-danger">{String(error)}</div>}
          {!loading && !error && <FeaturedCarousel games={(games || []).slice(0, 12)} />}
        </div>
      </section>

      {/* Categories carousel */}
      <section className="mb-4 wireframe-section p-3">
        <h2 className="h5 text-muted">Catégories</h2>
        <div className="mt-3">
          <CategoryCarousel categories={categories} />
        </div>
        <p className="small text-muted mt-3">Cliquez sur une catégorie pour voir tous les jeux de cette catégorie.</p>
      </section>

      {/* Latest & popular */}
      <section className="mb-4 wireframe-section p-3">
        <h2 className="h5 text-muted">Derniers jeux parus et populaire</h2>
        <div className="row g-3 mt-2">
          {(games || []).slice(0, 4).map(g => (
            <div key={g.id} className="col-6 col-md-3">
              <GameCard game={g} />
            </div>
          ))}
        </div>
      </section>

      {/* All games most recent first */}
      <section className="mb-4 wireframe-section p-3">
        <h2 className="h5 text-muted">Tous les jeux (les plus récents en premier)</h2>
        <div className="mt-3">
          <GamesGrid games={(games || []).slice().sort((a, b) => new Date(b.released) - new Date(a.released))} />
        </div>
      </section>
    </div>
  );
}
