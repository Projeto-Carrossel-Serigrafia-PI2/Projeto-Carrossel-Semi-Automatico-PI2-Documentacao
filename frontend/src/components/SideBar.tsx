import { useState } from 'react';
import { FaTshirt, FaAward } from 'react-icons/fa';
import { RiPaintFill, RiDashboardLine } from 'react-icons/ri';
import { Navigate } from 'react-router-dom';

import { Option } from '../components/Option';
import { ModalPaints } from '../components/ModalPaints';

import '../styles/components/SideBar.scss';

export function SideBar() {
  const [sessionActive, setSessionActive] = useState('production-session');
  const [isModalConfigSessionVisible, setIsModalConfigSessionVisible] =
    useState(false);

  const openModal = () => {
    setIsModalConfigSessionVisible(true);
  };

  const closeModal = () => {
    setIsModalConfigSessionVisible(false);
    setSessionActive('none');
  };

  return (
    <div id="sidebar">
      {/* <ModalPaints
        isModalOpen={isModalConfigSessionVisible}
        closeModal={closeModal}
        setSessionActive={setSessionActive}
        setIsModalOpen={setIsModalConfigSessionVisible}
      /> */}

      <header>
        <h1>Project Logo</h1>
      </header>

      <main>
        <Option
          icon={
            <FaTshirt
              size={18}
              color={
                sessionActive === 'production-session' ? '#B193EE' : '#E8E7EA'
              }
            />
          }
          title="Produção"
          active={sessionActive === 'production-session'}
          route="/"
          onClick={() => {
            setSessionActive('production-session');
            // return <Navigate to="/production" replace={true} />
          }}
        />

        <Option
          icon={
            <RiDashboardLine
              size={18}
              color={
                sessionActive === 'dashboard-session' ? '#B193EE' : '#E8E7EA'
              }
            />
          }
          title="Dashboard"
          active={sessionActive === 'dashboard-session'}
          route="/dashboard"
          onClick={() => {
            setSessionActive('dashboard-session');
            // return <Navigate to="/production" replace={true} />
          }}
        />

        <Option
          icon={
            <RiPaintFill
              size={18}
              color={sessionActive === 'paint-session' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Tintas"
          active={sessionActive === 'paint-session'}
          route="/paints"
          onClick={() => {
            setSessionActive('paint-session');
            <Navigate to="/paints" replace={true} />;
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
