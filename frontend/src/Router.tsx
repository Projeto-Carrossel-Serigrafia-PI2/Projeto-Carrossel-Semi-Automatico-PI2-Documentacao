import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Dashboard } from './pages/Dashboard';
import { Production } from './pages/Production';
import { Paints } from './pages/Paints';
import { SideBar } from './components/SideBar';

import 'react-toastify/dist/ReactToastify.css';

export function Router() {
  return (
    <BrowserRouter>
      <SideBar />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<Production />} />
        <Route path="/dashboard/:production_id" element={<Dashboard />} />
        <Route path="/paints" element={<Paints />} />
      </Routes>
    </BrowserRouter>
  );
}
