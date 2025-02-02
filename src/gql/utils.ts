export const fetchWithTimeout =
  (timeout: number): typeof fetch =>
  (url, opts) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    return fetch(url, {
      ...opts,
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));
  };
