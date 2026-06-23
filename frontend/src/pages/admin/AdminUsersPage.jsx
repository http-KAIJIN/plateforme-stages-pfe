import { useEffect, useState } from 'react'
import Button from '../../components/Button'
import Card from '../../components/Card'
import EmptyState from '../../components/EmptyState'
import { userService } from '../../services/userService'
import { roleLabel } from '../../utils/auth'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    userService.list({ search: search || undefined, role: role || undefined })
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [search, role])

  const toggleActive = async (user) => {
    const updated = await userService.update(user.id, { is_active: !user.is_active })
    setUsers(users.map((item) => (item.id === user.id ? updated : item)))
  }

  const deleteUser = async (id) => {
    await userService.remove(id)
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">Gestion utilisateurs</h2>
        <p className="text-slate-500">Rechercher, filtrer, activer ou desactiver les comptes.</p>
      </div>
      <Card className="grid gap-3 md:grid-cols-[1fr_220px]">
        <input className="rounded-xl border border-slate-200 px-3 py-2" placeholder="Recherche nom ou email" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="rounded-xl border border-slate-200 px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">Tous les roles</option>
          <option value="student">Etudiant</option>
          <option value="company">Entreprise</option>
          <option value="supervisor">Encadrant</option>
          <option value="admin">Admin</option>
        </select>
      </Card>
      {loading ? <p>Chargement...</p> : users.length === 0 ? <EmptyState /> : (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3">Nom</th>
                <th>Email</th>
                <th>Role</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="py-3 font-semibold text-slate-950">{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>{roleLabel(user.role)}</td>
                  <td>{user.is_active ? 'Actif' : 'Desactive'}</td>
                  <td className="flex justify-end gap-2 py-3">
                    <Button variant="secondary" onClick={() => toggleActive(user)}>{user.is_active ? 'Desactiver' : 'Activer'}</Button>
                    <Button variant="danger" onClick={() => deleteUser(user.id)}>Supprimer</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
