import { LogOut, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import NotificationsBell from '../components/NotificationsBell'
import { useAuthStore } from '../store/authStore'
import { roleLabel } from '../utils/auth'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="ml-12 lg:ml-0">
          <p className="text-sm text-slate-500">Stagio - Plateforme intelligente de gestion des stages et PFE</p>
          <h1 className="text-xl font-bold text-slate-950">{roleLabel(user?.role)}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-400">Recherche globale</span>
          </div>
          <NotificationsBell />
          <Button
            variant="secondary"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
