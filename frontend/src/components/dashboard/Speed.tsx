import { useContext, useState, useEffect } from 'react';

import ProgressBar from './ProgressBar';

import StateContext from '../../contexts/StateContext';

import limitsService from '../../services/limitsService';

import '../../styles/components/dashboard/Speed.scss';

export default function Speed() {
	const { parameters } = useContext(StateContext);
	const [ speedLimit, setSpeedLimit ] = useState(3);

	useEffect(() => {
		limitsService.getLimits().then((response) => {
			setSpeedLimit(response.data.speed);
		});
	}, []);

	return (
		<div className="speed">
			<h1>Velocidades</h1>

			<div className="info">
				<div className="motor">
					<span>Motor</span>

					<ProgressBar
						unit=""
						limits={[0, speedLimit]}
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
