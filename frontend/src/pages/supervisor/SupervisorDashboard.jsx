import { GraduationCap, Users } from 'lucide-react'
import StatCard from '../../components/StatCard'
import { useApi } from '../../hooks/useApi'
import { pfeService } from '../../services/pfeService'

export default function SupervisorDashboard() {
  const { data } = useApi(pfeService.list, [])
  const students = new Set(data.map((item) => item.student_id))
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-950">Dashboard Encadrant</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Etudiants encadres" value={students.size} icon={Users} />
        <StatCard title="PFE suivis" value={data.length} icon={GraduationCap} tone="green" />
      </div>
    </div>
  )
}
