import apiClient from '../api/client'

export const stageService = {
  list: () => apiClient.get('/stages').then((res) => res.data),
  get: (id) => apiClient.get(`/stages/${id}`).then((res) => res.data),
  create: (payload) => apiClient.post('/stages', payload).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/stages/${id}`, payload).then((res) => res.data),
  remove: (id) => apiClient.delete(`/stages/${id}`),
}
