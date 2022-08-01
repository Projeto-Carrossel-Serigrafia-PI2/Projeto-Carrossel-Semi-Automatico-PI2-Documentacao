import { useState, useEffect } from 'react';

import '../../styles/components/dashboard/Time.scss';

export default function Time() {
	const [ hour, setHour ] = useState(0);
	const [ minute, setMinute ] = useState(0);
	const [ second, setSecond ] = useState(0);

	let interval = null;
	let elapsedTime = 0;
	let before = 0;

	function addLeadingZeros(num, totalLength) {
		return String(num).padStart(totalLength, '0');
	}

	function counter() {
		const now = Date.now();

		elapsedTime += (now - before)/1000;

		setHour(Math.floor(elapsedTime/3600));
		setMinute(Math.floor((elapsedTime%3600)/60));
		setSecond(Math.floor(elapsedTime%60));

		before = now;
	}

	// On mount
	useEffect(() => {
		const storagedTime = localStorage.getItem('elapsedTime');
		if(storagedTime)
			elapsedTime = parseInt(storagedTime);

		before = Date.now();
		interval = setInterval(counter, 1000);

		// Will unmount
		return () => {
			localStorage.setItem('elapsedTime', elapsedTime);
			clearInterval(interval);
		}
	}, []);

	return (
		<div className="time">
			<h1>Tempo de execução</h1>

			<div className="info">
				<h1>{ addLeadingZeros(hour, 2) }:{ addLeadingZeros(minute, 2) }:{ addLeadingZeros(second, 2) }</h1>
			</div>
		</div>
	);
}
