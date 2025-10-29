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

    const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}&cc=fr&l=french`;
    const globalUrl = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appid}`;
    const schemaUrl = key ? `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appid}` : null;
    const reviewsUrl = `https://store.steampowered.com/appreviews/${appid}?json=1&language=all&purchase_type=all&num_per_page=3`;

    Promise.all([
      fetch(storeUrl).then(r => r.json()).catch((e) => ({ error: e })),
      fetch(globalUrl).then(r => r.json()).catch(() => null),
      schemaUrl ? fetch(schemaUrl).then(r => r.json()).catch(() => null) : Promise.resolve(null),
      fetch(reviewsUrl).then(r => r.json()).catch(() => null),
    ])
      .then(([storeRes, globalRes, schemaRes, reviewsRes]) => {
        if (!mounted) return;
        // handle possible network/CORS error objects
        if (storeRes && storeRes.error) {
          setState({ store: null, achievements: [], global: [], reviews: [], review_summary: null, loading: false, error: 'Failed to fetch Steam store data (CORS or network)'});
          return;
        }

        const store = storeRes && storeRes[appid] && storeRes[appid].success ? storeRes[appid].data : null;
        const global = globalRes && globalRes.achievementpercentages ? globalRes.achievementpercentages.achievements : [];
        const achievements = schemaRes && schemaRes.game && schemaRes.game.availableGameStats && schemaRes.game.availableGameStats.achievements ? schemaRes.game.availableGameStats.achievements : [];
        const reviews = reviewsRes && reviewsRes.reviews ? reviewsRes.reviews : [];
        const review_summary = reviewsRes && reviewsRes.query_summary ? reviewsRes.query_summary : null;
        setState({ store, achievements, global, reviews, review_summary, loading: false, error: null });
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
