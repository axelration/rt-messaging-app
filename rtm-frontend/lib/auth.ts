import { apiFetch } from './api';
import { getSocket } from './socket';

export async function logout() {
  try {
    await apiFetch('/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }

  // disconnect socket connection
  const socket = getSocket();
  if (socket) socket.disconnect();

  // clear local storage
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  // clear cookies
  document.cookie = 'accessToken=; Max-Age=0; path=/; secure; samesite=strict';
  document.cookie = 'refreshToken=; Max-Age=0; path=/; secure; samesite=strict';

  // redirect to login page
  window.location.href = '/login';
}