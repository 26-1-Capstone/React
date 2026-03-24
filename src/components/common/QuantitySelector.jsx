import './QuantitySelector.css'

export default function QuantitySelector({ value = 1, min = 1, max = 99, onChange }) {
    const handleDecrease = (e) => {
        e.preventDefault();
        if (value > min) onChange(value - 1);
    };

    const handleIncrease = (e) => {
        e.preventDefault();
        if (value < max) onChange(value + 1);
    };

    return (
        <div className="quantity-selector">
            <button
                type="button"
                className="quantity-btn"
                onClick={handleDecrease}
                disabled={value <= min}
                aria-label="수량 감소"
            >
                −
            </button>
            <span className="quantity-val">{value}</span>
            <button
                type="button"
                className="quantity-btn"
                onClick={handleIncrease}
                disabled={value >= max}
                aria-label="수량 증가"
            >
                +
            </button>
        </div>
    )
}
