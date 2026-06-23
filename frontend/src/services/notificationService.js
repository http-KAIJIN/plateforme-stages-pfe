import apiClient from '../api/client'

export const notificationService = {
  list: () => apiClient.get('/notifications').then((res) => res.data),
  markRead: (id) => apiClient.put(`/notifications/${id}/read`).then((res) => res.data),
}
