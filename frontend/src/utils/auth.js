export function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const payload = decodeJwt(token)
  if (!payload?.exp) return true
  return Date.now() >= payload.exp * 1000
}

export function roleLabel(role) {
  return {
    student: 'Etudiant',
    company: 'Entreprise',
    supervisor: 'Encadrant',
    admin: 'Administrateur',
  }[role] || role
}
