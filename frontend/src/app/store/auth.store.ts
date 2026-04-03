type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
}

let authState: AuthState = {
  accessToken: null,
  refreshToken: null,
}

export function setAuthState(tokens: AuthState) {
  authState = tokens;
  localStorage.setItem('accessToken', tokens.accessToken || '');
  localStorage.setItem('refreshToken', tokens.refreshToken || '');
}

export function getAuthState(): AuthState {
  if (!authState.accessToken || !authState.refreshToken) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    authState = {
      accessToken,
      refreshToken,
    };
  }
  return authState;
}

export function clearAuthState() {
  authState = {
    accessToken: null,
    refreshToken: null,
  };
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}