import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Card, Field, inputCls, btnGreen, btnRed, btnGrey } from '../components/ui.jsx';

const today = () => new Date().toISOString().slice(0, 10);
const empty = () => ({ date: today(), reference: '', materialId: '', qty: '' });

export default function StockEntry() {
  const [type, setType] = useState('Outward');
  const [form, setForm] = useState(empty());
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);

  const loadMaterials = () => api.materials().then((d) => setMaterials(d.materials));
  useEffect(() => { loadMaterials(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isOut = type === 'Outward';

  const switchType = (t) => { setType(t); setError(''); setSuccess(''); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError(''); setSuccess('');
    try {
      const tx = await api.postTransaction({ ...form, type, qty: Number(form.qty) });
      setSuccess(`${type} recorded for ${tx.code}. New balance: ${tx.balanceAfter}.`);
      setForm({ ...empty(), date: form.date });
    } catch (err) {
      setError(err.message); // over-issue message shown above the form, form kept as typed
    } finally {
      setBusy(false);
      loadMaterials(); // refresh balances shown in the dropdown
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <div className="mb-4  inline-flex overflow-hidden rounded-md border border-slate-300 text-sm font-semibold">
        {['Inward', 'Outward'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => switchType(t)}
            className={`px-5 py-2 ${type === t ? 'bg-navy text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
          >
            Stock {t}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="mb-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error.startsWith('Issue rejected.')
            ? <><strong>Issue rejected.</strong>{error.slice('Issue rejected.'.length)}</>
            : error}
        </div>
      )}
      {success && <div role="status" className="mb-4 rounded-md border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">{success}</div>}

      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Date"><input type="date" className={inputCls} value={form.date} onChange={set('date')} required /></Field>
          <Field label="Reference"><input className={inputCls} value={form.reference} onChange={set('reference')} placeholder={isOut ? 'WO-2207' : 'PO-4430'} required /></Field>
        </div>
        <Field label="Material">
          <select className={inputCls} value={form.materialId} onChange={set('materialId')} required>
            <option value="">Select a material</option>
            {materials.map((m) => (
              <option key={m._id} value={m._id}>{m.code} - {m.name} (available: {m.availableQty} {m.unit})</option>
            ))}
          </select>
        </Field>
        <Field label={isOut ? 'Quantity to issue' : 'Quantity to receive'}>
          <input type="number" min="0" step="any" className={inputCls} value={form.qty} onChange={set('qty')} required />
        </Field>
        <div className="flex justify-end gap-2">
          <button type="submit" className={isOut ? btnRed : btnGreen} disabled={busy}>{isOut ? 'Issue Stock' : 'Receive Stock'}</button>
          <button type="button" className={btnGrey} onClick={() => { setForm(empty()); setError(''); setSuccess(''); }}>Clear</button>
        </div>
      </form>
    </Card>
  );
}
