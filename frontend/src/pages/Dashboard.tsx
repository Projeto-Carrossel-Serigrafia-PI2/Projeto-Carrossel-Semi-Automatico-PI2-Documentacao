import { useState, useEffect } from 'react';

import { ToastContainer } from 'react-toastify';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

export function Dashboard() {
  const [ productionParameters, setProductionParameters ] = useState({
    paints: [],
    shirtQuantity: 0,
    batches: 0
  });
  const [ currentState, setCurrentState ] = useState({
    paint: 0,
    batch: 0,
    speed: 0,
    temperature: 0
  });

  // On mount
  useEffect(() => {
    const PRODUCTION_PARAMETERS = localStorage.getItem('PRODUCTION_PARAMETERS');

    if(PRODUCTION_PARAMETERS)
      setProductionParameters(JSON.parse(PRODUCTION_PARAMETERS));
  }, []);

  console.log(JSON.stringify(productionParameters))
  console.log(JSON.stringify(currentState))

  return (
    <div id="dashboard">
      <ToastContainer />

      <div className="main">
        <h1>Dashboard</h1>

        <div className="content">
          <div className="temperature"></div>
          <div className="quality"></div>
          <div className="speed"></div>
          <div className="paint">
            <h1>Tinta</h1>

            <div className="info">
              <h2>{ productionParameters.paints.length ? productionParameters.paints[currentState.paint].color : '-'}</h2>
              <h3>{ productionParameters.paints.length ? productionParameters.paints[currentState.paint].type : '-'}</h3>
              <h4>{ currentState.paint + 1}/{productionParameters.paints.length }</h4>
            </div>
          </div>
          <div className="time"></div>
        </div>
      </div>
    </div>
  );
}
