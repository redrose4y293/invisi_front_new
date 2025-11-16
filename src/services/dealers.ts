import api from './api';

export function dealerLogin(email: string, phone?: string) {
  return api.post('/dealer/login', { email, phone });
}

export async function getTrainingEvents() {
  return api.get('/dealer/training');
}

export function dealerRegister(payload: { name: string; email: string; phone?: string; company?: string; message?: string; country?: string; }) {
  // Map dealer application to a Lead of type 'Dealer'
  const body = {
    name: payload.name,
    email: payload.email,
    phone: payload.phone || '',
    company: payload.company || '',
    country: payload.country || '',
    type: 'Dealer',
    message: payload.message || '',
    tags: [],
    status: 'New',
  };
  return api.post('/dealer/apply', body);
}

export function getDealerFiles(params?: Record<string, any>) {
  return api.get('/dealer/files', { params });
}

export function uploadDealerFileJSON(body: { name: string; category: 'Testing Report'|'Marketing'|'Certification'; description?: string }) {
  return api.post('/dealer/upload', body);
}

export function getDealerUploads() {
  return api.get('/dealer/uploads');
}

export function registerTraining(eventId: string, note?: string) {
  return api.post('/dealer/training/register', { eventId, note });
}
