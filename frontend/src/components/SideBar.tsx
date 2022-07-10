import { FiSettings, FiPlay, FiAward } from 'react-icons/fi';

import { Option } from '../components/Option';

import '../styles/components/SideBar.scss';

export function SideBar() {
  return (
    <div id="sidebar">
      <header>
        <h1>Project Logo</h1>
      </header>

      <main>
        <Option
          icon={<FiSettings size={18} color="#E8E7EA" />}
          title="Configurar Sessão"
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
