import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, UNITS } from '../api.js';
import { Card, Field, inputCls, btnNavy, Th, Td } from '../components/ui.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Materials() {
  const [filters, setFilters] = useState({ search: '', unit: 'All', status: 'All' });
  const [data, setData] = useState({ materials: [], total: 0 });
  const [error, setError] = useState('');

  const load = () =>
    api.materials(filters).then((d) => { setData(d); setError(''); }).catch((e) => setError(e.message));

  // Search + filters apply together; debounce typing
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [filters]);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  const remove = async (m) => {
    if (!window.confirm(`Delete ${m.code} – ${m.name}?`)) return;
    try { await api.deleteMaterial(m._id); load(); } catch (e) { setError(e.message); }
  };

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-5 grid items-end gap-3 sm:grid-cols-[2fr_1fr_1fr_auto]">
        <Field label="Search (code or name)">
          <input className={inputCls} value={filters.search} onChange={set('search')} placeholder="RM-00" />
        </Field>
        <Field label="Unit">
          <select className={inputCls} value={filters.unit} onChange={set('unit')}>
            <option>All</option>
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </Field>
        <Field label="Stock status">
          <select className={inputCls} value={filters.status} onChange={set('status')}>
            <option value="All">All</option>
            <option value="in">In Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </Field>
        <Link to="/materials/new" className={`${btnNavy} text-center`}>+ Add Material</Link>
      </div>

      {error && <p className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

     <div className="min-h-[240px] flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr><Th>Code</Th><Th>Name</Th><Th>Unit</Th><Th right>Available Qty</Th><Th>Status</Th><Th>Actions</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.materials.map((m) => (
              <tr key={m._id} className="odd:bg-slate-50">
                <Td>{m.code}</Td><Td>{m.name}</Td><Td>{m.unit}</Td>
                <Td right>{m.availableQty}</Td>
                <Td><StatusBadge qty={m.availableQty} /></Td>
                <Td>
                  <div className="flex gap-2">
                    <Link to={`/materials/${m._id}/edit`} className="rounded bg-slate-500 px-3 py-1 text-xs font-semibold text-white hover:bg-slate-600">Edit</Link>
                    <button onClick={() => remove(m)} className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700">Delete</button>
                  </div>
                </Td>
              </tr>
            ))}
            {data.materials.length === 0 && (
              <tr><td colSpan="6" className="px-4 py-6 text-center text-sm text-slate-500">No materials match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate-500">Showing {data.materials.length} of {data.total} materials</p>
    </Card>
  );
}
