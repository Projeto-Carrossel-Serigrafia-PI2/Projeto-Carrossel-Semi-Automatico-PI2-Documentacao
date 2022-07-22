import { useState } from 'react';

import { ToastContainer } from 'react-toastify';

import { SideBar } from '../components/SideBar';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

export function Dashboard() {
  const PAINT_TYPES = [
    'Água', 'Plastisol'
  ];

  const SESSION_PARAMETERS = {
    paints: [
      {
        type: 0,
        color: 'Vermelho'
      },

      {
        type: 1,
        color: 'Azul'
      },

      {
        type: 0,
        color: 'Amarelo Pateta'
      }
    ],
    batches: 4
  };

  const CURRENT_STATE = {
    paint: 0,
    batch: 0,
    speed: 25,
    temperature: 150
  }

  const [currentPaint, setCurrentPaint] = useState(0);

  return (
    <div id="dashboard">
      <ToastContainer />

      <SideBar />

      <div class="main">
        <h1>Dashboard</h1>

        <div class="content">
          <div class="temperature"></div>
          <div class="quality"></div>
          <div class="speed"></div>
          <div class="paint">
            <h1>Tinta</h1>

            <div class="info">
              <h2>{ SESSION_PARAMETERS.paints[CURRENT_STATE.paint].color }</h2>
              <h3>{ PAINT_TYPES[SESSION_PARAMETERS.paints[CURRENT_STATE.paint].type] }</h3>
              <h4>{CURRENT_STATE.paint + 1}/{SESSION_PARAMETERS.paints.length}</h4>
            </div>
          </div>
          <div class="time"></div>
        </div>
      </div>
    </div>
  );
}
