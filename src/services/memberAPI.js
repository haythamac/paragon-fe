import api from './api'

export const itemAPI = {
  getAll: () => api.get('/members'),
  store: (data) => api.post('/members', data),
  update: (id, data) => api.put('/members/${id}', data),
  delete: (id) => api.delete('/members/${id}', data),
}