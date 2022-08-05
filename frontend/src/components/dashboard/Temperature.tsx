import { useState, useEffect, useContext } from 'react';

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
					<span>Flashcure</span>

					<ProgressBar
						unit="°C"
						limits={temperatureLimits}
						current={state.temperatures[0]}
						width="80%"
						height="1.5em"
						color="#FF5555"
					/>
				</div>

				<div className="environment">
					<span>Ambiente</span>
					
					<ProgressBar
						unit="°C"
						limits={[0, 100]}
						current={state.temperatures[1]}
						width="80%"
						height="1.5em"
						color="#277B96"
					/>
				</div>
			</div>
		</div>
	);
}
