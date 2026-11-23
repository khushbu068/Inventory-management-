async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}

const qs = (params) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => v && v !== 'All' && p.set(k, v));
  return p.toString();
};

export const api = {
  dashboard: () => request('/dashboard'),
  materials: (f = {}) => request(`/materials?${qs(f)}`),
  material: (id) => request(`/materials/${id}`),
  createMaterial: (body) => request('/materials', { method: 'POST', body }),
  updateMaterial: (id, body) => request(`/materials/${id}`, { method: 'PUT', body }),
  deleteMaterial: (id) => request(`/materials/${id}`, { method: 'DELETE' }),
  transactions: (f = {}) => request(`/transactions?${qs(f)}`),
  postTransaction: (body) => request('/transactions', { method: 'POST', body }),
};

export const UNITS = ['KG', 'Meter', 'Nos', 'Litre'];

export const stockStatus = (qty) => (qty === 0 ? 'out' : qty < 150 ? 'low' : 'in');
