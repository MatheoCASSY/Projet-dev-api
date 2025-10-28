import { useEffect, useState } from "react";

export default function useRawg(query) {
  const [state, setState] = useState({ games: [], loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    const key = process.env.REACT_APP_RAWG_API_KEY;
    const q = query ? `&search=${encodeURIComponent(query)}` : "";

    if (!key) {
      setState({ games: [], loading: false, error: 'Missing RAWG API key (set REACT_APP_RAWG_API_KEY in .env)' });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch(`https://api.rawg.io/api/games?key=${key}${q}&page_size=20`)
      .then(res => res.json())
      .then(json => {
        if (!mounted) return;
        setState({ games: json.results || [], loading: false, error: null });
      })
      .catch(err => {
        if (!mounted) return;
        setState({ games: [], loading: false, error: err.message || String(err) });
      });

    return () => {
      mounted = false;
    };
  }, [query]);

  return state;
}
