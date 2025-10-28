import { useState } from 'react';
import useRawg from '../services/rawgService';
import GamesGrid from '../components/GamesGrid';

export default function RawgStore() {
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const { games, loading, error } = useRawg(search);

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
            onClick={() => setSearch(query)}
          >
            Rechercher
          </button>
        </div>
      </div>

      {loading && <div className="text-center">Chargement...</div>}
      {error && <div className="alert alert-danger">Erreur : {String(error)}</div>}

      {!loading && !error && <GamesGrid games={games} />}
    </div>
  );
}
