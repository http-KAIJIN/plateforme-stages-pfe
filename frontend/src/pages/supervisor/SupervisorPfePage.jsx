import Button from '../../components/Button'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { pfeService } from '../../services/pfeService'

export default function SupervisorPfePage() {
  const { data, setData, loading } = useApi(pfeService.list, [])

  const validate = async (id) => {
    const updated = await pfeService.update(id, { status: 'approved' })
    setData(data.map((item) => (item.id === id ? updated : item)))
  }

  if (loading) return <p>Chargement...</p>
  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-slate-950">Suivi PFE</h2>
      {data.length === 0 ? <EmptyState /> : data.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="font-bold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.description}</p>
              <textarea className="mt-4 min-h-20 w-full rounded-xl border border-slate-200 p-3" placeholder="Commentaires de suivi..." />
            </div>
            <div className="flex shrink-0 flex-col gap-2">
              <StatusBadge status={item.status} />
              <Button variant="secondary" onClick={() => validate(item.id)}>Valider</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
