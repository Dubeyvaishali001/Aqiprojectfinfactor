const fetch = require('node-fetch');
const LRU = require('lru-cache');

const token = process.env.AQICN_TOKEN;

const cache = new LRU({
  max: 200,
  ttl: 1000 * 60 * 10 // 10 min cache
});

function normalize(data) {
  if (!data || !data.data) return null;

  const d = data.data;

  const iaqi = d.iaqi || {};
  const pollutants = {
    pm25: iaqi.pm25?.v || null,
    pm10: iaqi.pm10?.v || null,
    o3: iaqi.o3?.v || null,
    no2: iaqi.no2?.v || null,
    so2: iaqi.so2?.v || null,
    co: iaqi.co?.v || null
  };

  return {
    city: d.city?.name || "Unknown",
    aqi: d.aqi,
    dominant_pollutant: d.dominentpol,
    pollutants,
    geo: d.city?.geo || null,
    time: d.time?.s || null
  };
}

async function getCityAQI(city) {
  const key = city.toLowerCase();

  if (cache.has(key)) return cache.get(key);

  const url = `https://api.waqi.info/feed/${encodeURIComponent(city)}/?token=${token}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== "ok") return null;

  const normalized = normalize(json);
  cache.set(key, normalized);

  return normalized;
}

module.exports = { getCityAQI };
