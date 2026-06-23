import apiClient from '../api/client'

export const pfeService = {
  list: () => apiClient.get('/pfe').then((res) => res.data),
  create: (payload) => apiClient.post('/pfe', payload).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/pfe/${id}`, payload).then((res) => res.data),
}
