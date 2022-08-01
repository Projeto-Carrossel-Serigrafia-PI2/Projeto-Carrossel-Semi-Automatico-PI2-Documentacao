import { useState, useEffect, useContext } from 'react';
import { FaTshirt } from 'react-icons/fa';
import MoonLoader from 'react-spinners/MoonLoader';
import { Carousel } from 'react-responsive-carousel';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

import StateContext from '../contexts/StateContext';

export default function Shirts() {
	const { parameters, state } = useContext(StateContext);
	const [ inSession, setInSession ] = useState(true);
	const [ driedShirts, setDriedShirts ] = useState(0);
	const [ qualityResults, setQualityResults ] = useState([]);

	useEffect(() => {
		if(state.batch >= parameters.batches && parameters.batches)
			setInSession(false);

		else
			setDriedShirts(Math.min(parameters.shirts, state.batch * 4));
	}, [state.batch]);

	return (
		<div className="shirts">
			<h1>Camisetas</h1>

			<div className="info">
				{ qualityResults.length
				  ? <div className="quality">
				  		<Carousel showThumbs={false}>
				  			<div className="a">a</div>
				  			<div className="a">b</div>
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
