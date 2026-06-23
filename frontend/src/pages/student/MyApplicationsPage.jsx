import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { applicationService } from '../../services/applicationService'

export default function MyApplicationsPage() {
  const { data, loading } = useApi(applicationService.list, [])
  if (loading) return <p>Chargement...</p>
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-950">Mes candidatures</h2>
      {data.length === 0 ? <EmptyState /> : data.map((item) => (
        <Card key={item.id} className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-950">Candidature #{item.id.slice(0, 8)}</p>
            <p className="text-sm text-slate-500">Soumise le {new Date(item.submitted_at).toLocaleDateString()}</p>
          </div>
          <StatusBadge status={item.status} />
        </Card>
      ))}
    </div>
  )
}
