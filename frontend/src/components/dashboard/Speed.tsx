import { useContext } from 'react';

import ProgressBar from './ProgressBar';

import StateContext from '../../contexts/StateContext';

import '../../styles/components/dashboard/Speed.scss';

export default function Speed() {
	const { parameters } = useContext(StateContext); // Needs to have chosen speed

	const speeds = [0, 3];

	return (
		<div className="speed">
			<h1>Velocidades</h1>

			<div className="info">
				<div className="motor">
					<span>Motor</span>

					<ProgressBar
						unit=""
						limits={speeds}
						current={parameters.speed}
						width="80%"
						height="1.85em"
						color="#FD9E47"
					/>
				</div>
			</div>
		</div>
	);
}
