import api from './api';

export function submitLead(data: Record<string, any>) {
  return api.post('/leads', data);
}
