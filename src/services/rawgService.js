import { useEffect, useState } from "react";

// Accept either a string (search) or an options object { search, genre }
export default function useRawg(opts) {
  const [state, setState] = useState({ games: [], loading: true, error: null });

  useEffect(() => {
    let mounted = true;
    const key = process.env.REACT_APP_RAWG_API_KEY;

    let search = '';
    let genre = '';
    if (typeof opts === 'string') {
      search = opts;
    } else if (opts && typeof opts === 'object') {
      search = opts.search || '';
      genre = opts.genre || '';
    }

    const qSearch = search ? `&search=${encodeURIComponent(search)}` : "";
    const qGenre = genre ? `&genres=${encodeURIComponent(genre)}` : "";

    if (!key) {
      setState({ games: [], loading: false, error: 'Missing RAWG API key (set REACT_APP_RAWG_API_KEY in .env)' });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    fetch(`https://api.rawg.io/api/games?key=${key}${qSearch}${qGenre}&page_size=20`)
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
    // stringify opts to avoid object identity issues in deps
  }, [opts ? JSON.stringify(opts) : opts]);

  return state;
}
