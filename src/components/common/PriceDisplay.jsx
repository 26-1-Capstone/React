export default function PriceDisplay({ value, style }) {
    if (value === undefined || value === null) return null;

    const formattedPrice = Number(value).toLocaleString();

    return (
        <span style={style}>
            {formattedPrice}원
        </span>
    )
}
