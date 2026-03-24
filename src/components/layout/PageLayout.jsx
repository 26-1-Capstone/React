// src/components/layout/PageLayout.jsx
import Header from './Header'
import BottomNav from './BottomNav'

/**
 * 표준 페이지 레이아웃:
 *   - 상단 고정 Header
 *   - 스크롤 가능한 콘텐츠 영역
 *   - 하단 고정 BottomNav
 *
 * @param {string}  title     - 헤더 중앙 타이틀 (없으면 로고)
 * @param {boolean} showBack  - 뒤로가기 버튼 표시 여부
 * @param {boolean} showSearch
 * @param {boolean} showCart
 * @param {boolean} showNav   - BottomNav 표시 여부 (기본 true)
 */
export default function PageLayout({
    children,
    title,
    showBack = false,
    showSearch = true,
    showCart = true,
    showNav = true,
}) {
    return (
        <>
            <Header
                title={title}
                showBack={showBack}
                showSearch={showSearch}
                showCart={showCart}
            />
            <main className="page-content">
                {children}
            </main>
            {showNav && <BottomNav />}
        </>
    )
}
