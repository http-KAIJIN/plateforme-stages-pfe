import { Briefcase, ClipboardList, GraduationCap, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../../components/Card'
import StatCard from '../../components/StatCard'
import { useApi } from '../../hooks/useApi'
import { applicationService } from '../../services/applicationService'
import { pfeService } from '../../services/pfeService'
import { stageService } from '../../services/stageService'
import { userService } from '../../services/userService'

export default function AdminDashboard() {
  const { data: stages } = useApi(stageService.list, [])
  const { data: applications } = useApi(applicationService.list, [])
  const { data: pfe } = useApi(pfeService.list, [])
  const { data: users } = useApi(() => userService.list(), [])
  const usersByRole = ['student', 'company', 'supervisor', 'admin'].map((role) => ({ name: role, value: users.filter((user) => user.role === role).length }))
  const totals = [{ name: 'Stages', value: stages.length }, { name: 'Candidatures', value: applications.length }, { name: 'PFE', value: pfe.length }]
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-950">Dashboard Admin</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Utilisateurs" value={users.length} icon={Users} />
        <StatCard title="Stages" value={stages.length} icon={Briefcase} tone="green" />
        <StatCard title="Candidatures" value={applications.length} icon={ClipboardList} tone="amber" />
        <StatCard title="PFE" value={pfe.length} icon={GraduationCap} tone="violet" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 font-bold text-slate-950">Utilisateurs par role</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart><Pie data={usersByRole} dataKey="value" nameKey="name" outerRadius={90} label>{usersByRole.map((_, index) => <Cell key={index} fill={['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'][index]} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </Card>
        <Card>
          <h3 className="mb-4 font-bold text-slate-950">Volumes plateforme</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={totals}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  )
}
