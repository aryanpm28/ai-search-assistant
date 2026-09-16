const axios = require('axios');

// Simple Wikipedia search helper
// Returns a few relevant page summaries for the query
async function searchWikipedia(query, limit = 3) {
  try {
    // First search for page titles
    const searchRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        list: 'search',
        srsearch: query,
        srlimit: limit,
        format: 'json',
        origin: '*'
      }
    });

    const results = searchRes.data.query?.search || [];
    if (results.length === 0) return [];

    // Get extracts (summaries) for those pages
    const titles = results.map(r => r.title).join('|');
    const extractRes = await axios.get('https://en.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        prop: 'extracts|info',
        exintro: true,
        explaintext: true,
        titles: titles,
        inprop: 'url',
        format: 'json',
        origin: '*'
      }
    });

    const pages = extractRes.data.query?.pages || {};
    const sources = Object.values(pages)
      .filter(p => p.extract)
      .map(p => ({
        title: p.title,
        url: p.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(p.title)}`,
        snippet: p.extract.slice(0, 300) + (p.extract.length > 300 ? '...' : '')
      }));

    return sources;
  } catch (err) {
    console.error('Wikipedia search error:', err.message);
    return [];
  }
}

module.exports = { searchWikipedia };
