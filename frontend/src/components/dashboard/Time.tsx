import { useState, useEffect, useContext } from 'react';

import StateContext from '../../contexts/StateContext';
import productionService from '../../services/productionService';

import '../../styles/components/dashboard/Time.scss';

export default function Time(props) {
	const { state } = useContext(StateContext);
	const [ previousInSession, setPreviousInSession ] = useState(false);
	const [ hour, setHour ] = useState(0);
	const [ minute, setMinute ] = useState(0);
	const [ second, setSecond ] = useState(0);
	const [ isDone, setisDone ] = useState(false);
	const [ elapsedTime, setElapsedTime ] = useState(0);

	let interval = null;
	let before = Date.now();

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, '0');
	}

	function counter() {
		const now = Date.now();

		setElapsedTime(elapsedTime + (now - before)/1000);

		setHour(Math.floor(elapsedTime/3600));
		setMinute(Math.floor((elapsedTime%3600)/60));
		setSecond(Math.floor(elapsedTime%60));

		before = now;
	}

	useEffect(() => {
		const storagedTime = localStorage.getItem('elapsedTime');
		if(storagedTime)
			setElapsedTime(parseInt(storagedTime));

		return () => localStorage.setItem('elapsedTime', elapsedTime)
	}, []);

	useEffect(() => {
		if(!(isDone || props.isPaused))
		 setTimeout(counter, 1000);
		//console.log('isDone', isDone, 'isPaused', props.isPaused)
	}, [elapsedTime, props.isPaused]);

	useEffect(() => {
		if(!state.inSession && state.inSession != previousInSession) {
			localStorage.setItem('elapsedTime', elapsedTime);
			productionService.productionSubmitTime(elapsedTime);
			
			setisDone(true);
		}

		setPreviousInSession(state.inSession);
	}, [state.inSession]);

	return (
		<div className="time">
			<h1>Tempo de execução</h1>

			<div className="info">
				<h1>{ addLeadingZeros(hour, 2) }:{ addLeadingZeros(minute, 2) }:{ addLeadingZeros(second, 2) }</h1>
			</div>
		</div>
	);
}
