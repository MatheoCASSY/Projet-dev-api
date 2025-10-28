import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useRawg from '../services/rawgService';
import GamesGrid from '../components/GamesGrid';

export default function RawgStore() {
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // parse query params from URL
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const urlSearch = params.get('search') || '';
  const urlGenre = params.get('genre') || '';

  // memoize options object to avoid unnecessary refetch due to object identity
  const opts = useMemo(() => ({ search: urlSearch, genre: urlGenre }), [urlSearch, urlGenre]);

  const { games, loading, error } = useRawg(opts);

  const doSearch = () => {
    // keep genre if present
    const base = '/store';
    const sp = query ? `?search=${encodeURIComponent(query)}` : '';
    navigate(`${base}${sp}`);
  };

  return (
    <div className="container py-4">
      <h2 className="display-6 mb-4">🛒 Boutique (RAWG)</h2>

      <div className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher un jeu..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={doSearch}
          >
            Rechercher
          </button>
        </div>
      </div>

      {urlSearch && <p className="small text-muted">Résultats pour : <strong>{urlSearch}</strong></p>}
      {urlGenre && <p className="small text-muted">Filtre catégorie : <strong>{urlGenre}</strong></p>}

      {loading && <div className="text-center">Chargement...</div>}
      {error && <div className="alert alert-danger">Erreur : {String(error)}</div>}

      {!loading && !error && <GamesGrid games={games} />}
    </div>
  );
}
