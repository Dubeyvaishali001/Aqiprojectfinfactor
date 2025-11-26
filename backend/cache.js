// Simple in-memory cache

let cache = {};
const CACHE_EXPIRY = 1000 * 60 * 5; // 5 minutes

function setCache(key, value) {
    cache[key] = {
        data: value,
        expiry: Date.now() + CACHE_EXPIRY
    };
}

function getCache(key) {
    const item = cache[key];

    if (!item) return null;

    // Expired?
    if (Date.now() > item.expiry) {
        delete cache[key];
        return null;
    }

    return item.data;
}

module.exports = { setCache, getCache };
