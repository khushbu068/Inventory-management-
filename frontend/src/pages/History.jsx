import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Card, Field, inputCls, Th, Td } from '../components/ui.jsx';

export default function History() {
  const [filters, setFilters] = useState({ material: '', type: 'All', from: '', to: '' });
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      api.transactions(filters).then((r) => { setRows(r); setError(''); }).catch((e) => setError(e.message));
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <Card className="flex h-full flex-col">
      <div className="mb-5 grid gap-3 sm:grid-cols-4">
        <Field label="Search material"><input className={inputCls} value={filters.material} onChange={set('material')} placeholder="RM-" /></Field>
        <Field label="Type">
          <select className={inputCls} value={filters.type} onChange={set('type')}>
            <option>All</option><option>Inward</option><option>Outward</option>
          </select>
        </Field>
        <Field label="From"><input type="date" className={inputCls} value={filters.from} onChange={set('from')} /></Field>
        <Field label="To"><input type="date" className={inputCls} value={filters.to} onChange={set('to')} /></Field>
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="min-h-[240px] flex-1 overflow-auto">
        <table className="w-full">
          <thead>
            <tr><Th>#</Th><Th>Date</Th><Th>Type</Th><Th>Material</Th><Th right>Qty</Th><Th>Reference</Th><Th right>Balance After</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((t, i) => (
              <tr key={t._id} className="odd:bg-slate-50">
                <Td>{i + 1}</Td><Td>{t.date}</Td><Td>{t.type}</Td><Td>{t.code}</Td>
                <Td right>{t.qty}</Td><Td>{t.reference}</Td><Td right>{t.balanceAfter}</Td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan="7" className="px-4 py-6 text-center text-sm text-slate-500">No transactions match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-slate-500">{rows.length} accepted transactions. Rejected issues are not listed.</p>
    </Card>
  );
}
