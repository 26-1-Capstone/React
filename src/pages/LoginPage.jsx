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
        // 이미 로그인된 상태면 메인으로 이동
        if (authStorage.isAuthenticated()) {
            navigate('/', { replace: true })
        }
    }, [navigate])

    const handleOAuthLogin = (provider) => {
        setIsLoading(true)
        const redirect = searchParams.get('redirect') || '/'
        const target = `/oauth2/authorization/${provider}?redirect=${encodeURIComponent(redirect)}`
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
                        카카오로 3초 만에 시작하기
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
