import { useState, useEffect, useContext, useRef } from 'react';

import { ToastContainer } from 'react-toastify';

import StateContext from '../contexts/StateContext';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

import Paint from '../components/dashboard/Paint';
import Time from '../components/dashboard/Time';
import Shirts from '../components/dashboard/Shirts';
import Temperature from '../components/dashboard/Temperature';
import BatchModal from '../components/dashboard/BatchModal';

export function Dashboard() {
  const { state, parameters } = useContext(StateContext);
  const main = useRef();
  const h1 = useRef();
  const content = useRef();

  function calculateHeights() {
    if(parameters.paints.length) {
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
    <div id="dashboard" style={!parameters.paints.length ? {display: 'flex'} : {}}>
      <ToastContainer />
      <BatchModal 
        isOpen={state.waitingNewBatch}
      />

      { parameters.paints.length
        ? <div ref={main} className="main">
            <h1 ref={h1}>Dashboard</h1>

            <div ref={content} className="content">
              <Shirts />
              <div className="speed"></div>
              <Paint />
              <Time />
              <Temperature />
            </div>
          </div>
        : <span>Nenhuma produção em andamento</span>
      }
    </div>
  );
}