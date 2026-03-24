import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import GroupBuyingCard from '@/components/common/GroupBuyingCard'
import EmptyState from '@/components/common/EmptyState'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import './GroupListPage.css'
import api from '@/lib/api'
import { authStorage } from '@/lib/auth'

export default function GroupListPage() {
    const navigate = useNavigate()
    const [filter, setFilter] = useState('ALL')
    const [groups, setGroups] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [profileDong, setProfileDong] = useState('')

    useEffect(() => {
        fetchGroups()
        if (authStorage.isAuthenticated()) {
            fetchProfileDong()
        }
    }, [])

    const fetchGroups = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/groups', {
                params: {
                    size: 50
                }
            })
            setGroups(response.data.data.content || [])
        } catch (error) {
            console.error('Failed to fetch groups', error)
        } finally {
            setIsLoading(false)
        }
    }

    const fetchProfileDong = async () => {
        try {
            const response = await api.get('/users/me')
            setProfileDong(response.data?.data?.address?.dong || '')
        } catch (error) {
            console.error('Failed to fetch neighborhood profile', error)
        }
    }

    const filteredGroups = useMemo(() => {
        const nextGroups = [...groups]

        if (filter === 'POPULAR') {
            return nextGroups.sort((a, b) => (b.currentQuantity || 0) - (a.currentQuantity || 0))
        }

        if (filter === 'CLOSING_SOON') {
            return nextGroups.filter((group) => {
                const due = group.dueDate ? new Date(group.dueDate) : null
                if (!due || Number.isNaN(due.getTime())) return false
                return due.getTime() - Date.now() < 1000 * 60 * 60 * 24 * 3
            })
        }

        if (filter === 'LOCAL') {
            return nextGroups.filter((group) => group.dong && group.dong === profileDong)
        }

        return nextGroups
    }, [filter, groups, profileDong])

    return (
        <PageLayout>
            <div className="group-list-container">
                <div className="group-list-header">
                    <h2 className="page-title">공동구매 모음</h2>
                    <p className="page-desc">이웃들과 함께 생필품을 저렴하게 구매하세요. 같은 동네 공동구매는 프로필에 저장한 동을 기준으로 보여드려요.</p>
                </div>

                {authStorage.isAuthenticated() && (
                    <div className="neighborhood-banner">
                        {profileDong ? (
                            <><strong>{profileDong}</strong> 기준 공동구매를 함께 보고 있어요.</>
                        ) : (
                            <>
                                아직 저장된 동네가 없어요. <button type="button" className="inline-link-btn" onClick={() => navigate('/mypage/edit')}>프로필에서 동을 입력</button>하면 같은 동 공동구매를 빠르게 찾을 수 있어요.
                            </>
                        )}
                    </div>
                )}

                <div className="filter-scroll-wrapper">
                    <div className="filter-chips">
                        <button
                            className={`chip ${filter === 'ALL' ? 'active' : ''}`}
                            onClick={() => setFilter('ALL')}
                        >
                            전체
                        </button>
                        <button
                            className={`chip ${filter === 'CLOSING_SOON' ? 'active' : ''}`}
                            onClick={() => setFilter('CLOSING_SOON')}
                        >
                            마감 임박 💥
                        </button>
                        <button
                            className={`chip ${filter === 'POPULAR' ? 'active' : ''}`}
                            onClick={() => setFilter('POPULAR')}
                        >
                            인기 높은 🔥
                        </button>
                        {profileDong && (
                            <button
                                className={`chip ${filter === 'LOCAL' ? 'active' : ''}`}
                                onClick={() => setFilter('LOCAL')}
                            >
                                {profileDong}만 보기 📍
                            </button>
                        )}
                    </div>
                </div>

                <div className="group-grid">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : filteredGroups.length === 0 ? (
                        <EmptyState
                            title={filter === 'LOCAL' ? '같은 동네 공동구매가 아직 없어요.' : '현재 진행 중인 공동구매가 없습니다.'}
                            description={filter === 'LOCAL'
                                ? '다른 동네 공동구매는 전체 탭에서 계속 둘러볼 수 있어요.'
                                : '원하는 상품으로 직접 공동구매를 주최해 보세요!'}
                        />
                    ) : (
                        filteredGroups.map(group => (
                            <GroupBuyingCard key={group.id} {...group} userDong={profileDong} />
                        ))
                    )}
                </div>

                <button
                    className="fab-btn"
                    onClick={() => navigate('/groups/new')}
                    aria-label="공동구매 주최하기"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>
        </PageLayout>
    )
}
