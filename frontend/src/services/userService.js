import apiClient from '../api/client'

export const userService = {
  list: (params = {}) => apiClient.get('/users', { params }).then((res) => res.data),
  get: (id) => apiClient.get(`/users/${id}`).then((res) => res.data),
  update: (id, payload) => apiClient.put(`/users/${id}`, payload).then((res) => res.data),
  remove: (id) => apiClient.delete(`/users/${id}`),
}
