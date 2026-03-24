// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageLayout from '@/components/layout/PageLayout'
import ProductCard from '@/components/common/ProductCard'
import EmptyState from '@/components/common/EmptyState'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import api from '@/lib/api'
import './SearchPage.css'

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const query = searchParams.get('q') || ''
    const [inputValue, setInputValue] = useState(query)

    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!query) {
            setResults([])
            return
        }

        const fetchSearchResults = async () => {
            setIsLoading(true)
            try {
                const response = await api.get('/products/search', {
                    params: { q: query, size: 50 }
                })
                setResults(response.data.data.content)
            } catch (error) {
                console.error('Failed to search products', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSearchResults()
    }, [query])

    const handleSearch = (e) => {
        e.preventDefault()
        if (inputValue.trim()) {
            setSearchParams({ q: inputValue.trim() })
        }
    }

    return (
        <PageLayout>
            <div className="search-container">
                <div className="search-header">
                    <form className="search-form" onSubmit={handleSearch}>
                        <input
                            type="search"
                            className="search-input"
                            placeholder="찾으시는 상품을 입력하세요"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="search-submit-btn">검색</button>
                    </form>
                </div>

                <div className="search-results-area">
                    {isLoading ? (
                        <div className="search-loading"><LoadingSpinner /></div>
                    ) : query && results.length > 0 ? (
                        <>
                            <p className="search-summary">
                                <b>'{query}'</b> 검색 결과 {results.length}건
                            </p>
                            <div className="product-grid">
                                {results.map(product => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        price={product.price}
                                        imageUrl={product.imageUrl}
                                        categoryName={product.categoryName}
                                    />
                                ))}
                            </div>
                        </>
                    ) : query && results.length === 0 ? (
                        <EmptyState
                            title="검색 결과가 없습니다."
                            description="다른 검색어 필터를 사용해 보세요."
                        />
                    ) : (
                        <div className="search-idle">
                            <p>검색어를 입력해 맛있는 생필품을 찾아보세요!</p>
                        </div>
                    )}
                </div>
            </div>
        </PageLayout>
    )
}
