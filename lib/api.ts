import config from './config';

/**
 * Robust, resilient API client for Next.js (client & server)
 */
const getBaseUrl = (): string => {
  // If NEXT_PUBLIC_API_BASE_URL is explicitly set, use it
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '');
  }

  // If in browser, dynamically match current hostname (localhost vs 127.0.0.1 vs LAN IP)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || '127.0.0.1';
    return `http://${hostname}:3001`;
  }

  return (config.apiBaseUrl || 'http://127.0.0.1:3001').replace(/\/$/, '');
};

export const apiClient = {
  get baseUrl(): string {
    return getBaseUrl();
  },

  async request(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${getBaseUrl()}${cleanEndpoint}`;

    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    // Headers object: do NOT set Content-Type for FormData so browser sets multipart/form-data boundary
    const headers: Record<string, string> = {
      ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers as Record<string, string>),
    };

    if (isFormData && headers['Content-Type']) {
      delete headers['Content-Type'];
    }

    const defaultOptions: RequestInit = {
      headers,
    };

    // Add 12-second timeout for standard requests, 30-second for uploads
    const controller = new AbortController();
    const timeoutDuration = isFormData ? 30000 : 12000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      const response = await fetch(url, {
        ...defaultOptions,
        ...options,
        headers,
        signal: options.signal || controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        console.warn(`[apiClient] Request to ${url} timed out after ${timeoutDuration}ms`);
      } else {
        console.warn(`[apiClient] Network request failed for ${url}:`, err.message);
      }
      throw err;
    }
  },

  // Bound convenience methods
  get(endpoint: string, options?: RequestInit) {
    return apiClient.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint: string, data?: any, options?: RequestInit) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? data : (data !== undefined ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined),
    });
  },

  put(endpoint: string, data?: any, options?: RequestInit) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    return apiClient.request(endpoint, {
      ...options,
      method: 'PUT',
      body: isFormData ? data : (data !== undefined ? (typeof data === 'string' ? data : JSON.stringify(data)) : undefined),
    });
  },

  upload(endpoint: string, formData: FormData, options?: RequestInit) {
    return apiClient.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    });
  },

  delete(endpoint: string, options?: RequestInit) {
    return apiClient.request(endpoint, { ...options, method: 'DELETE' });
  },
};

export default apiClient;
