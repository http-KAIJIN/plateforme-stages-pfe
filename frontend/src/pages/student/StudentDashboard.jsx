import { Briefcase, ClipboardList, GraduationCap } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatCard from '../../components/StatCard'
import { useApi } from '../../hooks/useApi'
import { applicationService } from '../../services/applicationService'
import { pfeService } from '../../services/pfeService'

export default function StudentDashboard() {
  const { data: applications } = useApi(applicationService.list, [])
  const { data: pfe } = useApi(pfeService.list, [])
  const activePfe = pfe.find((item) => item.status === 'in_progress' || item.status === 'approved')
  const byStatus = ['submitted', 'accepted', 'rejected'].map((status) => ({ name: status, value: applications.filter((item) => item.status === status).length }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Dashboard Etudiant</h2>
        <p className="text-slate-500">Suivez vos candidatures et votre projet PFE.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Candidatures" value={applications.length} icon={ClipboardList} />
        <StatCard title="PFE en cours" value={activePfe ? 1 : 0} icon={GraduationCap} tone="green" />
        <StatCard title="Offres consultees" value="--" icon={Briefcase} tone="amber" />
      </div>
      <Card>
        <h3 className="mb-4 font-bold text-slate-950">Statut des candidatures</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={byStatus}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </Card>
      <EmptyState title="Dernieres notifications" description="Les notifications seront ajoutees dans une prochaine iteration." />
    </div>
  )
}
