import { api } from './client';

export const usersApi = {
  getAll:  ()         => api.get('/users'),
  getById: (id)       => api.get(`/users/${id}`),
  update:  (id, data) => api.put(`/users/${id}`, data),
};
