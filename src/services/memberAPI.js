import api from './api'

export const memberAPI = {
  getAll: () => api.get('/members'),
  store: (data) => api.post('/members', data),
  update: (id, data) => api.put('/members/${id}', data),
  delete: (id) => api.delete('/members/${id}', data),
}