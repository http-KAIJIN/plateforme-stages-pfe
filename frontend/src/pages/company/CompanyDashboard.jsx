import { Briefcase, ClipboardList } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Card from '../../components/Card'
import StatCard from '../../components/StatCard'
import { useApi } from '../../hooks/useApi'
import { applicationService } from '../../services/applicationService'
import { stageService } from '../../services/stageService'

export default function CompanyDashboard() {
  const { data: stages } = useApi(stageService.list, [])
  const { data: applications } = useApi(applicationService.list, [])
  const chart = [{ name: 'Stages actifs', value: stages.filter((stage) => stage.status === 'published').length }, { name: 'Candidatures', value: applications.length }]
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-950">Dashboard Entreprise</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Mes stages" value={stages.length} icon={Briefcase} />
        <StatCard title="Candidatures recues" value={applications.length} icon={ClipboardList} tone="green" />
      </div>
      <Card>
        <h3 className="mb-4 font-bold text-slate-950">Activite entreprise</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} /></BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
