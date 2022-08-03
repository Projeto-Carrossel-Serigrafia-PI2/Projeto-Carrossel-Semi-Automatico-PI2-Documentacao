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
		colors: ['#333C83', '#F24A72', '#FDAF75', '#EAEA7F']
	};

	const overallChartOptions = {
		...chartOptions,
		title: {
			text: 'Resultados gerais',
			align: 'center'
		},
		labels: ['Aprovadas', 'Não aprovadas']
	};

	const errorChartOptions = {
		...chartOptions,
		title: {
			text: 'Erros por tipo',
			align: 'center'
		},
		labels: ['Formato', 'Posição', 'Cor', 'Matriz']
	};

	function getResults() {
		const results = [[10, 3], [3, 2, 0, 1], [{shape: 0.94, position: 0.98, color: 0.95, matrix: 1}, 
												 {shape: 0.99, position: 0.92, color: 0.87, matrix: 0}
												]];

		setQualityResults(results);
	}

	useEffect(() => {
		if(state.batch >= parameters.batches && parameters.batches)
			setInSession(false);

		else
			setDriedShirts(Math.min(parameters.shirts, state.batch * 4));
	}, [state.batch]);

	/*useEffect(() => {
		getResults();
	}, []);*/

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
				  					height="65%"
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

				  			<div className="result errors">
				  				<Chart 
				  					options={errorChartOptions}
				  					series={qualityResults[1]}
				  					type="donut"
				  					height="100%"
				  				/>
				  			</div>

				  			{ qualityResults[2].map((result, index) =>
				  				<table className="result batches">
			  						<tr>
			  							<th colspan="2">Lote {index + 1}</th>
			  						</tr>

			  						<tr>
			  							<td>Formato: </td>
			  							<td>{result.shape}</td>
			  						</tr>

			  						<tr>
			  							<td>Posição:</td>
			  							<td>{result.position}</td>
			  						</tr>

			  						<tr>
			  							<td>Cor:</td>
			  							<td>{result.color}</td>
			  						</tr>

			  						<tr>
			  							<td>Matriz:</td>
			  							<td>{result.matrix}</td>
			  						</tr>
			  					</table>
			  				  )
				  			}
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
