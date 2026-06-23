import { useForm } from 'react-hook-form'
import Button from '../../components/Button'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { stageService } from '../../services/stageService'

export default function CompanyStagesPage() {
  const { register, handleSubmit, reset } = useForm({ defaultValues: { stage_type: 'internship', status: 'published' } })
  const { data: stages, setData, loading } = useApi(stageService.list, [])

  const createStage = async (values) => {
    const created = await stageService.create(values)
    setData([created, ...stages])
    reset({ stage_type: 'internship', status: 'published' })
  }

  const deleteStage = async (id) => {
    await stageService.remove(id)
    setData(stages.filter((stage) => stage.id !== id))
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[380px_1fr]">
      <Card>
        <h2 className="text-xl font-bold text-slate-950">Créer une offre</h2>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit(createStage)}>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Titre" {...register('title', { required: true })} />
          <textarea className="min-h-28 w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Description" {...register('description', { required: true })} />
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Lieu" {...register('location')} />
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2" placeholder="Durée" {...register('duration')} />
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2" {...register('stage_type')}>
            <option value="internship">Stage</option>
            <option value="pfe">PFE</option>
            <option value="internship_or_pfe">Stage ou PFE</option>
          </select>
          <Button className="w-full">Publier</Button>
        </form>
      </Card>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-950">Mes offres</h2>
        {loading ? <p>Chargement...</p> : stages.length === 0 ? <EmptyState /> : stages.map((stage) => (
          <Card key={stage.id}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="font-bold text-slate-950">{stage.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">{stage.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={stage.status} />
                <Button variant="danger" onClick={() => deleteStage(stage.id)}>Supprimer</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
