// src/pages/LoginCallback.jsx
// OAuth2 성공 후 서버가 ?accessToken=xxx 로 리다이렉트하면
// 여기서 토큰을 추출해 저장 후 홈으로 이동합니다.
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authStorage } from '@/lib/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function LoginCallback() {
    const navigate = useNavigate()

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const token = params.get('accessToken')
        const redirect = params.get('redirect') || '/'

        if (token) {
            authStorage.setToken(token)
            // URL에서 토큰 파라미터 제거 후 홈으로 이동
            navigate(redirect, { replace: true })
        } else {
            navigate('/login', { replace: true })
        }
    }, [navigate])

    return <LoadingSpinner fullScreen />
}
