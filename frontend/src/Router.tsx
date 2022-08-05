import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Dashboard } from './pages/Dashboard';
import { Production } from './pages/Production';
import { Paints } from './pages/Paints';
import { SideBar } from './components/SideBar';

import PageContext from './contexts/PageContext';

import 'react-toastify/dist/ReactToastify.css';

export function Router() {
  const [ page, setPage ] = useState('dashboard');

  return (
    <BrowserRouter>
      <PageContext.Provider value={{ page, setPage }}>
        <SideBar />
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Production />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/paints" element={<Paints />} />
        </Routes>
      </PageContext.Provider>
    </BrowserRouter>
  );
}
