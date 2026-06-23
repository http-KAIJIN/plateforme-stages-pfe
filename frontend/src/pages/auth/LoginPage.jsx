import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AlertCircle, GraduationCap, Lock, Mail } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const homeByRole = {
  student: '/student',
  company: '/company',
  supervisor: '/supervisor',
  admin: '/admin',
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    const user = await login(values)
    navigate(homeByRole[user.role] || '/student')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70 lg:grid-cols-[1fr_480px]">
          <section className="hidden bg-gradient-to-br from-primary-900 via-primary-700 to-primary-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/20">
                <GraduationCap className="h-8 w-8" />
              </div>
              <div>
                <p className="text-lg font-bold">Stages & PFE</p>
                <p className="text-sm text-blue-100">Plateforme universitaire</p>
              </div>
            </div>
            <div>
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Centralisation</p>
              <h1 className="max-w-xl text-4xl font-bold leading-tight">Connectez etudiants, entreprises et encadrants dans un espace unique.</h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-blue-100">Suivi des offres, candidatures, PFE, rapports et notifications avec une interface claire et responsive.</p>
            </div>
            <p className="text-sm text-blue-100">React + FastAPI + PostgreSQL</p>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="rounded-2xl bg-primary-600 p-3 text-white">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-950">Stages & PFE</p>
                <p className="text-sm text-slate-500">Connexion securisee</p>
              </div>
            </div>

            <div className="mx-auto max-w-sm">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-700">Bienvenue</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-950">Connexion</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">Entrez vos identifiants pour acceder a votre espace.</p>
              </div>

              <form className="space-y-5" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="email">Adresse email</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-primary-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-100">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <input
                      id="email"
                      className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                      type="email"
                      placeholder="Adresse email"
                      autoComplete="off"
                      {...register('email', { required: 'Email obligatoire' })}
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm font-medium text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">Mot de passe</label>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-primary-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-100">
                    <Lock className="h-5 w-5 text-slate-400" />
                    <input
                      id="password"
                      className="w-full bg-transparent text-slate-950 outline-none placeholder:text-slate-400"
                      type="password"
                      placeholder="Votre mot de passe"
                      autoComplete="new-password"
                      {...register('password', { required: 'Mot de passe obligatoire' })}
                    />
                  </div>
                  {errors.password && <p className="mt-2 text-sm font-medium text-red-600">{errors.password.message}</p>}
                </div>

                {error && (
                  <div className="flex gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  className="w-full rounded-2xl bg-primary-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-100 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Pas encore de compte ? <Link className="font-bold text-primary-700 hover:text-primary-900" to="/register">Créer un compte</Link>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
