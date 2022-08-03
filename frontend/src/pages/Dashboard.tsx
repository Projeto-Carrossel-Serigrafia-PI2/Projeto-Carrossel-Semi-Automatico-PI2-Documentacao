import { useState, useEffect, useContext, useRef } from 'react';

import { ToastContainer } from 'react-toastify';

import StateContext from '../contexts/StateContext';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

import Paint from '../components/dashboard/Paint';
import Time from '../components/dashboard/Time';
import Shirts from '../components/dashboard/Shirts';

export function Dashboard() {
  const { parameters } = useContext(StateContext);
  const main = useRef();
  const h1 = useRef();
  const content = useRef();

  function calculateHeights() {
    if(parameters.paints.length || true) {
      const mainHeight = main.current.offsetHeight;
      const h1Height = h1.current.offsetHeight;
      const finalHeight = mainHeight - h1Height;

      content.current.style.height = finalHeight + 'px';

    }
  }

  useEffect(() => {
    calculateHeights();
    window.addEventListener('resize', calculateHeights);

    return () => {
      window.removeEventListener('resize', calculateHeights);
    }
  }, []);

  return (
    <div id="dashboard" style={!parameters.paints.length && false ? {display: 'flex'} : {}}>
      <ToastContainer />

      { parameters.paints.length || true
        ? <div ref={main} className="main">
            <h1 ref={h1}>Dashboard</h1>

            <div ref={content} className="content">
              <div className="temperature"></div>
              <Shirts />
              <div className="speed"></div>
              <Paint />
              <Time />
            </div>
          </div>
        : <span>Nenhuma produção em andamento</span>
      }
    </div>
  );
}