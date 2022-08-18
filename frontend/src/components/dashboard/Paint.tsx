import { useState, useEffect, useContext } from 'react';

import paintService from '../../services/paintService';
import StateContext from '../../contexts/StateContext';

import '../../styles/components/dashboard/Paint.scss';

import errorHandler from '../../utils/errorHandler';

export default function Paint() {
	const [ paints, setPaints ] = useState([]);
	const { parameters, state } = useContext(StateContext);

	function findPaint(e) {
		return e.id == parameters.paints[state.paint].base;
	}

	// On mount
	useEffect(() => {
		paintService.paintGetAll().then((data) => {
			setPaints(data);
		}).catch(errorHandler);
	}, []);

	return (
		<div className="paint">
			<h1>Tintas</h1>

			<div className="info">
				<h2>{ parameters.paints.length ? parameters.paints[state.paint].color : '-'}</h2>
				<h3>{ parameters.paints.length && paints.length ? paints.find(findPaint).type : '-'}</h3>
				<h4>{ parameters.paints.length ? `${state.paint + 1}/${parameters.paints.length}` : '0/0' }</h4>
			</div>
		</div>
	);
}
