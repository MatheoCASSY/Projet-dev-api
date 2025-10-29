import { useEffect, useState } from 'react';

export default function useRawgGame(id) {
  const [state, setState] = useState({ game: null, screenshots: [], loading: true, error: null });

  useEffect(() => {
    if (!id) return setState({ game: null, screenshots: [], loading: false, error: 'No id' });
    let mounted = true;
    const key = process.env.REACT_APP_RAWG_API_KEY;
    if (!key) {
      setState({ game: null, screenshots: [], loading: false, error: 'Missing RAWG API key (set REACT_APP_RAWG_API_KEY in .env)' });
      return;
    }

    setState(s => ({ ...s, loading: true, error: null }));

    const detailsUrl = `https://api.rawg.io/api/games/${id}?key=${key}`;
    const screenshotsUrl = `https://api.rawg.io/api/games/${id}/screenshots?key=${key}&page_size=20`;
    const storesUrl = `https://api.rawg.io/api/games/${id}/stores?key=${key}`;

    Promise.all([
      fetch(detailsUrl).then(r => r.json()),
      fetch(screenshotsUrl).then(r => r.json()),
      fetch(storesUrl).then(r => r.json()).catch(() => null),
    ])
      .then(([details, shots, stores]) => {
        if (!mounted) return;
        // Merge stores results into details.stores if available
        if (stores && stores.results) {
          details.stores = stores.results;
        }
        setState({ game: details, screenshots: shots.results || [], loading: false, error: null });
      })
      .catch(err => {
        if (!mounted) return;
        setState({ game: null, screenshots: [], loading: false, error: err.message || String(err) });
      });

    return () => { mounted = false; };
  }, [id]);

  return state;
}
