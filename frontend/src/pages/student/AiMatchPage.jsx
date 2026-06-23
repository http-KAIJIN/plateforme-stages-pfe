import { useState } from 'react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import { aiService } from '../../services/aiService'

export default function AiMatchPage() {
  const [file, setFile] = useState(null)
  const [offerText, setOfferText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    if (!file) return
    setLoading(true)
    try {
      setResult(await aiService.matchCv({ file, offerText }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
      <Card>
        <h2 className="text-2xl font-bold text-slate-950">Analyse CV ↔ Offre</h2>
        <p className="mt-2 text-sm text-slate-500">Deposez un CV PDF et collez une description d'offre.</p>
        <form className="mt-5 space-y-4" onSubmit={submit}>
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2" type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0])} />
          <textarea className="min-h-40 w-full rounded-xl border border-slate-200 p-3" placeholder="Description de l'offre..." value={offerText} onChange={(e) => setOfferText(e.target.value)} />
          <Button disabled={loading || !file}>{loading ? 'Analyse...' : 'Calculer compatibilite'}</Button>
        </form>
      </Card>
      <Card>
        <h3 className="font-bold text-slate-950">Resultat</h3>
        {!result ? <p className="mt-3 text-slate-500">Aucun resultat pour le moment.</p> : (
          <div className="mt-5 space-y-5">
            <div className="text-5xl font-bold text-primary-700">{result.compatibility} %</div>
            <div>
              <p className="font-semibold text-slate-900">Competences detectees</p>
              <p className="mt-2 text-sm text-slate-600">{result.detected_skills.join(', ') || 'Aucune'}</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Competences manquantes</p>
              <p className="mt-2 text-sm text-slate-600">{result.missing_skills.join(', ') || 'Aucune'}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
