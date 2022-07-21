import { ToastContainer } from 'react-toastify';

import { SideBar } from '../components/SideBar';

import '../styles/pages/Dashboard.scss';
import 'react-toastify/dist/ReactToastify.css';

export function Dashboard() {
  return (
    <div id="dashboard">
      <ToastContainer />

      <SideBar />

      <div class="main">
        <h2>Dashboard</h2>
        
        <div class="content">
          <div class="temperatura"></div>
          <div class="qualidade"></div>
          <div class="tinta"></div>
          <div class="tempo"></div>
        </div>
      </div>
    </div>
  );
}
