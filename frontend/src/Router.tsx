import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Dashboard } from './pages/Dashboard';
import { Production } from './pages/Production';
import { Paints } from './pages/Paints';
import { SideBar } from './components/SideBar';

export function Router() {
  return (
    <BrowserRouter>
      <SideBar />

      <Routes>
        <Route path="/" element={<Production />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/paints" element={<Paints />} />
      </Routes>
    </BrowserRouter>
  );
}
