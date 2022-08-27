import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTshirt, FaAward } from 'react-icons/fa';
import { RiPaintFill, RiDashboardLine } from 'react-icons/ri';

import { Option } from '../components/Option';

import PageContext from '../contexts/PageContext';
import StateContext from '../contexts/StateContext';

import { notify_error } from '../utils/toastify';

import '../styles/components/SideBar.scss';

export function SideBar() {
  const { page, setPage } = useContext(PageContext);
  const { state } = useContext(StateContext);

  const location = useLocation();

  function getCurrentPage() {
    const currentPage = location.pathname == '/' ? 'production' : location.pathname.substr(1, location.pathname.length - 2);

    setPage(currentPage);
  }

  function setCurrentPage(page) {
    if(page == 'quality') {
      if(state.isPaused)
        setPage(page);
      else
        notify_error('Produção em andamento! Pause a produção para habilitar a navegação para a página de qualidade!');
    }

    else if(state.inSession)
      notify_error('Produção em andamento! Finalize a produção para habilitar a navegação!');
    else
      setPage(page);
  }

  useEffect(() => {
    getCurrentPage();
  }, []);

  return (
    <div id="sidebar">
      <header>
        <h1>Silkgician</h1>
      </header>

      <main>
        <Option
          icon={
            <FaTshirt
              size={18}
              color={page === 'production' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Produção"
          active={page === 'production'}
          route="/"
          onClick={() => {
            setCurrentPage('production');
          }}
          disabled={state.inSession ? true : false}
        />

        <Option
          icon={
            <RiDashboardLine
              size={18}
              color={page === 'dashboard' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Dashboard"
          active={page === 'dashboard'}
          route="/dashboard/"
          onClick={() => {
            setCurrentPage('dashboard');
          }}
          disabled={state.inSession ? true : false}
        />

        <Option
          icon={
            <RiPaintFill
              size={18}
              color={page === 'paints' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Bases de tinta"
          active={page === 'paints'}
          route="/paints/"
          onClick={() => {
            setCurrentPage('paints');
          }}
          disabled={state.inSession ? true : false}
        />

        <Option
          icon={<FaAward size={18} color="#E8E7EA" />}
          title="Verificar Qualidade"
          route="/quality/"
          onClick={() => {}}
          disabled={state.inSession ? true : false}
        />
      </main>
    </div>
  );
}
