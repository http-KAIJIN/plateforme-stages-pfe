import apiClient from '../api/client'

export const reportService = {
  list: () => apiClient.get('/reports').then((res) => res.data),
  upload: (pfeId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/reports/${pfeId}/upload`, formData).then((res) => res.data)
  },
  downloadUrl: (id) => `${apiClient.defaults.baseURL}/reports/${id}/download`,
}
