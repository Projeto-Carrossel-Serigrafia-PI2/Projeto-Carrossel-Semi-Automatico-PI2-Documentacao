import SyncLoader from 'react-spinners/SyncLoader';

import DashboardModal from './Modal'

import StateContext from '../../contexts/StateContext';
import productionService from '../../services/productionService';
import { notify_error, notify_success } from '../../utils/toastify';

export default function BatchModal(props) {
	function nextBatch() {
		productionService.productionNextBatch().then((response) => {
			if(response.data.error)
				notify_error('Falha ao avançar para o próximo lote!');
			else
				notify_success('Lote avançado com sucesso!');
		});
	}

	return (
		<DashboardModal isOpen={props.isOpen}>
			<div>
				<span>Lote finalizado</span>
				<span>Troque as camisetas e pressione o botão para continuar</span>
			</div>

			<SyncLoader className="spinner" loading={true} color="#1f272d" />

			<button onClick={nextBatch}>Continuar</button>
		</DashboardModal>
	);
}
