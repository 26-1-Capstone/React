// src/pages/HomePage.jsx
import { useState, useEffect } from 'react'
import PageLayout from '@/components/layout/PageLayout'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ProductCard from '@/components/common/ProductCard'
import api from '@/lib/api'
import './HomePage.css'

export default function HomePage() {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                // Fetch first page of products (size 10 for home page display)
                const response = await api.get('/products', {
                    params: { size: 10 }
                })
                setProducts(response.data.data.content)
            } catch (error) {
                console.error('Failed to load products', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <PageLayout>
            <div className="home-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <div className="hero-text-area">
                            <h1 className="hero-title">득템 찬스!<br />함께 사면 배송비 0원</h1>
                            <p className="hero-subtitle">NutriShare 생필품 공동구매로<br />생활비를 절약하세요.</p>
                            <button className="btn btn-primary hero-btn">특가 상품 보기</button>
                        </div>
                        <div className="hero-image-area">
                            <img src="/images/hero_grocery_banner.png" alt="식료품 쇼핑 바스켓" className="hero-banner-img" />
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="product-section">
                    <div className="section-header">
                        <h2 className="section-title">🛒 이번주 특가 공동구매</h2>
                        <select className="sort-select">
                            <option>최신순</option>
                            <option>가격 낮은순</option>
                            <option>가격 높은순</option>
                        </select>
                    </div>

                    <div className="product-grid">
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                            products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    imageUrl={product.imageUrl}
                                    categoryName={product.categoryName}
                                />
                            ))
                        )}
                    </div>
                </section>
            </div>
        </PageLayout>
    )
}
