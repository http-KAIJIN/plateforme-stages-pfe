import apiClient from '../api/client'

export const aiService = {
  matchCv: ({ file, stageId, offerText }) => {
    const formData = new FormData()
    formData.append('file', file)
    if (stageId) formData.append('stage_id', stageId)
    if (offerText) formData.append('offer_text', offerText)
    return apiClient.post('/ai/match-cv', formData).then((res) => res.data)
  },
}
