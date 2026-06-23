import { GraduationCap } from 'lucide-react'

export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_520px]">
      <section className="hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3 text-xl font-bold">
          <div className="rounded-2xl bg-white/15 p-3 backdrop-blur">
            <GraduationCap className="h-8 w-8" />
          </div>
          Stagio
        </div>
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">Stagio</p>
          <h1 className="max-w-2xl text-5xl font-bold leading-tight">Plateforme intelligente de gestion des stages et PFE.</h1>
          <p className="mt-6 max-w-xl text-lg text-blue-100">Une experience simple inspiree des plateformes d'emploi modernes pour connecter etudiants, entreprises et encadrants.</p>
        </div>
        <p className="text-sm text-blue-100">FastAPI + React + PostgreSQL</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  )
}
