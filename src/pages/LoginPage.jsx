// src/pages/LoginPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '@/lib/api'
import { authStorage } from '@/lib/auth'
import './LoginPage.css'

export default function LoginPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const token = authStorage.getToken()
        if (!token) return

        // 만료된 토큰은 제거하고 로그인 화면에 머무른다.
        try {
            const [, payloadBase64] = token.split('.')
            const payload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')))
            const expMs = Number(payload?.exp || 0) * 1000
            if (!expMs || Date.now() >= expMs) {
                authStorage.removeToken()
                return
            }
        } catch {
            authStorage.removeToken()
            return
        }

        // 유효한 토큰이 있을 때만 홈으로 이동
        navigate('/', { replace: true })
    }, [navigate])

    const resolveOAuthOrigin = () => {
        const explicit = (import.meta.env.VITE_OAUTH_ORIGIN || '').trim().replace(/\/$/, '')
        if (explicit && /^https?:\/\//i.test(explicit)) {
            return explicit
        }

        // VITE_API_BASE_URL 이 절대 URL이면 그 호스트를 OAuth 시작점으로 사용
        const apiBase = (import.meta.env.VITE_API_BASE_URL || '').trim()
        if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
            try {
                const u = new URL(apiBase)
                return `${u.protocol}//${u.host}`
            } catch {
                /* ignore */
            }
        }

        // 기본 백엔드(현재 운영 IP) — OAuth 시작/콜백을 동일 호스트로 맞추기 위함
        return 'http://3.36.139.67'
    }

    const buildOAuthStartUrl = (provider, redirect) => {
        const origin = resolveOAuthOrigin()
        const query = `redirect=${encodeURIComponent(redirect || '/')}`
        return `${origin}/oauth2/authorization/${provider}?${query}`
    }

    const handleOAuthLogin = (provider) => {
        setIsLoading(true)
        const redirect = searchParams.get('redirect') || '/'
        const target = buildOAuthStartUrl(provider, redirect)
        window.location.assign(target)
    }

    const handleDevLogin = async () => {
        setIsLoading(true)
        const redirect = searchParams.get('redirect') || '/'

        try {
            const response = await api.get('/auth/dev-login')
            const token = response.data?.data

            if (!token) {
                throw new Error('개발자 로그인 토큰이 없습니다.')
            }

            authStorage.setToken(token)
            navigate(redirect, { replace: true })
        } catch (error) {
            console.error('Developer login failed', error)
            alert('개발자 로그인에 실패했습니다.')
            setIsLoading(false)
        }
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-logo">
                    <h1>NutriShare</h1>
                    <p>우리 동네 알뜰 식료품 공동구매</p>
                </div>

                <div className="login-benefits">
                    <div className="benefit-item">
                        <span className="benefit-icon">📦</span>
                        <span>대용량 마트 상품을 소분해서 알뜰하게</span>
                    </div>
                    <div className="benefit-item">
                        <span className="benefit-icon">🚚</span>
                        <span>이웃과 함께사면 배송비 0원</span>
                    </div>
                </div>

                <div className="oauth-buttons">
                    <button
                        className="btn-oauth btn-dev"
                        onClick={handleDevLogin}
                        disabled={isLoading}
                    >
                        <span className="oauth-icon dev-icon">D</span>
                        개발자 로그인으로 QA 시작
                    </button>

                    {/* 카카오 로그인 */}
                    <button
                        className="btn-oauth btn-kakao"
                        onClick={() => handleOAuthLogin('kakao')}
                        disabled={isLoading}
                    >
                        <span className="oauth-icon kakao-icon">K</span>
                        카카오 소셜 로그인
                    </button>

                    {/* 구글 로그인 */}
                    <button
                        className="btn-oauth btn-google"
                        onClick={() => handleOAuthLogin('google')}
                        disabled={isLoading}
                    >
                        <span className="oauth-icon google-icon">G</span>
                        Google 계정으로 로그인
                    </button>
                </div>

                <p className="login-footer-text">
                    로그인 시 NutriShare의 <a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의하게 됩니다.
                </p>
            </div>
        </div>
    )
}
