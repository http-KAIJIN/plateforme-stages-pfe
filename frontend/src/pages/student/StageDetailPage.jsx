import { Calendar, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { applicationService } from '../../services/applicationService'
import { stageService } from '../../services/stageService'

export default function StageDetailPage() {
  const { id } = useParams()
  const [message, setMessage] = useState('')
  const { data: stage, loading } = useApi(() => stageService.get(id), [id])

  const apply = async () => {
    await applicationService.create({ stage_id: id, cover_letter: message || null })
    setMessage('Candidature envoyee avec succes.')
  }

  if (loading) return <p>Chargement...</p>

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <StatusBadge status={stage.status} />
            <h2 className="mt-4 text-3xl font-bold text-slate-950">{stage.title}</h2>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{stage.location || 'Lieu non precise'}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{stage.deadline || 'Date limite non precisee'}</span>
            </div>
          </div>
          <Button onClick={apply}>Postuler</Button>
        </div>
      </Card>
      <Card>
        <h3 className="font-bold text-slate-950">Description</h3>
        <p className="mt-3 whitespace-pre-line text-slate-600">{stage.description}</p>
        {stage.requirements && <p className="mt-4 text-slate-600"><strong>Competences :</strong> {stage.requirements}</p>}
      </Card>
      <Card>
        <label className="text-sm font-semibold text-slate-700">Message de candidature</label>
        <textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-primary-600" value={message} onChange={(e) => setMessage(e.target.value)} />
      </Card>
    </div>
  )
}
