import api from './api'

export const itemAPI = {
  getAll: () => api.get('/item'),
  store: (data) => api.post('/item', data),
}