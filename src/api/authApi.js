import { api } from './client';

export const authApi = {
  login: (employee_id, password) =>
    api.post('/auth/login', { employee_id, password }),
};
