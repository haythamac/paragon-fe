import api from './api'

export const categoryAPI = {
  getAll: () => api.get('/item_category'),
}