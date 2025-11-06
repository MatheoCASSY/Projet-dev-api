import { useEffect, useState, useRef } from "react";

export default function useRawg(opts) {
  const [state, setState] = useState({ games: [], loading: true, error: null });

  const optsKey = opts !== undefined && opts !== null ? JSON.stringify(opts) : '';

  const pageRef = useRef(1);

  const fetchPage = async (page, replace = false) => {
    const key = process.env.REACT_APP_RAWG_API_KEY;
    if (!key) {
      setState({ games: [], loading: false, error: 'Missing RAWG API key (set REACT_APP_RAWG_API_KEY in .env)' });
      return;
    }

    let search = '';
    let genre = '';
    const localOpts = optsKey ? JSON.parse(optsKey) : null;
    if (typeof localOpts === 'string') {
      search = localOpts;
    } else if (localOpts && typeof localOpts === 'object') {
      search = localOpts.search || '';
      genre = localOpts.genre || '';
    }

    const qSearch = search ? `&search=${encodeURIComponent(search)}` : '';
    const qGenre = genre ? `&genres=${encodeURIComponent(genre)}` : '';

    setState(prev => ({ ...prev, loading: true, error: null }));

    console.log('useRawg fetching', { page, search, genre });

    try {
      const res = await fetch(`https://api.rawg.io/api/games?key=${key}${qSearch}${qGenre}&page_size=20&page=${page}`);
      const json = await res.json();
      const results = json.results || [];
      if (replace) {
        setState({ games: results, loading: false, error: null });
      } else {
        setState(prev => ({ games: [...(prev.games || []), ...results], loading: false, error: null }));
      }
    } catch (err) {
      setState({ games: [], loading: false, error: err.message || String(err) });
    }
  };

  useEffect(() => {
    const localOpts = optsKey ? JSON.parse(optsKey) : null;
    const desiredPage = localOpts && typeof localOpts === 'object' && localOpts.page ? Number(localOpts.page) || 1 : 1;
    pageRef.current = desiredPage;

    (async () => {
      if (desiredPage <= 1) {
        await fetchPage(1, true);
      } else {
        await fetchPage(1, true);
        for (let p = 2; p <= desiredPage; p++) {
          await fetchPage(p, false);
        }
      }
    })();
  }, [optsKey]);

  const loadMore = () => {
    pageRef.current += 1;
    fetchPage(pageRef.current, false);
  };

  return { ...state, loadMore };
}
