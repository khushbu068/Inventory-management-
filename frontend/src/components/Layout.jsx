import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/materials', label: 'Raw Materials' },
  { to: '/stock', label: 'Stock Inward / Outward' },
  { to: '/history', label: 'Transaction History' },
];

export default function Layout() {
return (
  <div className="flex h-screen flex-col">
    <header className="shrink-0 bg-navy text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <span className="text-lg font-bold">Inventory Management</span>
        <nav className="flex flex-wrap gap-2 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-md px-4 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive ? 'bg-white/20 font-semibold' : 'text-white/80 hover:bg-white/10'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
    <main className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto h-full max-w-6xl px-4 py-6">
        <Outlet />
      </div>
    </main>
  </div>
);
}