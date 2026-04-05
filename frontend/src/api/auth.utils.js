// ── Auth data helpers used by axios interceptors ───────────────────────
// Stores token + user in localStorage under key 'ss_auth'

const KEY = "ss_auth";

export function getAuthData() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || null;
  } catch {
    return null;
  }
}

export function saveAuthData({ user, accessToken, refreshToken }) {
  localStorage.setItem(
    KEY,
    JSON.stringify({ user, accessToken, refreshToken })
  );
}

export function clearAuthData() {
  localStorage.removeItem(KEY);
  localStorage.removeItem("ss_user");
  localStorage.removeItem("ss_profile");
}

export function getAccessToken() {
  return getAuthData()?.accessToken || null;
}

export function getUser() {
  return getAuthData()?.user || null;
}