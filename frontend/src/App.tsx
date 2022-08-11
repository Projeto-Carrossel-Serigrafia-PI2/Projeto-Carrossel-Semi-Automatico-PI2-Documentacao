import { Router } from './Router';

import React, { useState } from 'react';
import StateContext from './contexts/StateContext';

function App() {
  const [parameters, setParameters] = useState({
    paints: [],
    shirtQuantity: 0,
    batches: 0,
    speed: 0
  });

  const [state, setState] = useState({
    paint: 0,
    batch: 0,
    temperatures: [0, 0],
    waitingNewBatch: false,
    inSession: false
  });

  return (
    <div id="app">
      <StateContext.Provider value={{ parameters, setParameters, state, setState }}>
        <Router />
      </StateContext.Provider>
    </div>
  );
}

export default App;
