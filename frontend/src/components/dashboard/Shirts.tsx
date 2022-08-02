import { useState, useEffect, useContext } from 'react';
import { FaTshirt } from 'react-icons/fa';
import MoonLoader from 'react-spinners/MoonLoader';
import { Carousel } from 'react-responsive-carousel';
import Chart from 'react-apexcharts';

import '../../styles/components/dashboard/Shirts.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import StateContext from '../../contexts/StateContext';

export default function Shirts() {
	const { parameters, state } = useContext(StateContext);
	const [ inSession, setInSession ] = useState(true);
	const [ driedShirts, setDriedShirts ] = useState(0);
	const [ qualityResults, setQualityResults ] = useState([]);

	const chartOptions = {
		chart: {
			toolbar: {
				show: false
			}
		},
		legend: {
			position: 'top'
		},
		colors: ['#5457A9', '#D34BE9']
	};

	const overallChartOptions = {
		...chartOptions,
		labels: ['Aprovadas', 'Não aprovadas']
	};

	function getResults() {
		const results = [[10, 3]];

		setQualityResults(results);
	}

	useEffect(() => {
		if(state.batch >= parameters.batches && parameters.batches)
			setInSession(false);

		else
			setDriedShirts(Math.min(parameters.shirts, state.batch * 4));
	}, [state.batch]);

	useEffect(() => {
		getResults();
	}, []);

	return (
		<div className="shirts">
			<h1>Camisetas</h1>

			<div className="info">
				{ qualityResults.length
				  ? <div className="quality">
				  		<Carousel
				  			showThumbs={false}
				  			showStatus={false}
				  			showIndicators={false}
				  		>
				  			<div className="result overall">
				  				<Chart 
				  					options={overallChartOptions}
				  					series={qualityResults[0]}
				  					type="pie"
				  					height="60%"
				  				/>

				  				<table>
				  					<tr>
				  						<td>Aprovadas:</td>
				  						<td>{qualityResults[0][0]}</td>
				  					</tr>

				  					<tr>
				  						<td>Não aprovadas:</td>
				  						<td>{qualityResults[0][1]}</td>
				  					</tr>

				  					<tr>
				  						<td>Total:</td>
				  						<td>{parameters.shirts}</td>
				  					</tr>
				  				</table>
				  			</div>

				  			<div className="result position"></div>
				  			<div className="result shape"></div>
				  			<div className="result colors"></div>
				  			<div className="result matrix"></div>
				  		</Carousel>
				  	</div>
				  : <div className="drying">
				  		<div className="amount">
							<FaTshirt size="8em" color="gray" />

							<p>{ driedShirts } camisetas secas</p>
							<p>{ parameters.shirts - driedShirts } camisetas pendentes</p>
						</div>

						<div className="analysis">
							{ inSession
								? <>
									<MoonLoader speedMultiplier="0.5" />
									<p>Aguardando produção</p>
								  </>
								: <button>Iniciar análise</button>
							}
							
						</div>
					</div>
				}
			</div>
		</div>
	);
}
