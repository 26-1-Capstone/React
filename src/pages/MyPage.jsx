// src/pages/MyPage.jsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import StatusBadge from '@/components/common/StatusBadge'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Toast from '@/components/common/Toast'
import api from '@/lib/api'
import { authStorage } from '@/lib/auth'
import './MyPage.css'

const getStatusMeta = (status) => {
    switch (status) {
    case 'PAID':
        return { status: 'success', label: '결제 완료' }
    case 'PAYING':
        return { status: 'warning', label: '결제 진행 중' }
    case 'CANCELED':
        return { status: 'error', label: '취소됨' }
    case 'CLOSED':
        return { status: 'success', label: '모집 완료' }
    case 'ACCEPTED':
        return { status: 'info', label: '참여 완료' }
    case 'ORDERED':
        return { status: 'success', label: '주문 전환' }
    default:
        return { status: 'default', label: status || '상태 확인 중' }
    }
}

export default function MyPage() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('orders')

    const [profile, setProfile] = useState(null)
    const [orders, setOrders] = useState([])
    const [participations, setParticipations] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadError, setLoadError] = useState(null)
    const [toastMessage, setToastMessage] = useState('')
    const [editingReviewId, setEditingReviewId] = useState(null)
    const [reviewDrafts, setReviewDrafts] = useState({})
    const [savingReviewId, setSavingReviewId] = useState(null)

    const fetchMyPageData = useCallback(async () => {
        setIsLoading(true)
        setLoadError(null)
        try {
            const [profileRes, ordersRes, participationsRes] = await Promise.all([
                api.get('/users/me'),
                api.get('/users/me/orders'),
                api.get('/users/me/participations')
            ])

            setProfile(profileRes.data.data)
            setOrders(ordersRes.data.data || [])
            setParticipations(participationsRes.data.data || [])
        } catch (error) {
            console.error('Failed to fetch mypage data', error)
            setLoadError(error)
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMyPageData()
    }, [fetchMyPageData])

    const participationReviewMap = useMemo(() => {
        return participations.reduce((acc, participation) => {
            acc[participation.participationId] = reviewDrafts[participation.participationId] || {
                rating: participation.reviewRating || 5,
                comment: participation.reviewComment || ''
            }
            return acc
        }, {})
    }, [participations, reviewDrafts])

    const handleLogout = () => {
        authStorage.removeToken()
        navigate('/login')
    }

    const handleReviewDraftChange = (participationId, field, value) => {
        setReviewDrafts((prev) => ({
            ...prev,
            [participationId]: {
                ...participationReviewMap[participationId],
                [field]: value
            }
        }))
    }

    const handleReviewSubmit = async (participationId) => {
        const draft = participationReviewMap[participationId]
        if (!draft?.comment?.trim()) {
            setToastMessage('한줄 리뷰를 입력해 주세요.')
            return
        }

        setSavingReviewId(participationId)
        try {
            await api.post('/users/me/reviews', {
                participationId,
                rating: Number(draft.rating),
                comment: draft.comment.trim()
            })
            setToastMessage('리뷰가 저장되었습니다.')
            setEditingReviewId(null)
            await fetchMyPageData()
        } catch (error) {
            console.error('Failed to save review', error)
            setToastMessage('리뷰 저장에 실패했습니다.')
        } finally {
            setSavingReviewId(null)
        }
    }

    if (isLoading) {
        return <PageLayout><div style={{ padding: '40px', textAlign: 'center' }}><LoadingSpinner /></div></PageLayout>
    }

    if (!profile) {
        return (
            <PageLayout>
                <div style={{ padding: '40px 16px', textAlign: 'center' }}>
                    <p style={{ marginBottom: 12, fontWeight: 600 }}>
                        {loadError ? '마이페이지 정보를 불러오지 못했어요.' : '로그인이 필요해요.'}
                    </p>
                    <button className="btn btn-primary" onClick={() => navigate('/login', { replace: true })}>
                        로그인 하러가기
                    </button>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div className="mypage-container">
                <section className="profile-section">
                    <div className="profile-info">
                        <img src={profile.profileImageUrl || 'https://via.placeholder.com/80'} alt="프로필" className="profile-img" />
                        <div className="profile-text">
                            <h2 className="profile-name">{profile.nickname}님</h2>
                            <p className="profile-email">{profile.email}</p>
                        </div>
                        <button className="btn btn-outline edit-profile-btn" onClick={() => navigate('/mypage/edit')}>
                            수정
                        </button>
                    </div>

                    {profile.address?.dong && (
                        <p className="profile-neighborhood">내 동네: <strong>{profile.address.dong}</strong></p>
                    )}

                    <div className="savings-card">
                        <span className="savings-label">이번 달 공동구매로 절약한 금액</span>
                        <h3 className="savings-amount">{(profile.totalSavings || 0).toLocaleString()}원</h3>
                        <p className="savings-desc">혼자 샀을 때보다 훨씬 이득이에요!</p>
                    </div>
                </section>

                <div className="mypage-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        주문 / 결제 내역
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
                        onClick={() => setActiveTab('groups')}
                    >
                        참여한 공동구매
                    </button>
                </div>

                <section className="tab-content">
                    {activeTab === 'orders' && (
                        <div className="order-list">
                            {orders.length === 0 ? (
                                <div className="empty-content">주문 내역이 없습니다.</div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.orderId} className="order-card">
                                        <div className="order-header">
                                            <span className="order-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                                            <StatusBadge {...getStatusMeta(order.status)} />
                                        </div>
                                        <div className="order-body">
                                            <p className="order-product-name">{order.summary}</p>
                                            <p className="order-amount">{order.totalAmount.toLocaleString()}원</p>
                                        </div>
                                        <div className="order-footer">
                                            <span className="order-id">주문번호: {order.orderId}</span>
                                            <span className="order-payment-note">가상결제 내역은 이 탭에서 확인할 수 있어요.</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'groups' && (
                        <div className="group-list">
                            {participations.length === 0 ? (
                                <div className="empty-content">참여 내역이 없습니다.</div>
                            ) : (
                                participations.map(group => (
                                    <div key={group.groupPurchaseId ?? group.groupId} className="group-card-mini" onClick={() => navigate(`/groups/${group.groupPurchaseId ?? group.groupId}`)}>
                                        <div className="group-card-header">
                                            <span className="group-card-title">{group.title || `공동구매 #${group.groupPurchaseId ?? group.groupId}`}</span>
                                            <StatusBadge {...getStatusMeta(group.groupStatus || group.status)} />
                                        </div>
                                        <p className="group-card-product">{group.productName || `참여 수량 ${group.quantity}개`}</p>
                                        <div className="group-progress-text">
                                            모집 상태: <b>{group.currentQuantity ?? group.quantity}</b> / {group.targetQuantity ?? group.quantity}명
                                        </div>
                                        <p className="group-review-hint">
                                            {group.reviewEligible
                                                ? '공동구매가 완료되어 리뷰를 남길 수 있어요.'
                                                : '공동구매가 완료되면 별점과 한줄 리뷰를 남길 수 있어요.'}
                                        </p>

                                        {(group.reviewEligible || group.reviewed) && (
                                            <div className="review-panel" onClick={(event) => event.stopPropagation()}>
                                                {group.reviewed && (
                                                    <div className="review-summary">
                                                        <div className="review-summary-header">
                                                            <strong>내 리뷰</strong>
                                                            <span>{'★'.repeat(group.reviewRating || 0)}</span>
                                                        </div>
                                                        <p>{group.reviewComment}</p>
                                                    </div>
                                                )}

                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm review-toggle-btn"
                                                    onClick={() => setEditingReviewId(editingReviewId === group.participationId ? null : group.participationId)}
                                                >
                                                    {group.reviewed ? '리뷰 수정' : '리뷰 작성'}
                                                </button>

                                                {editingReviewId === group.participationId && (
                                                    <div className="review-form">
                                                        <div className="review-stars">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <button
                                                                    key={star}
                                                                    type="button"
                                                                    className={`star-btn ${Number(participationReviewMap[group.participationId]?.rating) >= star ? 'active' : ''}`}
                                                                    onClick={() => handleReviewDraftChange(group.participationId, 'rating', star)}
                                                                >
                                                                    ★
                                                                </button>
                                                            ))}
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-input"
                                                            maxLength={120}
                                                            placeholder="한줄 리뷰를 입력해 주세요"
                                                            value={participationReviewMap[group.participationId]?.comment || ''}
                                                            onChange={(event) => handleReviewDraftChange(group.participationId, 'comment', event.target.value)}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            disabled={savingReviewId === group.participationId}
                                                            onClick={() => handleReviewSubmit(group.participationId)}
                                                        >
                                                            {savingReviewId === group.participationId ? '저장 중...' : '리뷰 저장'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </section>

                <div className="logout-area">
                    <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
                </div>
            </div>
            <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        </PageLayout>
    )
}
