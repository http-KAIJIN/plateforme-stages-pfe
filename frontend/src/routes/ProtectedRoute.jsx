import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ roles }) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated()) return <Navigate to="/login" replace />
  if (roles?.length && !roles.includes(user?.role)) return <Navigate to="/login" replace />

  return <Outlet />
}
