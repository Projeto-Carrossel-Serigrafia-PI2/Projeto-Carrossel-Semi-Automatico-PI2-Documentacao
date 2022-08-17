import SyncLoader from 'react-spinners/SyncLoader';

import DashboardModal from './Modal'

export default function PauseModal(props) {
	return (
		<DashboardModal isOpen={props.isOpen}>
			<div>
				<span>Produção pausada</span>
			</div>

			<SyncLoader className="spinner" loading={true} color="#1f272d" />

			<button onClick={props.toggleProduction}>Resumir</button>
		</DashboardModal>
	);
}
