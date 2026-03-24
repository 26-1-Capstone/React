// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import PriceDisplay from '@/components/common/PriceDisplay'
import QuantitySelector from '@/components/common/QuantitySelector'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Toast from '@/components/common/Toast'
import api from '@/lib/api'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    // 로컬 상태
    const [quantity, setQuantity] = useState(1)
    const [toastMessage, setToastMessage] = useState('')

    useEffect(() => {
        const fetchProductDetail = async () => {
            setIsLoading(true)
            try {
                const response = await api.get(`/products/${id}`)
                setProduct(response.data.data)
            } catch (error) {
                console.error('Failed to fetch product details', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProductDetail()
    }, [id])

    const handleAddToCart = async () => {
        try {
            await api.post('/cart', {
                productId: product.id,
                quantity: quantity
            })
            setToastMessage(`장바구니에 ${quantity}개 담았습니다.`)
            setTimeout(() => setToastMessage(''), 3000)
        } catch (error) {
            console.error('Failed to add to cart', error)
            alert('장바구니 담기에 실패했습니다.')
        }
    }

    const handleBuyNow = () => {
        // 실제로는 결제 페이지로 상품 정보 넘기기
        navigate('/checkout', { state: { items: [{ product, quantity }] } })
    }

    if (isLoading) {
        return <PageLayout><div className="detail-loading"><LoadingSpinner /></div></PageLayout>
    }

    if (!product) {
        return (
            <PageLayout>
                <div className="detail-error">
                    <h2>존재하지 않는 상품입니다.</h2>
                    <button className="btn btn-primary" onClick={() => navigate(-1)}>뒤로 가기</button>
                </div>
            </PageLayout>
        )
    }

    const isSoldOut = product.stockQuantity === 0

    return (
        <PageLayout>
            <div className="product-detail-container">
                <div className="product-image-area">
                    <img
                        src={product.imageUrl || 'https://via.placeholder.com/400x400'}
                        alt={product.name}
                        className="product-detail-img"
                    />
                </div>

                <div className="product-info-area">
                    <span className="product-category-badge">{product.categoryName}</span>
                    <h1 className="product-name">{product.name}</h1>
                    <div className="product-price-row">
                        <PriceDisplay value={product.price} className="product-price-val" />
                    </div>

                    <div className="product-divider" />

                    <div className="product-description">
                        <p>NutriShare 공동구매를 통해 더욱 저렴하게 만나보세요.<br />신선하고 안전한 배송을 약속합니다.</p>
                    </div>

                    <div className="product-divider" />

                    <div className="product-purchase-options">
                        <div className="option-row">
                            <span className="option-label">수량</span>
                            {isSoldOut ? (
                                <span className="sold-out-text">품절</span>
                            ) : (
                                <QuantitySelector
                                    value={quantity}
                                    onChange={setQuantity}
                                    max={product.stockQuantity}
                                />
                            )}
                        </div>
                        <div className="total-price-row">
                            <span className="total-label">총 상품 금액</span>
                            <PriceDisplay
                                value={isSoldOut ? 0 : product.price * quantity}
                                className="total-val"
                            />
                        </div>
                    </div>
                </div>

                {/* Fixed Bottom Action Bar */}
                <div className="bottom-action-bar">
                    <button
                        className="btn btn-outline cart-btn"
                        onClick={handleAddToCart}
                        disabled={isSoldOut}
                    >
                        장바구니
                    </button>
                    <button
                        className="btn btn-primary buy-btn"
                        onClick={handleBuyNow}
                        disabled={isSoldOut}
                    >
                        {isSoldOut ? '품절' : '바로 구매'}
                    </button>
                </div>
            </div>

            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
        </PageLayout>
    )
}
