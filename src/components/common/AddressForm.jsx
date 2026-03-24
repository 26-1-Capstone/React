import { useEffect, useState } from 'react'
import './AddressForm.css'

const buildAddressState = (initialData = {}) => ({
    zipcode: initialData.zipcode || '',
    basicAddress: initialData.basicAddress || '',
    detailAddress: initialData.detailAddress || '',
    dong: initialData.dong || ''
})

export default function AddressForm({
    initialData = {},
    onSubmit,
    onChange,
    isSubmitting = false,
    showDong = false,
    hideSubmit = false,
    submitLabel = '배송지 저장'
}) {
    const [address, setAddress] = useState(buildAddressState(initialData))

    useEffect(() => {
        setAddress(buildAddressState(initialData))
    }, [initialData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setAddress((prev) => {
            const nextAddress = { ...prev, [name]: value }
            onChange?.(nextAddress)
            return nextAddress
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSubmit?.(address)
    }

    return (
        <form className="address-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">우편번호</label>
                <input
                    type="text"
                    className="form-input"
                    name="zipcode"
                    value={address.zipcode}
                    onChange={handleChange}
                    placeholder="예: 06236"
                    required
                />
            </div>

            <div className="form-group">
                <label className="form-label">기본 주소</label>
                <input
                    type="text"
                    className="form-input"
                    name="basicAddress"
                    value={address.basicAddress}
                    onChange={handleChange}
                    placeholder="예: 서울 강남구 테헤란로 152"
                    required
                />
            </div>

            {showDong && (
                <div className="form-group">
                    <label className="form-label">동네(동)</label>
                    <input
                        type="text"
                        className="form-input"
                        name="dong"
                        value={address.dong}
                        onChange={handleChange}
                        placeholder="예: 역삼동"
                        maxLength={30}
                        required
                    />
                    <p className="form-help">외부 주소 검색 없이, 같은 동네 공동구매를 구분할 동 이름만 직접 입력해 주세요.</p>
                </div>
            )}

            <div className="form-group">
                <label className="form-label">상세 주소</label>
                <input
                    type="text"
                    className="form-input"
                    name="detailAddress"
                    value={address.detailAddress}
                    onChange={handleChange}
                    placeholder="나머지 상세 주소를 입력해주세요"
                    maxLength={100}
                />
            </div>

            {!hideSubmit && (
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : submitLabel}
                </button>
            )}
        </form>
    )
}
