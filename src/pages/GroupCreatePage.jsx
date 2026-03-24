import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import Toast from '@/components/common/Toast'
import api from '@/lib/api'
import './GroupCreatePage.css'

export default function GroupCreatePage() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        productId: '',
        title: '',
        targetQuantity: '',
        dueDate: ''
    })
    const [toastMessage, setToastMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [productOptions, setProductOptions] = useState([])
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoadingProducts(true)
            try {
                const response = await api.get('/products', { params: { size: 100 } })
                setProductOptions(response.data.data.content || [])
            } catch (error) {
                console.error('Failed to load products for group creation', error)
            } finally {
                setIsLoadingProducts(false)
            }
        }

        fetchProducts()
    }, [])

    const selectedProduct = useMemo(
        () => productOptions.find((product) => product.id === Number(formData.productId)),
        [formData.productId, productOptions]
    )

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await api.post('/groups', {
                productId: parseInt(formData.productId),
                title: formData.title,
                targetQuantity: parseInt(formData.targetQuantity),
                unitPrice: selectedProduct?.price || 10000,
                endAt: new Date(formData.dueDate).toISOString()
            })

            setToastMessage('공동구매 모집이 시작되었습니다!')
            setTimeout(() => {
                navigate('/groups')
            }, 1000)
        } catch (error) {
            console.error('Failed to create group', error)
            alert('공동구매 생성에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageLayout>
            <div className="group-create-container">
                <div className="create-header">
                    <button className="back-btn" onClick={() => navigate(-1)}>&larr;</button>
                    <h2 className="page-title">공동구매 열기</h2>
                </div>
                <p className="page-desc">이웃과 나누고 싶은 생필품을 선택해 모집글을 작성해 보세요.</p>

                <form className="create-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">상품 선택 (필수)</label>
                        <select
                            className="form-input"
                            name="productId"
                            value={formData.productId}
                            onChange={handleChange}
                            required
                            disabled={isLoadingProducts}
                        >
                            <option value="">
                                {isLoadingProducts ? '상품 목록 불러오는 중...' : '공동구매할 상품을 선택하세요'}
                            </option>
                            {productOptions.map(prod => (
                                <option key={prod.id} value={prod.id}>
                                    {prod.name} (정상가: {prod.price.toLocaleString()}원)
                                </option>
                            ))}
                        </select>
                        <p className="form-hint">현재 시스템에 등록된 상품만 공동구매를 주최할 수 있습니다.</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">모집 제목 (필수)</label>
                        <input
                            type="text"
                            className="form-input"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="예) 마트보다 싼 라면 1박스 같이 사실 분!"
                            maxLength={50}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group flex-1">
                            <label className="form-label">목표 인원 (필수)</label>
                            <input
                                type="number"
                                className="form-input"
                                name="targetQuantity"
                                value={formData.targetQuantity}
                                onChange={handleChange}
                                placeholder="최소 10명 이상"
                                min={10}
                                max={500}
                                required
                            />
                        </div>
                        <div className="form-group flex-1">
                            <label className="form-label">마감일 (필수)</label>
                            <input
                                type="date"
                                className="form-input"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="create-guide-box">
                        <h4>💡 공동구매 주최 가이드</h4>
                        <ul>
                            <li>목표 인원을 달성해야만 할인된 가격으로 결제 및 배송이 확정됩니다.</li>
                            <li>마감일 이전에 인원이 모두 모이면 <b>즉시 결제</b>가 진행될 수 있습니다.</li>
                            <li>부적절한 내용이나 목적과 맞지 않는 글은 무통보 삭제될 수 있습니다.</li>
                        </ul>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? '진행 중...' : '모집 시작하기'}
                    </button>
                </form>
            </div>

            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} type="success" />}
        </PageLayout>
    )
}
