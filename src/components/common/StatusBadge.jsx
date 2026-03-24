import './StatusBadge.css'

export default function StatusBadge({ status = 'default', label }) {
    return (
        <span className={`status-badge status-badge-${status}`}>
            {label}
        </span>
    )
}
