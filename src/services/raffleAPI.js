import api from './api'

export const raffleAPI = {
  getAll: () => api.get('/raffle'),
  store: (data) => api.post('/raffle', data),
  // update: (id, data) => api.put('/members/${id}', data),
  // delete: (id) => api.delete('/members/${id}', data),
}