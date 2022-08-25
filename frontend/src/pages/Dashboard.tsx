import { useState, useEffect, useContext, useRef } from 'react';

import { ToastContainer } from 'react-toastify';

import StateContext from '../contexts/StateContext';

import productionService from '../services/productionService';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

import Paint from '../components/dashboard/Paint';
import Time from '../components/dashboard/Time';
import Shirts from '../components/dashboard/Shirts';
import Temperature from '../components/dashboard/Temperature';
import Speed from '../components/dashboard/Speed';
import BatchModal from '../components/dashboard/BatchModal';
import PauseOverlay from '../components/dashboard/PauseOverlay';
import RepaintingModal from '../components/dashboard/RepaintingModal';

import { notify_success, notify_error } from '../utils/toastify'
import errorHandler from '../utils/errorHandler';

export function Dashboard() {
  const { state, parameters } = useContext(StateContext);
  const [ previousInSession, setPreviousInSession ] = useState(false);
  const [ isRepainting, setIsRepainting ] = useState(false);

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

  function toggleProduction() {
    productionService.productionToggle().then((response) => {
      if(response.data.error) {
        if(response.data.type == 1)
          notify_error('Falha ao pausar/despausar! Nenhuma produção em sessão!');
        else if(response.data.type == 6)
          notify_error('Falha ao pausar/despausar! Repique em andamento!');
        else if(response.data.type == 0)
          notify_error('Falha ao pausar/despausar! Erro interno!');
        else
          notify_error('Falha ao pausar/despausar! Erro desconhecido! @_@');
      }
    }).catch(errorHandler);
  }

  function finishProduction() {
    productionService.productionForceFinish().then((response) => {
      if(response.data.error) {
        if(response.data.type == 1)
          notify_error('Falha ao forçar término de produção! Nenhuma produção em sessão!');
        else if(response.data.type == 0)
          notify_error('Falha ao forçar término de produção! Erro interno!');
        else
          notify_error('Falha ao forçar término de produção! Erro desconhecido! @_@');
      }
    }).catch(errorHandler);
  }

  function toggleRepainting() {
    productionService.productionRepaint().then((response) => {
      if(response.data.error) {
        if(response.data.type == 1)
          notify_error('Falha ao realizar/finalizar repique! Nenhuma produção em sessão!');
        else if(response.data.type == 4)
          notify_error('Falha ao realizar/finalizar repique! Carrossel não alinhado!');
        else if(response.data.type == 5)
          notify_error('Falha ao realizar/finalizar repique! Produção pausada!');
        else if(response.data.type == 0)
          notify_error('Falha ao realizar/finalizar repique! Erro interno!');
        else
          notify_error('Falha ao realizar/finalizar repique! Erro desconhecido! @_@');
      }

      else
        setIsRepainting(!isRepainting);
    }).catch(errorHandler);
  }

  useEffect(() => {
    calculateHeights();
    window.addEventListener('resize', calculateHeights);

    return () => {
      window.removeEventListener('resize', calculateHeights);
    }
  }, []);

  useEffect(() => {
    if(!state.inSession && state.inSession != previousInSession) {
      notify_success('Produção finalizada!');
      clearInterval(window.updateInterval);
    }
    setPreviousInSession(state.inSession);
  }, [state.inSession]);

  return (
    <div id="dashboard" style={!parameters.paints.length ? {display: 'flex'} : {}}>
      <BatchModal 
        isOpen={state.waitingNewBatch}
      />
      <PauseOverlay 
        isPaused={state.isPaused}
        toggleProduction={toggleProduction}
      />
      <RepaintingModal 
        isOpen={isRepainting}
        toggleRepainting={toggleRepainting}
      />

      { parameters.paints.length
        ? <div ref={main} className="main">
            <div className="title-control">
              <h1 ref={h1}>Dashboard</h1>
              
              <div>
                <button onClick={() => toggleRepainting()}>Repique</button>
                <button onClick={() => toggleProduction()}>{state.isPaused ? 'Resumir' : 'Pausar'} produção</button>
                <button onClick={() => finishProduction()}>Finalizar produção</button>
              </div>
            </div>

            <div ref={content} className="content">
              <Shirts />
              <Paint />
              <Time isPaused={state.isPaused} />
              <Temperature />
              <Speed />
            </div>
          </div>
        : <span>Nenhuma produção em andamento</span>
      }
    </div>
  );
}
