import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Card from '../../components/Card'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuthStore } from '../../store/authStore'

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { role: 'student' } })
  const { register: registerAccount, loading, error } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (values) => {
    await registerAccount(values)
    navigate('/login')
  }

  return (
    <AuthLayout>
      <Card>
        <h2 className="text-3xl font-bold text-slate-950">Inscription</h2>
        <p className="mt-2 text-sm text-slate-500">Creez un compte selon votre role.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-semibold text-slate-700">Nom complet</label>
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary-600" {...register('full_name', { required: 'Nom obligatoire', minLength: 2 })} />
            {errors.full_name && <p className="mt-1 text-sm text-red-600">Nom obligatoire</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary-600" type="email" {...register('email', { required: 'Email obligatoire' })} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Role</label>
            <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary-600" {...register('role')}>
              <option value="student">Etudiant</option>
              <option value="company">Entreprise</option>
              <option value="supervisor">Encadrant</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-primary-600" type="password" {...register('password', { required: true, minLength: 8 })} />
            {errors.password && <p className="mt-1 text-sm text-red-600">Minimum 8 caracteres</p>}
          </div>
          {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <Button className="w-full" disabled={loading}>{loading ? 'Creation...' : 'Créer le compte'}</Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">Deja inscrit ? <Link className="font-semibold text-primary-700" to="/login">Se connecter</Link></p>
      </Card>
    </AuthLayout>
  )
}
