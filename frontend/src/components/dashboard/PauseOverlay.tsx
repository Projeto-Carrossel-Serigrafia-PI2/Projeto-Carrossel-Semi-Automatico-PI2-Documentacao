import SyncLoader from 'react-spinners/SyncLoader';

import '../../styles/components/dashboard/PauseOverlay.scss';

export default function PauseOverlay(props) {
	return props.isPaused && (
		<div className="pause-overlay">
			<div className="front">
				<div>
					<span>Produção pausada</span>
				</div>

				<SyncLoader className="spinner" loading={true} color="#1f272d" />

				<button onClick={props.toggleProduction}>Resumir</button>
			</div>
		</div>
	);
}
