import './GroupBuyingCard.css'
import ProgressBar from './ProgressBar'
import PriceDisplay from './PriceDisplay'
import { Link } from 'react-router-dom'

export default function GroupBuyingCard({
    id,
    title,
    productName,
    typePrice,
    targetQuantity,
    currentQuantity,
    dueDate,
    dong,
    userDong
}) {
    const isClosingSoon = new Date(dueDate) - new Date() < 1000 * 60 * 60 * 24 * 3
    const isSameDong = dong && userDong && dong === userDong

    return (
        <Link to={`/groups/${id}`} className="group-card">
            <div className="group-card-header">
                <div className="group-card-badges">
                    {isClosingSoon && <span className="badge-urgent">마감임박</span>}
                    {isSameDong && <span className="badge-local">같은 동네</span>}
                </div>
                <h3 className="group-card-title">{title}</h3>
            </div>

            <div className="group-card-body">
                <p className="group-card-product">{productName}</p>
                {dong && <p className="group-card-dong">📍 {dong}</p>}
                <div className="group-card-price-row">
                    <span className="price-label">공동구매가</span>
                    <PriceDisplay value={typePrice} style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: 'var(--font-size-lg)' }} />
                </div>

                <div className="group-card-progress">
                    <div className="progress-labels">
                        <span className="current-qty">현재 <b>{currentQuantity}</b>명 참여</span>
                        <span className="target-qty">목표 {targetQuantity}명</span>
                    </div>
                    <ProgressBar value={currentQuantity} max={targetQuantity} />
                </div>
            </div>
        </Link>
    )
}
