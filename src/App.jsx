// src/App.jsx — 전체 라우팅 구성

import { Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from '@/components/common/AuthGuard'
import LoginCallback from '@/pages/LoginCallback'

// 화면 (lazy import for code splitting)
import { lazy, Suspense } from 'react'
import LoadingSpinner from '@/components/common/LoadingSpinner'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const HomePage = lazy(() => import('@/pages/HomePage'))
const SearchPage = lazy(() => import('@/pages/SearchPage'))
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'))
const CartPage = lazy(() => import('@/pages/CartPage'))
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'))
const OrderCompletePage = lazy(() => import('@/pages/OrderCompletePage'))
const MyPage = lazy(() => import('@/pages/MyPage'))
const ProfileEditPage = lazy(() => import('@/pages/ProfileEditPage'))
const GroupListPage = lazy(() => import('@/pages/GroupListPage'))
const GroupCreatePage = lazy(() => import('@/pages/GroupCreatePage'))
const GroupDetailPage = lazy(() => import('@/pages/GroupDetailPage'))

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <Routes>
        {/* 공개 라우트 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/groups" element={<GroupListPage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />

        {/* 인증 필요 라우트 */}
        <Route element={<AuthGuard />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders/:id/complete" element={<OrderCompletePage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/mypage/edit" element={<ProfileEditPage />} />
          <Route path="/groups/new" element={<GroupCreatePage />} />
        </Route>

        {/* 폴백 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

