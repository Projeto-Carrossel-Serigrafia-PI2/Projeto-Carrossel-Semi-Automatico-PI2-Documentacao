import { useState, useEffect } from 'react';

import { PaintCard } from '../components/PaintCard';
import { ButtonConfirm } from '../components/ButtonConfirm';
import { ModalPaints } from '../components/ModalPaints';
import paintService from '../services/paintService';
import { PaintProps } from '../utils/types';

import '../styles/pages/Paints.scss';

export function Paints() {
  const [paints, setPaints] = useState<PaintProps[]>([]);
  const [typePaint, setTypePaint] = useState('');
  const [dryingTemperature, setDryingTemperature] = useState(0);
  const [dryingTime, setDryingTime] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    async function getAllPaintsType() {
      const response = await paintService.paintGetAll();

      setPaints(response);
    }

    getAllPaintsType();
  }, [isModalOpen]);

  return (
    <div id="paints">
      <ModalPaints
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        closeModal={closeModal}
        paint={{ type: typePaint, dryingTemperature, dryingTime }}
        mode="criar"
      />

      <header>
        <h3>Tintas</h3>

        <div>
          <ButtonConfirm
            title="Nova tinta"
            color="#4fce88"
            onClick={openModal}
          />
        </div>
      </header>

      {paints.map((paint) => (
        <PaintCard
          key={paint.id}
          id={paint.id}
          type={paint.type}
          dryingTemperature={paint.dryingTemperature}
          dryingTime={paint.dryingTime}
        />
      ))}
    </div>
  );
}
