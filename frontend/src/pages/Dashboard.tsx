import { useParams } from 'react-router-dom';

import '../styles/pages/Dashboard.scss';

export function Dashboard() {
  const { production_id } = useParams();

  return (
    <div
      id="dashboard"
      className={Number(production_id) === 0 ? 'no-production' : ''}
    >
      <h1>Dashboard</h1>

      <main>
        {Number(production_id) !== 0 ? (
          <div></div>
        ) : (
          <span>Nenhuma produção em andamento</span>
        )}
      </main>
    </div>
  );
}
