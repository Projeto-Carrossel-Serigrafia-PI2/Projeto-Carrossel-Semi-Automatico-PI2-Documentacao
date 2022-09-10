import { useEffect, useState, useRef } from 'react';
import Chart from 'react-apexcharts';
import { PDFExport } from '@progress/kendo-react-pdf';

import { QualitySection } from '../components/QualitySection';
import { ButtonRequest } from '../components/ButtonRequest';
import { BatchProps, ProductionProps } from '../utils/types';
import batchService from '../services/batchService';
import productionService from '../services/productionService';

import '../styles/pages/QualityReport.scss';

export function QualityReport() {
  const [productions, setProductions] = useState<ProductionProps[]>([]);
  const [batches, setBatches] = useState<BatchProps[]>([]);
  const [productionSelectedId, setProductionSelectedId] = useState(0);
  const [productionSelected, setProductionSelected] =
    useState<ProductionProps>();
  const [batchSelectedId, setBatchSelectedId] = useState(0);
  const [batchSelected, setBatchSelected] = useState<BatchProps>();
  const [batchesFiltered, setBatchesFiltered] = useState<BatchProps[]>([]);
  const [batchesMetrics, setBatchesMetrics] = useState<any>([]);
  const [productionMetrics, setProductionMetrics] = useState<any>([]);

  const pdfExportComponent = useRef(null);

  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  const chartOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    legend: {
      position: 'right',
    },
    colors: ['#333C83', '#F24A72', '#FDAF75', '#EAEA7F'],
    plotOptions: {
      pie: {
        customScale: 1,
      },
    },
  };

  const overallChartOptions = {
    ...chartOptions,
    title: {
      text: 'Resultados gerais',
      align: 'center',
    },
    labels: ['Lotes aprovados', 'Lotes não aprovados'],
  };

  async function handleChooseProduction(e) {
    setProductionSelectedId(e.target.value);
    const production = await productionService.productionGetOne(e.target.value);
    production.image = production.image.slice(2, production.image.length - 1);
    setProductionSelected({
      id: production.id,
      created_at: new Date(production.create_date).toLocaleDateString('pt-BR'),
      image_reference: production.image,
      total_shirts: production.totalDeCamisetas,
      speed: production.velocidade,
      paints: production.base_producao_get.map((item: any) => {
        return {
          id: item.id,
          base_id: item.base,
          production_id: item.producao,
          color: item.cor,
        };
      }),
    });

    setBatchSelectedId(0);
  }

  async function handleChooseBatch(e) {
    setBatchSelectedId(e.target.value);
    const batch = await batchService.batchGetOne(e.target.value);

    if (batch) {
      let image_string: string = batch.image;
      image_string = image_string.slice(2, batch.image.length - 1);
      batch.image = image_string;

      let image_failures_string: string = batch.imageFalhas;
      image_failures_string = image_failures_string.slice(
        2,
        batch.imageFalhas.length - 1
      );
      batch.imageFalhas = image_failures_string;

      let batch_formatted = {
        id: batch.id,
        image: batch.image,
        image_failures: batch.imageFalhas,
        production_id: batch.producao,
        quantity_shirts: batch.quantidadeDeCamisetas,
        quantity_failures: batch.quantidadeDeFalhas,
        similarity_colors: batch.similaridadeCor,
        similarity_format: batch.similaridadeFormato,
      };

      setBatchSelected(batch_formatted);
    }
  }

  useEffect(() => {
    async function getAllProductions() {
      const response = await productionService.productionGetAll();
      let data_formatted: ProductionProps[] = [];

      for (let i = 0; i < response.data.length; i++) {
        data_formatted.push({
          id: response.data[i].id,
          created_at: new Date(response.data[i].create_date).toLocaleDateString(
            'pt-BR'
          ),
          image_reference: response.data[i].image,
          total_shirts: response.data[i].totalDeCamisetas,
          speed: response.data[i].velocidade,
          paints: response.data[i].base_producao_get.map((item: any) => {
            return {
              id: item.id,
              base_id: item.base,
              production_id: item.producao,
              color: item.cor,
            };
          }),
        });
      }
      setProductions(data_formatted.reverse());
    }

    getAllProductions();
  }, []);

  useEffect(() => {
    async function getAllBatches() {
      const response = await batchService.batchGetAll();
      let data_formatted: BatchProps[] = [];

      for (let i = 0; i < response.data.length; i++) {
        data_formatted.push({
          id: response.data[i].id,
          image: response.data[i].image,
          image_failures: response.data[i].imageFalhas,
          production_id: response.data[i].producao,
          quantity_shirts: response.data[i].quantidadeDeCamisetas,
          quantity_failures: response.data[i].quantidadeDeFalhas,
          similarity_colors: response.data[i].similaridadeCor,
          similarity_format: response.data[i].similaridadeFormato,
        });
      }
      setBatches(data_formatted.reverse());
    }

    getAllBatches();
  }, []);

  useEffect(() => {
    function getBatchesFromProduction() {
      let data_filtered: BatchProps[] = [];

      if (productionSelectedId > 0) {
        data_filtered = batches.filter(
          (batch) => batch.production_id == productionSelectedId
        );
      }

      setBatchesFiltered(data_filtered.reverse());

      let approved = 0;
      let disapproved = 0;

      for (let i = 0; i < data_filtered.length; i++) {
        if (
          Number(data_filtered[i].similarity_format) >= 0.8 &&
          Number(data_filtered[i].similarity_colors) >= 0.8 &&
          data_filtered[i].quantity_failures <= 5
        ) {
          approved += 1;
        } else {
          disapproved += 1;
        }
      }

      let quality_format_average = 0;
      let quality_color_average = 0;
      let quality_matrix_average = 0;

      for (let i = 0; i < data_filtered.length; i++) {
        quality_format_average += Number(data_filtered[i].similarity_format);
        quality_color_average += Number(data_filtered[i].similarity_colors);
        quality_matrix_average += data_filtered[i].quantity_failures;
      }

      quality_format_average = quality_format_average / data_filtered.length;
      quality_color_average = quality_color_average / data_filtered.length;
      quality_matrix_average = quality_matrix_average / data_filtered.length;

      setBatchesMetrics([approved, disapproved]);
      setProductionMetrics({
        format: (quality_format_average * 100).toFixed(2),
        color: (quality_color_average * 100).toFixed(2),
        matrix: ((1 - (quality_matrix_average * 4) / 100) * 100).toFixed(2),
      });
    }

    getBatchesFromProduction();
  }, [productionSelectedId]);

  return (
    <div id='quality-report'>
      <header>
        <h1>Relatório de Qualidade</h1>

        <div>
          <select
            value={productionSelectedId}
            onChange={(e) => handleChooseProduction(e)}
            className='dropdown'
          >
            <option value=''>Selecione a Produção</option>
            {productions.map((production) => (
              <option key={production.id} value={production.id}>
                Produção n°: {production.id} | Data: {production.created_at}
              </option>
            ))}
          </select>

          <select
            value={batchSelectedId}
            onChange={(e) => handleChooseBatch(e)}
            className='dropdown'
          >
            <option value=''>Selecione o Lote</option>
            <option value={-1}>Todos</option>
            {productionSelectedId
              ? batchesFiltered?.map((batch, index) => (
                  <option key={batch.id} value={batch.id}>
                    Lote n° {index + 1}
                  </option>
                ))
              : null}
          </select>
        </div>
      </header>

      <div className='button-download-report'>
        <ButtonRequest
          title='Baixar relatório'
          onClick={exportPDFWithComponent}
          disabled={batchSelectedId > 0 || batchSelectedId == -1 ? false : true}
        />
      </div>

      <div className='pdf-export-container'>
        <PDFExport
          ref={pdfExportComponent}
          fileName={`relatorio_producao_${productionSelected?.id}`}
          margin='2cm'
        >
          {productionSelected ? (
            <div className='container-resume'>
              <section>
                <table>
                  <tr>
                    <td>Produção:</td>
                    <td>n° {productionSelected.id}</td>
                  </tr>

                  <tr>
                    <td>Data:</td>
                    <td>{productionSelected.created_at}</td>
                  </tr>

                  <tr>
                    <td>Total de camisetas:</td>
                    <td>{productionSelected.total_shirts}</td>
                  </tr>

                  <tr>
                    <td>Lotes aprovados:</td>
                    <td>{batchesMetrics[0]}</td>
                  </tr>

                  <tr>
                    <td>Lotes não aprovados:</td>
                    <td>{batchesMetrics[1]}</td>
                  </tr>

                  <tr>
                    <td>Total de lotes:</td>
                    <td>{batchesFiltered.length}</td>
                  </tr>

                  <tr>
                    <td>Qualidade média do formato:</td>
                    <td>{productionMetrics.format}%</td>
                  </tr>

                  <tr>
                    <td>Qualidade média da cor:</td>
                    <td>{productionMetrics.color}%</td>
                  </tr>

                  <tr>
                    <td>Qualidade média da matriz:</td>
                    <td>{productionMetrics.matrix}%</td>
                  </tr>
                </table>
              </section>

              <section>
                <div className='chart-box'>
                  <Chart
                    // height={350}
                    width={400}
                    options={overallChartOptions}
                    series={batchesMetrics}
                    type='pie'
                  />
                </div>
              </section>
            </div>
          ) : null}

          {productionSelected && batchSelectedId ? (
            <main className='main-report'>
              {batchSelectedId != -1 ? (
                <>
                  <h2>
                    Lote n°&nbsp;
                    {batchesFiltered.findIndex(
                      (batch) => batch.id == batchSelectedId
                    ) + 1}
                  </h2>

                  <QualitySection
                    qualityType='Qualidade do formato'
                    imageReference={productionSelected.image_reference}
                    imageBatch={batchSelected?.image}
                    reportDescription='A qualidade do formato avalia o contorno da estampa,
              isto é, se a estampa foi impressa como o esperado, sem falhas. Como
              resultado, é obtido um valor em porcentagem (0% a 100%), no qual
              quanto mais próximo do 100%, melhor é a qualidade da estampa.'
                    reportResult={`Qualidade: ${(
                      Number(batchSelected?.similarity_format) * 100
                    ).toFixed(2)}%`}
                  />

                  <QualitySection
                    qualityType='Qualidade da cor'
                    imageReference={productionSelected.image_reference}
                    imageBatch={batchSelected?.image}
                    reportDescription='A qualidade da cor avalia a tonalidade da cor da
            estampa, isto é, se a estampa foi impressa com a cor esperada. Como
            resultado, é obtido um valor em porcentagem (0% a 100%), no qual quanto
            mais próximo do 100%, melhor é a qualidade da estampa.'
                    reportResult={`Qualidade: ${(
                      Number(batchSelected?.similarity_colors) * 100
                    ).toFixed(2)}%`}
                  />

                  <QualitySection
                    qualityType='Qualidade da matriz'
                    imageReference={productionSelected.image_reference}
                    imageBatch={batchSelected?.image_failures}
                    reportDescription='A qualidade da matriz avalia se a estampa possui
            falhas em sua área, isto é, se possui pontos sem tintas, riscos, etc.
            Como resultado, é mostrado a imagem com retângulos nas regiões onde
            foram encontradas possíveis falhas e a sua respectiva quantidade.'
                    reportResult={`Quantidade de falhas: ${Number(
                      batchSelected?.quantity_failures
                    )}`}
                  />
                </>
              ) : (
                <>
                  {batchesFiltered.map((batchItem, batchIndex) => (
                    <>
                      <h2>
                        Lote n°&nbsp;
                        {batchIndex + 1}
                      </h2>

                      <QualitySection
                        qualityType='Qualidade do formato'
                        imageReference={productionSelected.image_reference}
                        imageBatch={batchItem?.image.slice(
                          2,
                          batchItem.image.length - 1
                        )}
                        reportDescription='A qualidade do formato avalia o contorno da estampa,
              isto é, se a estampa foi impressa como o esperado, sem falhas. Como
              resultado, é obtido um valor em porcentagem (0% a 100%), no qual
              quanto mais próximo do 100%, melhor é a qualidade da estampa.'
                        reportResult={`Qualidade: ${(
                          Number(batchItem?.similarity_format) * 100
                        ).toFixed(2)}%`}
                      />

                      <QualitySection
                        qualityType='Qualidade da cor'
                        imageReference={productionSelected.image_reference}
                        imageBatch={batchItem?.image.slice(
                          2,
                          batchItem.image.length - 1
                        )}
                        reportDescription='A qualidade da cor avalia a tonalidade da cor da
            estampa, isto é, se a estampa foi impressa com a cor esperada. Como
            resultado, é obtido um valor em porcentagem (0% a 100%), no qual quanto
            mais próximo do 100%, melhor é a qualidade da estampa.'
                        reportResult={`Qualidade: ${(
                          Number(batchItem?.similarity_colors) * 100
                        ).toFixed(2)}%`}
                      />

                      <QualitySection
                        qualityType='Qualidade da matriz'
                        imageReference={productionSelected.image_reference}
                        imageBatch={batchItem?.image_failures.slice(
                          2,
                          batchItem.image_failures.length - 1
                        )}
                        reportDescription='A qualidade da matriz avalia se a estampa possui
            falhas em sua área, isto é, se possui pontos sem tintas, riscos, etc.
            Como resultado, é mostrado a imagem com retângulos nas regiões onde
            foram encontradas possíveis falhas e a sua respectiva quantidade.'
                        reportResult={`Quantidade de falhas: ${Number(
                          batchItem?.quantity_failures
                        )}`}
                      />
                    </>
                  ))}
                </>
              )}
            </main>
          ) : null}
        </PDFExport>
      </div>
    </div>
  );
}
