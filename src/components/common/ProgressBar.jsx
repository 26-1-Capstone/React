import './ProgressBar.css'

export default function ProgressBar({ value = 0, max = 100 }) {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    return (
        <div className="progress-bar-container">
            <div
                className="progress-bar-fill"
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={max}
            />
        </div>
    )
}
