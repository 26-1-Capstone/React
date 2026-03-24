// src/lib/api.js — Axios instance with auth interceptors

import axios from 'axios'
import { authStorage } from './auth'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
    withCredentials: true,  // 쿠키(RefreshToken) 자동 전송
})

/* ──────────────────────────────────────────────
   요청 인터셉터: AccessToken 자동 부착
────────────────────────────────────────────── */
api.interceptors.request.use((config) => {
    const token = authStorage.getToken()
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

/* ──────────────────────────────────────────────
   응답 인터셉터: 401 시 토큰 재발급 후 재시도
────────────────────────────────────────────── */
let isRefreshing = false
let failedQueue = []   // 재발급 중 들어온 요청 큐

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // 401이고 최초 1회 재시도만 (무한루프 방지)
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest._skipAuthRefresh) {
            if (isRefreshing) {
                // 이미 재발급 중이면 큐에 추가
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`
                    return api(originalRequest)
                })
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                const res = await api.post('/auth/reissue', {}, { _skipAuthRefresh: true })
                const newToken = res.data?.data

                if (newToken) {
                    authStorage.setToken(newToken)
                    api.defaults.headers.common.Authorization = `Bearer ${newToken}`
                    processQueue(null, newToken)
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return api(originalRequest)
                }
            } catch (refreshError) {
                processQueue(refreshError, null)
                // RefreshToken도 만료 → 로그아웃 처리
                authStorage.removeToken()
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api
