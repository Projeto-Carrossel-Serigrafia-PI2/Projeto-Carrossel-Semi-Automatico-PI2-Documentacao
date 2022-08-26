import BounceLoader from 'react-spinners/BounceLoader';

import DashboardModal from './Modal'

export default function PauseModal(props) {
	return (
		<DashboardModal isOpen={props.isOpen}>
			<div>
				<span>Repique em andamento</span>
				<span>Mantenha o carrossel alinhado como estava antes do início do repique para resumir a produção</span>
			</div>

			<BounceLoader className="spinner" loading={true} color="#1f272d" />

			<button onClick={props.toggleRepainting}>Resumir</button>
		</DashboardModal>
	);
}
