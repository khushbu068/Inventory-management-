import { stockStatus } from '../api.js';

const styles = {
  out: ['Out of Stock', 'bg-red-600'],
  low: ['Low Stock', 'bg-amber-500'],
  in: ['In Stock', 'bg-green-700'],
};

export default function StatusBadge({ qty }) {
  const [label, color] = styles[stockStatus(qty)];
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${color}`}>{label}</span>;
}
