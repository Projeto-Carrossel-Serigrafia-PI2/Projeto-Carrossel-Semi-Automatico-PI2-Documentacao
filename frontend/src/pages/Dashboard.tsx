import { useState, useEffect, useRef } from 'react';

import { ToastContainer } from 'react-toastify';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

import Paint from '../components/dashboard/Paint';
import Time from '../components/dashboard/Time';
import Shirts from '../components/dashboard/Shirts';

export function Dashboard() {
  const main = useRef();
  const h1 = useRef();
  const content = useRef();

  function calculateHeights() {
    const mainHeight = main.current.offsetHeight;
    const h1Height = h1.current.offsetHeight;
    const finalHeight = mainHeight - h1Height;

    content.current.style.height = finalHeight + 'px';
  }

  useEffect(() => {
    calculateHeights();
    window.addEventListener('resize', calculateHeights);

    return () => {
      window.removeEventListener('resize', calculateHeights);
    }
  }, []);

  return (
    <div id="dashboard">
      <ToastContainer />

      <div ref={main} className="main">
        <h1 ref={h1}>Dashboard</h1>

        <div ref={content} className="content">
          <div className="temperature"></div>
          <Shirts />
          <div className="speed"></div>
          <Paint />
          <Time />
        </div>
      </div>
    </div>
  );
}