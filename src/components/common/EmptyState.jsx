import './EmptyState.css'

export default function EmptyState({
    iconUrl = '/images/empty_cart_illustration.png',
    title = '내역이 없습니다',
    description,
    actionLabel,
    onAction
}) {
    return (
        <div className="empty-state">
            <img src={iconUrl} alt="Empty State" className="empty-state-icon" loading="lazy" />
            <h3 className="empty-state-title">{title}</h3>
            {description && <p className="empty-state-desc">{description}</p>}
            {actionLabel && onAction && (
                <button className="btn btn-primary empty-state-btn" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </div>
    )
}
