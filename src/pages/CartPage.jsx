// src/pages/CartPage.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import PriceDisplay from '@/components/common/PriceDisplay'
import QuantitySelector from '@/components/common/QuantitySelector'
import EmptyState from '@/components/common/EmptyState'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import api from '@/lib/api'
import './CartPage.css'

export default function CartPage() {
    const navigate = useNavigate()
    const [cartItems, setCartItems] = useState([])
    const [totalAmount, setTotalAmount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    const fetchCart = async () => {
        setIsLoading(true)
        try {
            const response = await api.get('/cart')
            if (response.data.data) {
                setCartItems(response.data.data.items || [])
                setTotalAmount(response.data.data.totalAmount || 0)
            }
        } catch (error) {
            console.error('Failed to fetch cart', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const handleQuantityChange = async (productId, newQuantity) => {
        try {
            await api.put(`/cart/${productId}`, { quantity: newQuantity })
            fetchCart()
        } catch (error) {
            console.error('Failed to update cart item', error)
        }
    }

    const handleRemoveItem = async (productId) => {
        if (window.confirm('장바구니에서 삭제하시겠습니까?')) {
            try {
                await api.delete(`/cart/${productId}`)
                fetchCart()
            } catch (error) {
                console.error('Failed to remove cart item', error)
            }
        }
    }

    const handleCheckout = () => {
        // 장바구니 데이터를 주문/결제 화면으로 전달
        // To match existing mock structure temporarily if needed, mapping keys:
        const checkoutItems = cartItems.map(item => ({
            product: {
                id: item.productId,
                name: item.productName,
                price: item.typePrice
            },
            quantity: item.quantity
        }))
        navigate('/checkout', { state: { items: checkoutItems } })
    }

    if (isLoading) {
        return <PageLayout><div style={{ padding: '40px', textAlign: 'center' }}><LoadingSpinner /></div></PageLayout>
    }

    return (
        <PageLayout>
            <div className="cart-container">
                <h2 className="page-title">장바구니</h2>

                {cartItems.length === 0 ? (
                    <EmptyState
                        title="장바구니가 비어있습니다"
                        actionLabel="쇼핑하러 가기"
                        onAction={() => navigate('/')}
                    />
                ) : (
                    <>
                        <ul className="cart-list">
                            {cartItems.map(item => (
                                <li key={item.productId} className="cart-item">
                                    <div className="item-image-wrapper">
                                        <img src={'https://via.placeholder.com/100'} alt={item.productName} />
                                    </div>
                                    <div className="item-info">
                                        <div className="item-header">
                                            <h3 className="item-name">{item.productName}</h3>
                                            <button className="remove-btn" onClick={() => handleRemoveItem(item.productId)} aria-label="삭제">&times;</button>
                                        </div>
                                        <div className="item-price">
                                            <PriceDisplay value={item.typePrice} />
                                        </div>
                                        <div className="item-actions">
                                            <QuantitySelector
                                                value={item.quantity}
                                                max={99}
                                                onChange={(q) => handleQuantityChange(item.productId, q)}
                                            />
                                            <div className="item-subtotal">
                                                <PriceDisplay value={item.totalPrice} style={{ fontWeight: '700', color: 'var(--color-primary-dark)' }} />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="cart-summary-area">
                            <div className="summary-row">
                                <span>상품 금액</span>
                                <PriceDisplay value={totalAmount} />
                            </div>
                            <div className="summary-row">
                                <span>배송비</span>
                                <span>무료</span> {/* 공동구매 테마 강조 */}
                            </div>
                            <div className="summary-divider" />
                            <div className="summary-row total">
                                <span>결제 예상 금액</span>
                                <PriceDisplay value={totalAmount} className="total-val" />
                            </div>

                            <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
                                주문하기
                            </button>
                        </div>
                    </>
                )}
            </div>
        </PageLayout>
    )
}


