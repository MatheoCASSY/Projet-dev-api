import { useEffect, useState } from 'react';

function extractAppId(url) {
  if (!url) return null;
  const m = url.match(/\/app\/(\d+)/) || url.match(/[?&]appids?=(\d+)/) || url.match(/steamcommunity\.com\/app\/(\d+)/);
  return m ? m[1] : null;
}

export default function useSteam(appid) {
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState({ store: null, achievements: [], global: [], reviews: [], review_summary: null, loading: true, error: null });

  useEffect(() => {
    if (!appid) {
      setState({ store: null, achievements: [], global: [], reviews: [], review_summary: null, loading: false, error: null });
      return;
    }

    let mounted = true;
    const key = process.env.REACT_APP_STEAM_API_KEY;
    setState(s => ({ ...s, loading: true, error: null }));

    // We call our server-side proxy to fetch Steam data; the proxy composes the
    // Steam endpoints and returns { store, global, schema, reviews, community_achievements }.
    const proxyUrl = `/api/steam-proxy?appid=${encodeURIComponent(appid)}`;
    fetch(proxyUrl)
      .then(r => r.json())
      .then(({ store: storeRes, global: globalRes, schema: schemaRes, reviews: reviewsRes, community_achievements: communityAchievements }) => {
        if (!mounted) return;
        // storeRes comes from server proxy. storeRes is expected to be the raw
        // response from store.steampowered.com/api/appdetails (an object keyed by appid)
        const store = storeRes && storeRes[appid] && storeRes[appid].success ? storeRes[appid].data : null;
        const global = globalRes && globalRes.achievementpercentages ? globalRes.achievementpercentages.achievements : [];
        const achievements = schemaRes && schemaRes.game && schemaRes.game.availableGameStats && schemaRes.game.availableGameStats.achievements ? schemaRes.game.availableGameStats.achievements : [];
        const reviews = reviewsRes && reviewsRes.reviews ? reviewsRes.reviews : [];
        const review_summary = reviewsRes && reviewsRes.query_summary ? reviewsRes.query_summary : null;
        // If no useful data was returned, surface an error so UI can fallback to RAWG
        if (!store && (!achievements || achievements.length === 0) && (!reviews || reviews.length === 0) && (!global || global.length === 0) && (!communityAchievements || communityAchievements.length === 0)) {
          setState({ store: null, achievements: [], global: [], reviews: [], review_summary: null, loading: false, error: 'Steam data unavailable (server proxy).'});
          return;
        }
        // prefer achievements from schema; otherwise include communityAchievements if present
        const finalAchievements = (achievements && achievements.length > 0) ? achievements : (communityAchievements || []);
        setState({ store, achievements: finalAchievements, global, reviews, review_summary, loading: false, error: null });
      })
      .catch(err => {
        if (!mounted) return;
        setState({ store: null, achievements: [], global: [], reviews: [], review_summary: null, loading: false, error: 'Failed to fetch Steam data: ' + (err.message || String(err)) });
      });

    return () => { mounted = false; };
  }, [appid, refresh]);

  const retry = () => setRefresh(r => r + 1);
  const steamUrl = appid ? `https://store.steampowered.com/app/${appid}` : null;

  return { ...state, retry, steamUrl, extractAppId };
}
