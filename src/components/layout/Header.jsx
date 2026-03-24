// src/components/layout/Header.jsx
import { useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header({ title, showBack = false, showSearch = true, showCart = true }) {
    const navigate = useNavigate()

    return (
        <header className="header">
            <div className="header-left">
                {showBack ? (
                    <button className="header-icon-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
                        &#8592;
                    </button>
                ) : (
                    <button className="header-logo" onClick={() => navigate('/')}>
                        🥦 NutriShare
                    </button>
                )}
            </div>

            {title && <h1 className="header-title">{title}</h1>}

            <div className="header-right">
                {showSearch && (
                    <button
                        className="header-icon-btn"
                        onClick={() => navigate('/search')}
                        aria-label="검색"
                    >
                        🔍
                    </button>
                )}
                {showCart && (
                    <button
                        className="header-icon-btn"
                        onClick={() => navigate('/cart')}
                        aria-label="장바구니"
                    >
                        🛒
                    </button>
                )}
            </div>
        </header>
    )
}
