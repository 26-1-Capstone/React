import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import PriceDisplay from '@/components/common/PriceDisplay'
import ProgressBar from '@/components/common/ProgressBar'
import Toast from '@/components/common/Toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import api from '@/lib/api'
import { authStorage } from '@/lib/auth'
import './GroupDetailPage.css'

const getStatusCopy = (status) => {
    switch (status) {
    case 'CLOSED':
        return '모집 완료'
    case 'CANCELED':
        return '모집 취소'
    default:
        return '진행중'
    }
}

const formatRemainingTime = (dueDate) => {
    if (!dueDate) return '마감 일정 확인 중'

    const remainingMs = new Date(dueDate).getTime() - Date.now()
    if (Number.isNaN(remainingMs)) return '마감 일정 확인 중'
    if (remainingMs <= 0) return '모집이 종료되었어요'

    const totalHours = Math.floor(remainingMs / (1000 * 60 * 60))
    const days = Math.floor(totalHours / 24)
    const hours = totalHours % 24

    if (days > 0) {
        return `${days}일 ${hours}시간 남음`
    }

    return `${Math.max(hours, 1)}시간 남음`
}

export default function GroupDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [group, setGroup] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [toastMessage, setToastMessage] = useState('')
    const [isParticipating, setIsParticipating] = useState(false)
    const [userDong, setUserDong] = useState('')

    useEffect(() => {
        const fetchGroupDetail = async () => {
            setIsLoading(true)
            try {
                const requests = [api.get(`/groups/${id}`)]
                if (authStorage.isAuthenticated()) {
                    requests.push(api.get('/users/me'))
                }

                const [groupResponse, profileResponse] = await Promise.all(requests)
                setGroup(groupResponse.data.data)
                setUserDong(profileResponse?.data?.data?.address?.dong || '')
            } catch (error) {
                console.error('Failed to fetch group details', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchGroupDetail()
    }, [id])

    const handleParticipate = async () => {
        setIsParticipating(true)
        try {
            await api.post(`/groups/${id}/join`, { quantity: 1 })
            const response = await api.get(`/groups/${id}`)
            setGroup(response.data.data)
            setIsParticipating(true)
            setToastMessage('공동구매에 참여했습니다! 공동구매가 완료되면 마이페이지에서 리뷰를 남길 수 있어요.')
            setTimeout(() => setToastMessage(''), 3000)
        } catch (error) {
            console.error('Failed to join group', error)
            alert('참여에 실패했습니다.')
            setIsParticipating(false)
        }
    }

    if (isLoading) {
        return <PageLayout><div className="center-msg"><LoadingSpinner /></div></PageLayout>
    }

    if (!group) {
        return (
            <PageLayout>
                <div className="center-msg">
                    <p>존재하지 않는 공동구매입니다.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/groups')}>목록으로</button>
                </div>
            </PageLayout>
        )
    }

    const isFull = group.currentQuantity >= group.targetQuantity
    const isSameDong = group.dong && userDong && group.dong === userDong

    return (
        <PageLayout>
            <div className="group-detail-container">
                <div className="group-detail-header">
                    <span className="badge-status">{getStatusCopy(group.status)}</span>
                    <h1 className="group-title">{group.title}</h1>
                    {group.dong && (
                        <p className="group-location-copy">
                            📍 {group.dong}
                            {isSameDong ? ' · 내 동네 공동구매예요' : ' · 저장한 동네와 비교해 볼 수 있어요'}
                        </p>
                    )}
                </div>

                <div className="group-product-box">
                    <div className="product-image-placeholder">
                        <span style={{ fontSize: '3rem' }}>📦</span>
                    </div>
                    <div className="product-info-short">
                        <p className="product-name">{group.productName}</p>
                        <div className="price-info">
                            <span className="price-label">공동구매가</span>
                            <PriceDisplay value={group.typePrice} className="discounted-price" />
                        </div>
                        <p className="group-description-copy">
                            {group.description || '같은 동네 이웃과 함께 택배로 받아보는 공동구매예요.'}
                        </p>
                    </div>
                </div>

                <div className="group-progress-section">
                    <h3 className="section-subtitle">모집 현황</h3>
                    <div className="progress-stats">
                        <div className="stat-item">
                            <span className="stat-label">현재 인원</span>
                            <span className="stat-value highlight">{group.currentQuantity}명</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">목표 인원</span>
                            <span className="stat-value">{group.targetQuantity}명</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-label">남은 시간</span>
                            <span className="stat-value text-error">{formatRemainingTime(group.dueDate)}</span>
                        </div>
                    </div>
                    <ProgressBar value={group.currentQuantity} max={group.targetQuantity} />
                    <p className="progress-desc">
                        목표 인원이 모두 모이면 택배 배송 기준으로 안내돼요. 별도 픽업/직거래 선택은 지원하지 않아요.
                    </p>
                </div>

                <div className="group-host-info">
                    <div className="host-avatar">{group.dong ? '📍' : '🤝'}</div>
                    <div className="host-details">
                        <p className="host-name">{group.dong ? `${group.dong} 이웃이 연 공동구매` : '우리 동네 공동구매'}</p>
                        <p className="host-message">
                            {isSameDong
                                ? '저장한 동네와 같은 공동구매라 참여 후 리뷰를 남기기 좋아요.'
                                : '프로필에 동네를 저장해 두면 같은 동 공동구매를 더 쉽게 찾을 수 있어요.'}
                        </p>
                    </div>
                </div>

                <div className="bottom-action-bar">
                    <button
                        className={`btn ${isParticipating ? 'btn-secondary' : 'btn-primary'} participate-btn`}
                        onClick={handleParticipate}
                        disabled={isFull || isParticipating}
                    >
                        {isParticipating ? '참여 완료' : isFull ? '모집 마감' : '공동구매 참여하기'}
                    </button>
                </div>
            </div>

            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} type="success" />}
        </PageLayout>
    )
}
