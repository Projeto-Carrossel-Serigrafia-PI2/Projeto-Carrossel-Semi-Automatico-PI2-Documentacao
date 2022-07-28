import { useState, useEffect } from 'react';

import { ToastContainer } from 'react-toastify';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

import Paint from '../components/Paint';

export function Dashboard() {
  return (
    <div id="dashboard">
      <ToastContainer />

      <div className="main">
        <h1>Dashboard</h1>

        <div className="content">
          <div className="temperature"></div>
          <div className="quality"></div>
          <div className="speed"></div>
          <Paint />
          <div className="time"></div>
        </div>
      </div>
    </div>
  );
}