import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { stageService } from '../../services/stageService'

export default function AdminStagesPage() {
  const { data, loading } = useApi(stageService.list, [])
  if (loading) return <p>Chargement...</p>
  return <div className="space-y-4"><h2 className="text-2xl font-bold text-slate-950">Gestion stages</h2>{data.length === 0 ? <EmptyState /> : data.map((stage) => <Card key={stage.id} className="flex justify-between"><span className="font-semibold">{stage.title}</span><StatusBadge status={stage.status} /></Card>)}</div>
}
