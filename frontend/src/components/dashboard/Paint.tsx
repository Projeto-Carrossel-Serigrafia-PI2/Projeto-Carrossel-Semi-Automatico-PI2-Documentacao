import { useState, useEffect, useContext } from 'react';

import paintService from '../../services/paintService';
import StateContext from '../../contexts/StateContext';

import '../../styles/components/dashboard/Paint.scss';

export default function Paint() {
	const [ paints, setPaints ] = useState([]);
	const { parameters, state } = useContext(StateContext);

	// On mount
	useEffect(() => {
		paintService.paintGetAll().then((data) => {
			setPaints(data);
		});
	}, []);

	return (
		<div className="paint">
			<h1>Tintas</h1>

			<div className="info">
				<h2>{ parameters.paints.length ? parameters.paints[state.paint].color : '-'}</h2>
				<h3>{ parameters.paints.length && paints.length ? paints[parameters.paints[state.paint].base].type : '-'}</h3>
				<h4>{ parameters.paints.length ? `${state.paint + 1}/${parameters.paints.length}` : '0/0' }</h4>
			</div>
		</div>
	);
}
