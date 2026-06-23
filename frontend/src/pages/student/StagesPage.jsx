import { Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { stageService } from '../../services/stageService'

export default function StagesPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const { data: stages, loading } = useApi(stageService.list, [])
  const filtered = stages.filter((stage) => {
    const matchesSearch = `${stage.title} ${stage.description} ${stage.location || ''}`.toLowerCase().includes(search.toLowerCase())
    const matchesType = type === 'all' || stage.stage_type === type
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Offres de stage</h2>
        <p className="text-slate-500">Recherchez et filtrez les opportunites disponibles.</p>
      </div>
      <Card className="flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input className="w-full outline-none" placeholder="Recherche par titre, description, ville..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="rounded-xl border border-slate-200 px-3 py-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">Tous</option>
          <option value="internship">Stage</option>
          <option value="pfe">PFE</option>
          <option value="internship_or_pfe">Stage ou PFE</option>
        </select>
      </Card>
      {loading ? <p>Chargement...</p> : filtered.length === 0 ? <EmptyState /> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((stage) => (
            <Link key={stage.id} to={`/student/stages/${stage.id}`}>
              <Card className="h-full transition hover:-translate-y-1 hover:border-primary-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-950">{stage.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">{stage.description}</p>
                  </div>
                  <StatusBadge status={stage.status} />
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{stage.location || 'Remote/Non precise'}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">{stage.duration || 'Duree non precisee'}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
