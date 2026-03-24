// src/pages/CheckoutPage.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import AddressForm from '@/components/common/AddressForm'
import PriceDisplay from '@/components/common/PriceDisplay'
import Toast from '@/components/common/Toast'
import api from '@/lib/api'
import './CheckoutPage.css'

export default function CheckoutPage() {
    const location = useLocation()
    const navigate = useNavigate()
    const checkoutItems = location.state?.items || []

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [addressData, setAddressData] = useState(null)
    const [initialAddress, setInitialAddress] = useState({})

    useEffect(() => {
        const fetchProfileAddress = async () => {
            try {
                const response = await api.get('/users/me')
                const savedAddress = response.data?.data?.address
                if (savedAddress) {
                    setInitialAddress({
                        zipcode: savedAddress.zipCode || '',
                        basicAddress: savedAddress.addressLine1 || '',
                        detailAddress: savedAddress.addressLine2 || ''
                    })
                }
            } catch (error) {
                console.error('Failed to prefill checkout address', error)
            }
        }

        fetchProfileAddress()
    }, [])

    const totalAmount = checkoutItems.reduce((acc, item) => {
        return acc + (item.product.price * item.quantity)
    }, 0)

    const handleAddressSubmit = (address) => {
        setAddressData(address)
        setToastMessage('배송지가 확인되었습니다. 결제 버튼을 눌러주세요.')
        setTimeout(() => setToastMessage(''), 3000)
    }

    const handlePaymentSubmit = async () => {
        if (!addressData) {
            setToastMessage('배송지를 먼저 저장해주세요.')
            setTimeout(() => setToastMessage(''), 3000)
            return
        }

        setIsSubmitting(true)
        try {
            const orderPayload = {
                shippingAddress: {
                    zipCode: addressData.zipcode,
                    line1: addressData.basicAddress,
                    line2: addressData.detailAddress
                },
                items: checkoutItems.map(item => ({
                    productId: item.product.id,
                    productName: item.product.name,
                    unitPrice: item.product.price,
                    quantity: item.quantity
                }))
            }

            const response = await api.post('/orders', orderPayload)
            const orderId = response.data.data.resourceId
            await api.post('/payments/confirm', {
                orderId,
                amount: totalAmount,
                paymentProvider: 'SIMULATED',
                providerPaymentKey: `simulated-${orderId}`
            })

            navigate(`/orders/${orderId}/complete`)
        } catch (error) {
            console.error('Failed to create order', error)
            alert('결제(주문)에 실패했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (checkoutItems.length === 0) {
        return (
            <PageLayout>
                <div className="checkout-empty">
                    <p>주문할 상품이 없습니다.</p>
                    <button className="btn btn-outline" onClick={() => navigate(-1)}>뒤로 가기</button>
                </div>
            </PageLayout>
        )
    }

    return (
        <PageLayout>
            <div className="checkout-container">
                <h2 className="page-title">주문 / 결제</h2>

                <section className="checkout-section">
                    <h3 className="section-title">주문 상품 정보</h3>
                    <ul className="checkout-item-list">
                        {checkoutItems.map((item, idx) => (
                            <li key={idx} className="checkout-item">
                                <span className="checkout-item-name">{item.product.name}</span>
                                <span className="checkout-item-qty">{item.quantity}개</span>
                                <div className="checkout-item-price">
                                    <PriceDisplay value={item.product.price * item.quantity} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                <section className="checkout-section">
                    <h3 className="section-title">배송지 입력</h3>
                    <p className="section-desc">이번 MVP에서는 택배 배송만 지원하며, 배송지는 직접 확인 후 결제해 주세요.</p>
                    <AddressForm
                        onSubmit={handleAddressSubmit}
                        initialData={initialAddress}
                        isSubmitting={false}
                        submitLabel="배송지 확인"
                    />
                </section>

                <section className="checkout-section summary-section">
                    <h3 className="section-title">결제 요약</h3>
                    <div className="summary-details">
                        <div className="summary-row">
                            <span>상품 총액</span>
                            <PriceDisplay value={totalAmount} />
                        </div>
                        <div className="summary-row">
                            <span>배송비</span>
                            <span>무료 (공동구매 특가)</span>
                        </div>
                        <div className="summary-divider" />
                        <div className="summary-row total">
                            <span>최종 결제 금액</span>
                            <PriceDisplay value={totalAmount} className="total-val" />
                        </div>
                    </div>
                </section>

                <button
                    className="btn btn-primary payment-btn"
                    onClick={handlePaymentSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '결제 진행 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
                </button>
            </div>

            {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}
        </PageLayout>
    )
}
