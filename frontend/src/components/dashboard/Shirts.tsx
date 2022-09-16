import { useState, useEffect, useContext } from 'react';

import { FaTshirt } from 'react-icons/fa';
import MoonLoader from 'react-spinners/MoonLoader';
import { Carousel } from 'react-responsive-carousel';
import Chart from 'react-apexcharts';

import '../../styles/components/dashboard/Shirts.scss';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import StateContext from '../../contexts/StateContext';
import productionService from '../../services/productionService';
import batchService from '../../services/batchService';

export default function Shirts() {
  const { parameters, state } = useContext(StateContext);
  const [driedShirts, setDriedShirts] = useState(0);
  const [spinnerSize, setSpinnerSize] = useState(35);
  const [qualityResults, setQualityResults] = useState([]);
  const [quantityBatches, setQuantityBatches] = useState(0);

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#333C83', '#F24A72', '#FDAF75', '#EAEA7F'],
  };

  const overallChartOptions = {
    ...chartOptions,
    title: {
      text: 'Resultados gerais',
      align: 'center',
    },
    labels: ['Lotes aprovados', 'Lotes não aprovados'],
  };

  const errorChartOptions = {
    ...chartOptions,
    title: {
      text: 'Erros por métrica',
      align: 'center',
    },
    labels: ['Formato', 'Cor', 'Matriz'],
  };

  async function getResults() {
    // Get last production
    let productions = [];
    const response_productions = await productionService.productionGetAll();
    productions = response_productions.data;
    let current_production = productions.pop();

    // Get batches from the last production
    const response_batches = await batchService.batchGetAll();
    let batches = response_batches.data;
    let batches_filtered = batches.filter(
      (batch: any) => batch.producao == current_production.id
    );

    let approved = 0;
    let disapproved = 0;

    for (let i = 0; i < batches_filtered.length; i++) {
      if (
        Number(batches[i].similaridadeFormato) >= 0.8 &&
        Number(batches[i].similaridadeCor) >= 0.8 &&
        batches[i].quantidadeDeFalhas <= 5
      ) {
        approved += 1;
      } else {
        disapproved += 1;
      }
    }

    setQuantityBatches(approved + disapproved);

    let metrics = [];

    for (let i = 0; i < batches_filtered.length; i++) {
      metrics.push({
        shape: (Number(batches_filtered[i].similaridadeFormato) * 100).toFixed(2),
        color: (Number(batches_filtered[i].similaridadeCor) * 100).toFixed(2),
        matrix: batches_filtered[i].quantidadeDeFalhas,
      })
    }

    const results = [
      [approved, disapproved],
      [3, 2, 0, 1],
      [...metrics],
    ];

    setQualityResults(results);
  }

  function resizeSpinner() {
    return window.screen.width <= 1024
      ? setSpinnerSize(45)
      : setSpinnerSize(60);
  }

  useEffect(() => {
    resizeSpinner();
    window.addEventListener('resize', resizeSpinner);

    return () => {
      window.removeEventListener('resize', resizeSpinner);
    };
  }, []);

  useEffect(() => {
    if (!state.inSession) setDriedShirts(parameters.shirts);
    else setDriedShirts(Math.min(parameters.shirts, state.batch * 4));
  }, [state.batch, state.inSession]);

  return (
    <div className='shirts'>
      <h1>Camisetas</h1>

      <div className='info'>
        {qualityResults.length ? (
          <div className='quality'>
            <Carousel
              showThumbs={false}
              showStatus={false}
              showIndicators={false}
            >
              <div className='result overall'>
                <Chart
                  options={overallChartOptions}
                  series={qualityResults[0]}
                  type='pie'
                  height='65%'
                />

                <table>
                  <tr>
                    <td>Lotes aprovados:</td>
                    <td>{qualityResults[0][0]}</td>
                  </tr>

                  <tr>
                    <td>Lotes não aprovados:</td>
                    <td>{qualityResults[0][1]}</td>
                  </tr>

                  <tr>
                    <td>Total de lotes:</td>
                    <td>{quantityBatches}</td>
                  </tr>
                </table>
              </div>

              {/* <div className='result errors'>
                <Chart
                  options={errorChartOptions}
                  series={qualityResults[1]}
                  type='donut'
                  height='100%'
                />
              </div> */}

              {qualityResults[2].map((result, index) => (
                <table className='result batches'>
                  <tr>
                    <th colSpan={2}>Lote {index + 1}</th>
                  </tr>

                  <tr>
                    <td>Formato: </td>
                    <td>{result.shape}%</td>
                  </tr>

                  <tr>
                    <td>Cor:</td>
                    <td>{result.color}%</td>
                  </tr>

                  <tr>
                    <td>Matriz:</td>
                    <td>{result.matrix} falha(s)</td>
                  </tr>
                </table>
              ))}
            </Carousel>
          </div>
        ) : (
          <div className='drying'>
            <div className='amount'>
              <FaTshirt size='8em' color='gray' />

              <p>{driedShirts} camisetas secas</p>
              <p>{parameters.shirts - driedShirts} camisetas pendentes</p>
            </div>

            <div className='analysis'>
              {state.inSession ? (
                <>
                  <MoonLoader speedMultiplier='0.5' size={spinnerSize} />
                  <p>Aguardando produção</p>
                </>
              ) : (
                <button onClick={getResults}>Verificar análise</button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
