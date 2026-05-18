import { clearAuthState } from "@/store/auth.store";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('accessToken');
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include', // Include cookies for authentication
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    console.log('API error:', errorData);
    // If unauthorized, attempt to refresh the token
    if (errorData.errorCode === 'TOKEN_EXPIRED' || errorData.errorCode === 'TOKEN_INVALID') {
      // Attempt to refresh the token one time
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (refreshRes.ok) {
          const refreshData = await refreshRes.json();
          localStorage.setItem('accessToken', refreshData.accessToken);
          // Retry the original request with the new token
          return apiFetch(endpoint, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshData.accessToken}`,
            },
          });
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        console.error('refreshError:', refreshError);
        clearAuthState();
        document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        return window.location.href = '/login';
      }
    }

    if (errorData.errorCode === 'TOKEN_REQUIRED') {
      // Clear authentication state
      clearAuthState();
      document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      // Redirect to login page
      return window.location.href = '/login';
    }

  }

  return res.json();
}