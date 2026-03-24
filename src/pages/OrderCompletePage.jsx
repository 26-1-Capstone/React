// src/pages/OrderCompletePage.jsx
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import './OrderCompletePage.css'

export default function OrderCompletePage() {
    const { id } = useParams()
    const navigate = useNavigate()

    return (
        <PageLayout>
            <div className="order-complete-container">
                <div className="success-icon-wrapper">
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2 className="complete-title">주문이 완료되었습니다!</h2>
                <p className="complete-desc">
                    주문 번호: <strong>{id}</strong><br />
                    빠르고 안전하게 배송해 드릴게요.
                </p>

                <div className="complete-actions">
                    <button className="btn btn-outline" onClick={() => navigate('/mypage')}>주문 내역 보기</button>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>쇼핑 계속하기</button>
                </div>
            </div>
        </PageLayout>
    )
}
