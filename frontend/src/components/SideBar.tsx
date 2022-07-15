import { useState } from 'react';
import { FiSettings, FiPlay, FiAward } from 'react-icons/fi';

import { Option } from '../components/Option';
import { ModalConfigSession } from '../components/ModalConfigSession';

import '../styles/components/SideBar.scss';

export function SideBar() {
  const [sessionActive, setSessionActive] = useState('none');
  const [isModalConfigSessionVisible, setIsModalConfigSessionVisible] =
    useState(false);

  const openModal = () => {
    setIsModalConfigSessionVisible(true);
    setSessionActive('config-session');
  };

  const closeModal = () => {
    setIsModalConfigSessionVisible(false);
    setSessionActive('none');
  };

  return (
    <div id="sidebar">
      <ModalConfigSession
        isModalOpen={isModalConfigSessionVisible}
        closeModal={closeModal}
        setSessionActive={setSessionActive}
      />

      <header>
        <h1>Project Logo</h1>
      </header>

      <main>
        <Option
          icon={
            <FiSettings
              size={18}
              color={sessionActive === 'config-session' ? '#B193EE' : '#E8E7EA'}
            />
          }
          title="Configurar Sessão"
          active={sessionActive === 'config-session'}
          onClick={() => openModal()}
        />

        <Option
          icon={<FiPlay size={18} color="#E8E7EA" />}
          title="Iniciar Sessão"
        />

        <Option
          icon={<FiAward size={18} color="#E8E7EA" />}
          title="Verificar Qualidade"
        />
      </main>
    </div>
  );
}
