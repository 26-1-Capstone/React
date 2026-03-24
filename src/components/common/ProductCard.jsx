import './ProductCard.css'
import PriceDisplay from './PriceDisplay'
import { Link } from 'react-router-dom'

export default function ProductCard({ id, name, price, categoryName, imageUrl }) {
    return (
        <Link to={`/products/${id}`} className="product-card">
            <div className="product-card-image-wrapper">
                <img
                    src={imageUrl || 'https://via.placeholder.com/300x300?text=No+Image'}
                    alt={name}
                    className="product-card-image"
                    loading="lazy"
                />
                {categoryName && (
                    <span className="product-card-category">{categoryName}</span>
                )}
            </div>
            <div className="product-card-info">
                <h3 className="product-card-name" title={name}>{name}</h3>
                <div className="product-card-price">
                    <PriceDisplay value={price} />
                </div>
            </div>
        </Link>
    )
}
