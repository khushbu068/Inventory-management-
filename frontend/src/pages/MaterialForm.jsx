import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api, UNITS } from '../api.js';
import { Card, Field, inputCls, btnGreen, btnGrey } from '../components/ui.jsx';

export default function MaterialForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({ code: '', name: '', unit: 'KG', openingQty: 0 });
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.material(id)
      .then((m) => {
        setForm({ code: m.code, name: m.name, unit: m.unit, openingQty: m.openingQty });
        setLocked(m.hasTransactions);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const body = { ...form, openingQty: Number(form.openingQty) };
      editing ? await api.updateMaterial(id, body) : await api.createMaterial(body);
      navigate('/materials');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="mx-auto max-w-xl">
      <h1 className="mb-4 font-semibold text-navy">{editing ? `Edit Material: ${form.code}` : 'Add Material'}</h1>
      {error && <p className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <Field label="Material Code">
          <input className={inputCls} value={form.code} onChange={set('code')} disabled={editing} required placeholder="RM-009" />
        </Field>
        <Field label="Material Name">
          <input className={inputCls} value={form.name} onChange={set('name')} required />
        </Field>
        <Field label="Unit">
          <select className={inputCls} value={form.unit} onChange={set('unit')}>
            {UNITS.map((u) => <option key={u}>{u}</option>)}
          </select>
        </Field>
        <Field label={`Opening Available Qty${locked ? ' (read-only after transactions)' : ''}`}>
          <input type="number" min="0" step="any" className={inputCls} value={form.openingQty} onChange={set('openingQty')} disabled={locked} required />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <button type="submit" className={btnGreen} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
          <button type="button" className={btnGrey} onClick={() => navigate('/materials')}>Cancel</button>
        </div>
      </form>
    </Card>
  );
}
