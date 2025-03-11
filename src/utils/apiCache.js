/**
 * Simple in-memory cache for API responses
 */
const cache = new Map();

/**
 * Fetch data with caching
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} expiryTime - Cache expiry time in milliseconds (default: 1 hour)
 * @returns {Promise<any>} - The fetched data
 */
export const fetchWithCache = async (
  url,
  options = {},
  expiryTime = 3600000
) => {
  const cacheKey = `${url}-${JSON.stringify(options)}`;

  // Check if we have a valid cached response
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey);
    if (cachedData.timestamp > Date.now() - expiryTime) {
      return cachedData.data;
    }
  }

  // If no cache or expired, fetch new data
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  // Store in cache
  cache.set(cacheKey, {
    data,
    timestamp: Date.now(),
  });

  return data;
};

/**
 * Clear the entire cache or a specific entry
 * @param {string} [cacheKey] - Optional specific cache key to clear
 */
export const clearCache = (cacheKey = null) => {
  if (cacheKey) {
    cache.delete(cacheKey);
  } else {
    cache.clear();
  }
};

/**
 * Get cache size
 * @returns {number} - Number of cached items
 */
export const getCacheSize = () => {
  return cache.size;
};
