import { useEffect, useState } from 'react'

export function useApi(request, dependencies = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    setLoading(true)
    request()
      .then((result) => alive && setData(result))
      .catch((err) => alive && setError(err.response?.data?.detail || 'Erreur de chargement'))
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, dependencies)

  return { data, setData, loading, error }
}
