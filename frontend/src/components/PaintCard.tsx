import { useState } from 'react';

import { ButtonRequest } from './ButtonRequest';
import { PaintProps } from '../utils/types';

import '../styles/components/PaintCard.scss';

export function PaintCard(props: PaintProps) {
  return (
    <div id="paint-card">
      <div className="data-box">
        <h2>Base de tinta:</h2>

        <p>{props.type}</p>
      </div>

      <div className="data-box">
        <h2>Temperatura de secagem:</h2>
        <p>{props.dryingTemperature} °C</p>
      </div>

      <div className="data-box">
        <h2>Tempo de secagem:</h2>
        <p>{props.dryingTime} segundos</p>
      </div>

      <div className="buttons-group">
        <div>
          <ButtonRequest
            title="Editar"
            color="#1F272D"
            onClick={() => props.openModalPaints('editar', props)}
          />
        </div>
        <ButtonRequest
          title="Remover"
          color="#DE5757"
          onClick={() => props.openModalConfirm(props)}
        />
      </div>
    </div>
  );
}
