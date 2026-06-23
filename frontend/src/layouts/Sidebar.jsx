import { BrainCircuit, Briefcase, Building2, ClipboardList, FileText, GraduationCap, Home, Menu, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { roleLabel } from '../utils/auth'

const links = {
  student: [
    { to: '/student', label: 'Dashboard', icon: Home },
    { to: '/student/stages', label: 'Stages', icon: Briefcase },
    { to: '/student/applications', label: 'Candidatures', icon: ClipboardList },
    { to: '/student/pfe', label: 'Mon PFE', icon: GraduationCap },
    { to: '/student/ai', label: 'Analyse CV', icon: BrainCircuit },
  ],
  company: [
    { to: '/company', label: 'Dashboard', icon: Home },
    { to: '/company/stages', label: 'Mes offres', icon: Briefcase },
    { to: '/company/applications', label: 'Candidatures', icon: ClipboardList },
  ],
  supervisor: [
    { to: '/supervisor', label: 'Dashboard', icon: Home },
    { to: '/supervisor/pfe', label: 'Suivi PFE', icon: GraduationCap },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/users', label: 'Utilisateurs', icon: Users },
    { to: '/admin/stages', label: 'Stages', icon: Briefcase },
    { to: '/admin/pfe', label: 'PFE', icon: FileText },
  ],
}

export default function Sidebar({ open, onClose, onToggle }) {
  const user = useAuthStore((state) => state.user)
  const navLinks = links[user?.role] || []

  return (
    <>
      <button className="fixed left-4 top-4 z-40 rounded-xl bg-white p-2 shadow-soft lg:hidden" onClick={onToggle}>
        <Menu className="h-5 w-5" />
      </button>
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-200 bg-white p-5 transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary-600 p-3 text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-bold text-slate-950">Stages PFE</p>
              <p className="text-xs text-slate-500">{roleLabel(user?.role)}</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="space-y-2">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'}`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {open && <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" onClick={onClose} />}
    </>
  )
}
