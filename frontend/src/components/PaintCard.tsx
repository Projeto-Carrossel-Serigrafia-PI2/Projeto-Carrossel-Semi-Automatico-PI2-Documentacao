import { useState } from 'react';

import { ButtonConfirm } from './ButtonConfirm';
import { ModalPaints } from './ModalPaints';

import { PaintProps } from '../utils/types';

import '../styles/components/PaintCard.scss';

export function PaintCard(props: PaintProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // setSessionActive('none');
  };

  return (
    <div id="paint-card">
      <ModalPaints
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        paint={props}
        mode="editar"
      />

      <div className="data-box">
        <h2>Tipo de tinta:</h2>
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
          <ButtonConfirm title="Editar" color="#1F272D" onClick={openModal} />
        </div>
        <ButtonConfirm title="Remover" color="#DE5757" />
      </div>
    </div>
  );
}
