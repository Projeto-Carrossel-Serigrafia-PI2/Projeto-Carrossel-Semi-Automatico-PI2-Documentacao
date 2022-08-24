import { useEffect, useState } from 'react';

import { QualitySection } from '../components/QualitySection';
import { BatchProps, ProductionProps } from '../utils/types';
import batchService from '../services/batchService';
import productionService from '../services/productionService';

import '../styles/pages/QualityReport.scss';

export function QualityReport() {
  const [productions, setProductions] = useState<ProductionProps[]>([]);
  const [batches, setBatches] = useState<BatchProps[]>([]);
  const [productionSelected, setProductionSelected] = useState(0);
  const [batchSelectedId, setBatchSelectedId] = useState(0);
  const [batchSelected, setBatchSelected] = useState(0);
  const [batchesFiltered, setBatchesFiltered] = useState<BatchProps[]>([]);

  function handleChooseProduction(e) {
    setProductionSelected(e.target.value);
    setBatchSelectedId(0);
  }

  function handleChooseBatch(e) {
    setBatchSelectedId(e.target.value);
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

      if (productionSelected > 0) {
        data_filtered = batches.filter(
          (batch) => batch.production_id == productionSelected
        );
      }

      setBatchesFiltered(data_filtered.reverse());
    }

    getBatchesFromProduction();
  }, [productionSelected]);

  return (
    <div id='quality-report'>
      <header>
        <h1>Relatório de Qualidade</h1>

        <select
          value={productionSelected}
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
          {productionSelected
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
            (Produção n° {productionSelected} | Data:{' '}
            {
              productions.filter(
                (production) => production.id == productionSelected
              )[0].created_at
            }
            )
          </h2>

          <QualitySection
            qualityType='Qualidade do formato'
            imageReference='https://imgcentauro-a.akamaihd.net/900x900/85769819A1/camisa-adams-soccer-masculina-img.jpg'
            imageBatch='https://imgcentauro-a.akamaihd.net/900x900/85769819A1/camisa-adams-soccer-masculina-img.jpg'
            reportDescription='A qualidade do formato avalia o contorno da estampa,
            isto é, se a estampa foi impressa como o esperado, sem falhas. Como
            resultado, é obtido um valor em porcentagem (0% a 100%), no qual
            quanto mais próximo do 100%, melhor é a qualidade da estampa.'
            reportResult='Qualidade: 100%'
          />

          <QualitySection
            qualityType='Qualidade da cor'
            imageReference='https://imgcentauro-a.akamaihd.net/900x900/85769819A1/camisa-adams-soccer-masculina-img.jpg'
            imageBatch='https://imgcentauro-a.akamaihd.net/900x900/85769819A1/camisa-adams-soccer-masculina-img.jpg'
            reportDescription='A qualidade da cor avalia a tonalidade da cor da
          estampa, isto é, se a estampa foi impressa com a cor esperada. Como
          resultado, é obtido um valor em porcentagem (0% a 100%), no qual quanto
          mais próximo do 100%, melhor é a qualidade da estampa.'
            reportResult='Qualidade: 90%'
          />

          <QualitySection
            qualityType='Qualidade da matriz'
            imageReference='https://imgcentauro-a.akamaihd.net/900x900/85769819A1/camisa-adams-soccer-masculina-img.jpg'
            imageBatch='https://imgcentauro-a.akamaihd.net/900x900/85769819A1/camisa-adams-soccer-masculina-img.jpg'
            reportDescription='A qualidade da matriz avalia se a estampa possui
          falhas em sua área, isto é, se possui pontos sem tintas, riscos, etc.
          Como resultado, é mostrado a imagem com retângulos nas regiões onde
          foram encontradas possíveis falhas e a sua respectiva quantidade.'
            reportResult='Quantidade: 4'
          />
        </main>
      ) : null}
    </div>
  );
}
