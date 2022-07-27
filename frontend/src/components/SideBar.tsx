import { useEffect, useState } from 'react';
import { FaTshirt, FaAward } from 'react-icons/fa';
import { RiPaintFill, RiDashboardLine } from 'react-icons/ri';

import { Option } from '../components/Option';

import '../styles/components/SideBar.scss';

export function SideBar() {
  const [pageActive, setPageActive] = useState('production');

  function saveCurrentPage(page: string) {
    sessionStorage.setItem('@SERIGRAFIA:current-page', page);
  }

  function getCurrentPage() {
    const current_page = sessionStorage.getItem('@SERIGRAFIA:current-page');
    setPageActive(current_page!);
  }

  useEffect(() => {
    getCurrentPage();
  }, []);

  return (
    <div id="sidebar">
      <header>
        <h1>Project Logo</h1>
      </header>

      <main>
        <Option
          icon={
            <FaTshirt
              size={18}
              color={pageActive === 'production' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Produção"
          active={pageActive === 'production'}
          route="/"
          onClick={() => {
            setPageActive('production');
            saveCurrentPage('production');
          }}
        />

        <Option
          icon={
            <RiDashboardLine
              size={18}
              color={pageActive === 'dashboard' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Dashboard"
          active={pageActive === 'dashboard'}
          route="/dashboard"
          onClick={() => {
            setPageActive('dashboard');
            saveCurrentPage('dashboard');
          }}
        />

        <Option
          icon={
            <RiPaintFill
              size={18}
              color={pageActive === 'paint' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Tintas"
          active={pageActive === 'paint'}
          route="/paints"
          onClick={() => {
            setPageActive('paint');
            saveCurrentPage('paint');
          }}
        />

        <Option
          icon={<FaAward size={18} color="#E8E7EA" />}
          title="Verificar Qualidade"
          route="/quality"
          onClick={() => {}}
        />
      </main>
    </div>
  );
}
