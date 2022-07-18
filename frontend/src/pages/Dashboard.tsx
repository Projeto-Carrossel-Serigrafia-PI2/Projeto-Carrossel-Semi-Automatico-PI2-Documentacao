import { ToastContainer } from 'react-toastify';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

export function Dashboard() {
  return (
    <div id="dashboard">
      <ToastContainer />

      <h2>Dashboard</h2>
    </div>
  );
}
