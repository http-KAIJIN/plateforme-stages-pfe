import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import StatusBadge from '../../components/StatusBadge'
import { useApi } from '../../hooks/useApi'
import { pfeService } from '../../services/pfeService'
import { reportService } from '../../services/reportService'

export default function MyPfePage() {
  const { data: projects, loading } = useApi(pfeService.list, [])
  const { data: reports, setData: setReports } = useApi(reportService.list, [])
  const project = projects[0]
  if (loading) return <p>Chargement...</p>
  if (!project) return <EmptyState title="Aucun PFE affecte" description="Votre PFE apparaitra ici apres affectation." />

  const upload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const uploaded = await reportService.upload(project.id, file)
    setReports([uploaded, ...reports])
    event.target.value = ''
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">{project.title}</h2>
            <p className="mt-2 text-slate-600">{project.description}</p>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <div className="mt-5 h-3 rounded-full bg-slate-100">
          <div className="h-3 w-1/2 rounded-full bg-primary-600" />
        </div>
      </Card>
      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="font-bold text-slate-950">Rapports deposes</h3>
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700">
            <input className="hidden" type="file" onChange={upload} />
            Uploader rapport
          </label>
        </div>
        <div className="mt-4 space-y-3">
          {reports.length === 0 ? <p className="text-sm text-slate-500">Aucun rapport.</p> : reports.map((report) => <a key={report.id} className="block text-primary-700" href={reportService.downloadUrl(report.id)}>{report.filename}</a>)}
        </div>
      </Card>
    </div>
  )
}
