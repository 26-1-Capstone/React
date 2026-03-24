// src/pages/ProfileEditPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import AddressForm from '@/components/common/AddressForm'
import Toast from '@/components/common/Toast'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import api from '@/lib/api'
import './ProfileEditPage.css'

export default function ProfileEditPage() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [nickname, setNickname] = useState('')
    const [address, setAddress] = useState({ zipcode: '', basicAddress: '', detailAddress: '', dong: '' })

    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true)
            try {
                const response = await api.get('/users/me')
                const data = response.data.data
                setProfile(data)
                setNickname(data.nickname || '')
                if (data.address) {
                    setAddress({
                        zipcode: data.address.zipCode || '',
                        basicAddress: data.address.addressLine1 || '',
                        detailAddress: data.address.addressLine2 || '',
                        dong: data.address.dong || ''
                    })
                }
            } catch (error) {
                console.error('Failed to fetch profile', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        setIsSaving(true)

        try {
            await api.put('/users/me', {
                nickname,
                zipCode: address.zipcode,
                addressLine1: address.basicAddress,
                addressLine2: address.detailAddress,
                dong: address.dong
            })
            setToastMessage('프로필이 성공적으로 수정되었습니다.')
            setTimeout(() => {
                navigate('/mypage')
            }, 1000)
        } catch (error) {
            console.error('Failed to update profile', error)
            alert('프로필 수정에 실패했습니다.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <PageLayout><div style={{ padding: '40px', textAlign: 'center' }}><LoadingSpinner /></div></PageLayout>
    }

    return (
        <PageLayout>
            <div className="profile-edit-container">
                <div className="profile-edit-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>
                        &larr;
                    </button>
                    <h2>프로필 수정</h2>
                </div>

                <section className="edit-section">
                    <h3 className="section-title">기본 정보</h3>
                    <form className="edit-form" onSubmit={handleSave}>
                        <div className="form-group">
                            <label className="form-label">닉네임</label>
                            <input
                                type="text"
                                className="form-input"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder="닉네임을 입력하세요"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">이메일 (변경 불가)</label>
                            <input
                                type="email"
                                className="form-input"
                                value={profile?.email || ''}
                                disabled
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? '저장 중...' : '프로필 저장'}
                        </button>
                    </form>
                </section>

                <div className="section-divider" />

                <section className="edit-section">
                    <h3 className="section-title">배송지 / 동네 정보</h3>
                    <p className="section-desc">배송지는 직접 입력하고, 같은 동네 공동구매를 위해 동 이름도 함께 저장해 주세요.</p>
                    <AddressForm
                        onChange={setAddress}
                        initialData={address}
                        showDong
                        hideSubmit
                    />
                </section>

                <div className="section-divider" />

                <section className="edit-section danger-zone">
                    <h3 className="section-title text-error">회원 탈퇴</h3>
                    <p className="section-desc">탈퇴 시 참여 중인 공동구매와 리뷰 내역을 다시 확인하기 어려울 수 있어요.</p>
                    <button className="btn btn-outline btn-error">탈퇴하기</button>
                </section>
            </div>

            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} type="success" />}
        </PageLayout>
    )
}
