import Modal from 'react-modal';
import SyncLoader from 'react-spinners/SyncLoader';

import StateContext from '../../contexts/StateContext';
import productionService from '../../services/productionService';
import { notify_error, notify_success } from '../../utils/toastify';

import '../../styles/components/dashboard/BatchModal.scss';

export default function BatchModal(props) {
	function nextBatch() {
		productionService.productionNextBatch().then((response) => {
			console.log(response)
			if(response.data.error)
				notify_error('Falha ao avançar para o próximo lote!');
			else
				notify_success('Lote avançado com sucesso!');
		});
	}

	return (
		<Modal
			isOpen={props.isOpen}
			shouldCloseOnEsc={false}
			className="batch-modal"
			overlayClassName="modal-overlay"
		>
			<span>Lote finalizado</span>
			<span>Troque as camisetas e pressione o botão para continuar</span>

			<SyncLoader className="spinner" loading={true} color="#1f272d" />

			<button onClick={nextBatch}>Continuar</button>
		</Modal>
	);
}
