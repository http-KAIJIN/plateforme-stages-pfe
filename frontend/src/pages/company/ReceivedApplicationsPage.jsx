import Button from '../../components/Button'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { applicationService } from '../../services/applicationService'

export default function ReceivedApplicationsPage() {
  const { data, setData, loading } = useApi(applicationService.list, [])

  const update = async (id, status) => {
    const updated = await applicationService.update(id, { status })
    setData(data.map((item) => (item.id === id ? updated : item)))
  }

  if (loading) return <p>Chargement...</p>
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-950">Candidatures reçues</h2>
      {data.length === 0 ? <EmptyState /> : data.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-slate-950">Etudiant #{item.student_id.slice(0, 8)}</p>
              <p className="text-sm text-slate-500">{item.cover_letter || 'Aucune lettre de motivation.'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} />
              <Button variant="secondary" onClick={() => update(item.id, 'accepted')}>Accepter</Button>
              <Button variant="danger" onClick={() => update(item.id, 'rejected')}>Refuser</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
