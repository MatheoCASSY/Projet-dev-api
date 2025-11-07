const fetchJson = async (url) => {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    return null;
  }
};

const fetchText = async (url) => {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    return await r.text();
  } catch (e) {
    return null;
  }
};

const parseCommunityAchievements = (html) => {
  if (!html) return [];
  const achievements = [];
  let match;
  // Try to find blocks with class "achieveTxt"
  const reAch = /<div[^>]*class=["']?achieveTxt["']?[^>]*>([\s\S]*?)<\/div>/gi;
  while ((match = reAch.exec(html)) !== null) {
    const block = match[1];
    const nameMatch = /<h3[^>]*>([\s\S]*?)<\/h3>/i.exec(block);
    const descMatch = /<div[^>]*class=["']?achieveDesc["']?[^>]*>([\s\S]*?)<\/div>/i.exec(block) || /<p[^>]*>([\s\S]*?)<\/p>/i.exec(block);
    const iconMatch = /<img[^>]*src=["']([^"']+)["'][^>]*>/i.exec(block);
    const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : null;
    const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : null;
    const icon = iconMatch ? iconMatch[1] : null;
    if (name) achievements.push({ name, description, icon });
  }

  // If none found, try to extract <h3> titles as fallback
  if (achievements.length === 0) {
    const reH3 = /<h3[^>]*>([\s\S]*?)<\/h3>/gi;
    while ((match = reH3.exec(html)) !== null) {
      const name = match[1].replace(/<[^>]+>/g, '').trim();
      if (name) {
        const after = html.slice(match.index, match.index + 600);
        const descMatch = /<div[^>]*class=["']?achieveDesc["']?[^>]*>([\s\S]*?)<\/div>/i.exec(after) || /<p[^>]*>([\s\S]*?)<\/p>/i.exec(after);
        const description = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : null;
        achievements.push({ name, description, icon: null });
      }
    }
  }

  return achievements;
};

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const { appid } = req.query || {};
  if (!appid) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(400).json({ error: 'Missing appid query param' });
  }

  const key = process.env.STEAM_API_KEY || process.env.REACT_APP_STEAM_API_KEY || null;

  const storeUrl = `https://store.steampowered.com/api/appdetails?appids=${encodeURIComponent(appid)}&cc=fr&l=french`;
  const globalUrl = `https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${encodeURIComponent(appid)}`;
  const schemaUrl = key ? `https://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${encodeURIComponent(key)}&appid=${encodeURIComponent(appid)}` : null;
  const reviewsUrl = `https://store.steampowered.com/appreviews/${encodeURIComponent(appid)}?json=1&language=all&purchase_type=all&num_per_page=3`;
  const communityUrl = `https://steamcommunity.com/stats/${encodeURIComponent(appid)}/achievements`;

  try {
    const [store, global, schema, reviews, communityHtml] = await Promise.all([
      fetchJson(storeUrl),
      fetchJson(globalUrl),
      schemaUrl ? fetchJson(schemaUrl) : Promise.resolve(null),
      fetchJson(reviewsUrl),
      fetchText(communityUrl),
    ]);

    const community_achievements = parseCommunityAchievements(communityHtml);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ store, global, schema, reviews, communityHtml, community_achievements });
  } catch (err) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({ error: err.message || String(err) });
  }
};
