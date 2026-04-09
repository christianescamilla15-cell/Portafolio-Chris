/**
 * Fetch with retry logic — exponential backoff, 15s timeout.
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} retries - number of retry attempts (default 2)
 * @returns {Promise<{data: any, error: string|null}>}
 */
export async function fetchWithRetry(url, options = {}, retries = 2) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err) {
      lastError = err;

      if (attempt < retries) {
        const delay = Math.pow(2, attempt) * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  const message = lastError?.name === 'AbortError'
    ? 'Request timed out after 15 seconds'
    : lastError?.message || 'Unknown error';

  return { data: null, error: message };
}
