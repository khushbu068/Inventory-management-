import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Materials from './pages/Materials.jsx';
import MaterialForm from './pages/MaterialForm.jsx';
import StockEntry from './pages/StockEntry.jsx';
import History from './pages/History.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/materials/new" element={<MaterialForm />} />
        <Route path="/materials/:id/edit" element={<MaterialForm />} />
        <Route path="/stock" element={<StockEntry />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
