import apiClient from '../api/client'

export const applicationService = {
  list: () => apiClient.get('/applications').then((res) => res.data),
  create: (payload) => apiClient.post('/applications', payload).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/applications/${id}`, payload).then((res) => res.data),
}
