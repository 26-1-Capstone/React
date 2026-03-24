// src/lib/auth.js — Token helpers

const ACCESS_TOKEN_KEY = 'nutrishare_access_token'

export const authStorage = {
    getToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    setToken: (token) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    removeToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),
    isAuthenticated: () => !!localStorage.getItem(ACCESS_TOKEN_KEY),
}
