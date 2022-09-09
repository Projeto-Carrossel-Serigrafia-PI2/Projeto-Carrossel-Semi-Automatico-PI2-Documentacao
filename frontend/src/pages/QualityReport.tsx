import { useEffect, useState } from 'react';

import { QualitySection } from '../components/QualitySection';
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

  async function handleChooseProduction(e) {
    setProductionSelectedId(e.target.value);
    let production = await productionService.productionGetOne(e.target.value);
    production.image = production.image.slice(2, production.image.length - 1);
    setProductionSelected(production);
    setBatchSelectedId(0);
  }

  async function handleChooseBatch(e) {
    setBatchSelectedId(e.target.value);
    const batch = await batchService.batchGetOne(e.target.value);

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
    }

    getBatchesFromProduction();
  }, [productionSelectedId]);

  return (
    <div id='quality-report'>
      <header>
        <h1>Relatório de Qualidade</h1>

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
          {productionSelectedId
            ? batchesFiltered?.map((batch, index) => (
                <option key={batch.id} value={batch.id}>
                  Lote n° {index + 1}
                </option>
              ))
            : null}
        </select>
      </header>

      {productionSelected && batchSelectedId ? (
        <main>
          <h2>
            Lote n°{' '}
            {batchesFiltered.findIndex((batch) => batch.id == batchSelectedId) +
              1}{' '}
            (Produção n° {productionSelected.id} | Data:{' '}
            {new Date(productionSelected.create_date).toLocaleDateString(
              'pt-BR'
            )}
            )
          </h2>

          <QualitySection
            qualityType='Qualidade do formato'
            imageReference={productionSelected.image}
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
            imageReference={productionSelected.image}
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
            imageReference={productionSelected.image}
            imageBatch={batchSelected?.image_failures}
            reportDescription='A qualidade da matriz avalia se a estampa possui
          falhas em sua área, isto é, se possui pontos sem tintas, riscos, etc.
          Como resultado, é mostrado a imagem com retângulos nas regiões onde
          foram encontradas possíveis falhas e a sua respectiva quantidade.'
            reportResult={`Quantidade de falhas: ${Number(
              batchSelected?.quantity_failures
            )}`}
          />
        </main>
      ) : null}
    </div>
  );
}
