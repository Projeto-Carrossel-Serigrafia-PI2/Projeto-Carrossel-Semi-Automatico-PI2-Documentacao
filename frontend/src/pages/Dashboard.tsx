import { ToastContainer } from 'react-toastify';

import { SideBar } from '../components/SideBar';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

export function Dashboard() {
  return (
    <div id="dashboard">
      <ToastContainer />

      <SideBar />

      <h2>Dashboard</h2>
    </div>
  );
}
