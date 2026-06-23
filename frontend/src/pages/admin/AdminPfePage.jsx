import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { pfeService } from '../../services/pfeService'

export default function AdminPfePage() {
  const { data, loading } = useApi(pfeService.list, [])
  if (loading) return <p>Chargement...</p>
  return <div className="space-y-4"><h2 className="text-2xl font-bold text-slate-950">Gestion PFE</h2>{data.length === 0 ? <EmptyState /> : data.map((pfe) => <Card key={pfe.id} className="flex justify-between"><span className="font-semibold">{pfe.title}</span><StatusBadge status={pfe.status} /></Card>)}</div>
}
