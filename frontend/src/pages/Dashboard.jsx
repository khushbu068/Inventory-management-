import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Card, Th, Td } from '../components/ui.jsx';

export default function Dashboard() {
  const [d, setD] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard().then(setD).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!d) return <p className="text-slate-500">Loading…</p>;

  const stats = [
    ['Total Materials', d.totalMaterials, 'text-navy'],
    ['Out of Stock', d.outOfStock, 'text-red-600'],
    ['Accepted Transactions', d.accepted, 'text-green-700'],
    ['Rejected Transactions', d.rejected, 'text-red-600'],
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([label, value, color]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`mt-1 text-3xl font-bold ${color}`}>{value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="mb-3 font-semibold text-navy">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr><Th>Date</Th><Th>Type</Th><Th>Code</Th><Th right>Qty</Th><Th>Reference</Th><Th right>Balance</Th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {d.recent.map((t) => (
                <tr key={t._id} className="odd:bg-slate-50">
                  <Td>{t.date}</Td><Td>{t.type}</Td><Td>{t.code}</Td>
                  <Td right>{t.qty}</Td><Td>{t.reference}</Td><Td right>{t.balanceAfter}</Td>
                </tr>
              ))}
              {d.recent.length === 0 && (
                <tr><td colSpan="6" className="px-4 py-6 text-center text-sm text-slate-500">No transactions yet. Record one from Stock Inward / Outward.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
