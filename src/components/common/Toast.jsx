import './Toast.css'

export default function Toast({ message, type = 'success', onClose }) {
    if (!message) return null

    return (
        <div className={`toast toast-${type}`}>
            <span className="toast-message">{message}</span>
            {onClose && (
                <button className="toast-close" onClick={onClose} aria-label="닫기">
                    &times;
                </button>
            )}
        </div>
    )
}
