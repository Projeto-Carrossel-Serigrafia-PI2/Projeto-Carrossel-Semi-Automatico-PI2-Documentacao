import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';

import StateContext from '../contexts/StateContext';

import '../styles/pages/Dashboard.scss';

export function Dashboard() {
  const { parameters } = useContext(StateContext);

  return (
    <div id="dashboard">
      <h1>Dashboard</h1>

      <main>
        { parameters.paints.length
          ? <span>Produção em andamento</span>
          : <span>Nenhuma produção em andamento</span>
        }
      </main>
    </div>
  );
}
