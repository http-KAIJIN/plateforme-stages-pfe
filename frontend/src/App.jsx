import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPfePage from './pages/admin/AdminPfePage'
import AdminStagesPage from './pages/admin/AdminStagesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import CompanyDashboard from './pages/company/CompanyDashboard'
import CompanyStagesPage from './pages/company/CompanyStagesPage'
import ReceivedApplicationsPage from './pages/company/ReceivedApplicationsPage'
import StageDetailPage from './pages/student/StageDetailPage'
import StagesPage from './pages/student/StagesPage'
import AiMatchPage from './pages/student/AiMatchPage'
import MyApplicationsPage from './pages/student/MyApplicationsPage'
import MyPfePage from './pages/student/MyPfePage'
import StudentDashboard from './pages/student/StudentDashboard'
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard'
import SupervisorPfePage from './pages/supervisor/SupervisorPfePage'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuthStore } from './store/authStore'

function RootRedirect() {
  const { user, isAuthenticated } = useAuthStore()
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <Navigate to={`/${user?.role || 'student'}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute roles={['student']} />}>
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<StudentDashboard />} />
          <Route path="stages" element={<StagesPage />} />
          <Route path="stages/:id" element={<StageDetailPage />} />
          <Route path="applications" element={<MyApplicationsPage />} />
          <Route path="pfe" element={<MyPfePage />} />
          <Route path="ai" element={<AiMatchPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['company']} />}>
        <Route path="/company" element={<DashboardLayout />}>
          <Route index element={<CompanyDashboard />} />
          <Route path="stages" element={<CompanyStagesPage />} />
          <Route path="applications" element={<ReceivedApplicationsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['supervisor']} />}>
        <Route path="/supervisor" element={<DashboardLayout />}>
          <Route index element={<SupervisorDashboard />} />
          <Route path="pfe" element={<SupervisorPfePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute roles={['admin']} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="stages" element={<AdminStagesPage />} />
          <Route path="pfe" element={<AdminPfePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
