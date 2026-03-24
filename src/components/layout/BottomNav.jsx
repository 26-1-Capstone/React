// src/components/layout/BottomNav.jsx
import { NavLink } from 'react-router-dom'
import { authStorage } from '@/lib/auth'
import './BottomNav.css'

const navItems = [
    { to: '/', label: '홈', icon: '🏠', requireAuth: false },
    { to: '/groups', label: '공동구매', icon: '🤝', requireAuth: false },
    { to: '/cart', label: '장바구니', icon: '🛒', requireAuth: true },
    { to: '/mypage', label: 'MY', icon: '👤', requireAuth: true },
]

export default function BottomNav() {
    const isAuthenticated = authStorage.isAuthenticated()

    return (
        <nav className="bottom-nav" aria-label="메인 네비게이션">
            {navItems.map(({ to, label, icon, requireAuth }) => {
                const target = requireAuth && !isAuthenticated ? '/login' : to
                return (
                    <NavLink
                        key={to}
                        to={target}
                        className={({ isActive }) =>
                            `bottom-nav-item ${isActive && to === target ? 'active' : ''}`
                        }
                    >
                        <span className="bottom-nav-icon">{icon}</span>
                        <span className="bottom-nav-label">{label}</span>
                    </NavLink>
                )
            })}
        </nav>
    )
}
