// src/components/common/LoadingSpinner.jsx
import './LoadingSpinner.css'

export default function LoadingSpinner({ fullScreen = false }) {
    if (fullScreen) {
        return (
            <div className="spinner-overlay">
                <div className="spinner" aria-label="로딩 중" />
            </div>
        )
    }
    return <div className="spinner" aria-label="로딩 중" />
}
