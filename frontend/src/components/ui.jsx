export const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

export const Field = ({ label, children }) => (
  <label className="block text-sm text-slate-600">
    <span className="mb-1 block">{label}</span>
    {children}
  </label>
);

export const inputCls =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-navy focus:outline-none focus:ring-2 focus:ring-navy/30 disabled:bg-slate-100 disabled:text-slate-500';

const btn = 'rounded-md px-4 py-2 text-sm font-semibold text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60';
export const btnNavy = `${btn} bg-navy hover:bg-navy-dark focus-visible:ring-navy`;
export const btnGreen = `${btn} bg-green-700 hover:bg-green-800 focus-visible:ring-green-700`;
export const btnRed = `${btn} bg-red-600 hover:bg-red-700 focus-visible:ring-red-600`;
export const btnGrey = `${btn} bg-slate-500 hover:bg-slate-600 focus-visible:ring-slate-500`;

export const Th = ({ children, right }) => (
  <th className={`sticky top-0 z-10 bg-navy px-4 py-2.5 text-sm font-semibold text-white ${right ? 'text-right' : 'text-left'}`}>{children}</th>
);
export const Td = ({ children, right }) => (
  <td className={`px-4 py-2.5 text-sm ${right ? 'text-right tabular-nums' : ''}`}>{children}</td>
);
