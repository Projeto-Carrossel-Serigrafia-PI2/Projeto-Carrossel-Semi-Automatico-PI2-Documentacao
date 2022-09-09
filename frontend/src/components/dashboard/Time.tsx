import { useState, useEffect, useContext, useRef } from 'react';

import StateContext from '../../contexts/StateContext';
import productionService from '../../services/productionService';

import '../../styles/components/dashboard/Time.scss';

import errorHandler from '../../utils/errorHandler';

export default function Time(props) {
	const { state } = useContext(StateContext);
	const [ previousInSession, setPreviousInSession ] = useState(false);
	const [ hour, setHour ] = useState(0);
	const [ minute, setMinute ] = useState(0);
	const [ second, setSecond ] = useState(0);
	const [ isDone, setisDone ] = useState(false);
	const [ elapsedTime, setElapsedTime ] = useState(0);
	const [ before, setBefore ] = useState(Date.now());
	const [ wasPaused, setWasPaused ] = useState(false);

	const skipUpdate = useRef(false);

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, '0');
	}

	function counter() {
		const now = Date.now();
		
		if(wasPaused) {
			setWasPaused(false);
			setElapsedTime(elapsedTime + 1)
		}

		else
			setElapsedTime(elapsedTime + (now - before)/1000);

		setHour(Math.floor(elapsedTime/3600));
		setMinute(Math.floor((elapsedTime%3600)/60));
		setSecond(Math.floor(elapsedTime%60));

		setBefore(now);

		localStorage.setItem('elapsedTime', elapsedTime)
		localStorage.setItem('before', before)
	}

	useEffect(() => {
		const storagedTime = localStorage.getItem('elapsedTime');
		const storagedBefore = localStorage.getItem('before');

		if(storagedTime) {
			setElapsedTime(parseInt(storagedTime));
			skipUpdate.current = true;
		}

		if(storagedBefore)
			setBefore(parseInt(storagedBefore));
	}, []);

	useEffect(() => {
		if(skipUpdate.current)
			skipUpdate.current = false;
		else {
			if(!(isDone || props.isPaused))
			 setTimeout(counter, 1000);
			else if(props.isPaused)
				setWasPaused(true);
		}
	}, [elapsedTime, props.isPaused]);

	useEffect(() => {
		if(!state.inSession && state.inSession != previousInSession) {
			localStorage.setItem('elapsedTime', elapsedTime);
			productionService.productionSubmitTime(elapsedTime).catch(errorHandler);
			
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
