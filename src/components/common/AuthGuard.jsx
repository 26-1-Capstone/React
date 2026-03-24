// src/components/common/AuthGuard.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { authStorage } from '@/lib/auth'

export default function AuthGuard() {
    if (!authStorage.isAuthenticated()) {
        return <Navigate to="/login" replace />
    }
    return <Outlet />
}
