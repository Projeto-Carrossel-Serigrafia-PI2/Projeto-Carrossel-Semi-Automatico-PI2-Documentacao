import { useState } from 'react';

import { ButtonRequest } from './ButtonRequest';
import { ModalPaints } from './ModalPaints';
import { PaintProps } from '../utils/types';

import '../styles/components/PaintCard.scss';
import { ModalConfirm } from './ModalConfirm';

export function PaintCard(props: PaintProps) {
  const [isModalPaintsOpen, setIsModalPaintsOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);

  const openModalPaints = () => {
    setIsModalPaintsOpen(true);
  };

  const closeModalPaints = () => {
    setIsModalPaintsOpen(false);
  };

  const openModalConfirm = () => {
    setIsModalConfirmOpen(true);
  };

  const closeModalConfirm = () => {
    setIsModalConfirmOpen(false);
  };

  return (
    <div id="paint-card">
      <ModalPaints
        isModalOpen={isModalPaintsOpen}
        setIsModalOpen={setIsModalPaintsOpen}
        closeModal={closeModalPaints}
        paint={props}
        mode="editar"
      />

      <ModalConfirm
        isModalOpen={isModalConfirmOpen}
        setIsModalOpen={setIsModalConfirmOpen}
        closeModal={closeModalConfirm}
        paint={props}
      />

      <div className="data-box">
        <h2>Base da tinta:</h2>
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
          <ButtonRequest title="Editar" color="#1F272D" onClick={openModalPaints} />
        </div>
        <ButtonRequest
          title="Remover"
          color="#DE5757"
          onClick={openModalConfirm}
        />
      </div>
    </div>
  );
}
