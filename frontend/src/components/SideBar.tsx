import { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTshirt, FaAward } from 'react-icons/fa';
import { RiPaintFill, RiDashboardLine } from 'react-icons/ri';

import { Option } from '../components/Option';

import PageContext from '../contexts/PageContext';

import '../styles/components/SideBar.scss';

export function SideBar() {
  const { page, setPage } = useContext(PageContext);

  const location = useLocation();

  function getCurrentPage() {
    const currentPage = location.pathname == '/' ? 'production' : location.pathname.substr(1, location.pathname.length - 2);

    setPage(currentPage);
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
            setPage('production');
          }}
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
            setPage('dashboard');
          }}
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
            setPage('paints');
          }}
        />

        <Option
          icon={<FaAward size={18} color={page === 'quality-report' ? '#B193EE' : '#E8E7EA'} />}
          title="Relatório da Qualidade"
          active={page === 'quality-report'}
          route="/quality-report/"
          onClick={() => {
            setPage('quality-report');
          }}
        />
      </main>
    </div>
  );
}
