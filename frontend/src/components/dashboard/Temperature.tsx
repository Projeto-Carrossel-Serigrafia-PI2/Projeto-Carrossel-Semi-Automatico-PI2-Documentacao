import { useContext } from 'react';

import ProgressBar from './ProgressBar';

import StateContext from '../../contexts/StateContext';

import '../../styles/components/dashboard/Temperature.scss';

export default function Temperature() {
	const { state } = useContext(StateContext);

	const temperatureLimits = [0, 200];

	return (
		<div className="temperature">
			<h1>Temperaturas</h1>

			<div className="info">
				<div className="flashcure">
					<span>Na camisa</span>

					<ProgressBar
						unit="°C"
						limits={temperatureLimits}
						current={state.temperatures[0].toFixed(1)}
						width="80%"
						height="1.85em"
						color="#FF5555"
					/>
				</div>

				<div className="environment">
					<span>Ambiente</span>
					
					<ProgressBar
						unit="°C"
						limits={temperatureLimits}
						current={state.temperatures[1].toFixed(1)}
						width="80%"
						height="1.85em"
						color="#277B96"
					/>
				</div>
			</div>
		</div>
	);
}
