import api from './api';

export function listFiles(params?: Record<string, any>) {
  return api.get('/files', { params });
}

export function uploadFile(data: FormData) {
  return api.post('/files', data);
}
