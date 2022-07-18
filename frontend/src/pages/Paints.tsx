import { useState } from 'react';
import { PaintCard } from '../components/PaintCard';
import { PaintProps } from '../utils/types';

import '../styles/pages/Paints.scss';
import { ButtonConfirm } from '../components/ButtonConfirm';
import { ModalPaints } from '../components/ModalPaints';

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

  return (
    <div id="paints">
      <ModalPaints
        isModalOpen={isModalOpen}
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

      <PaintCard type="base de água" dryingTemperature={120} dryingTime={5} />
      <PaintCard type="plastisol" dryingTemperature={170} dryingTime={7} />
    </div>
  );
}
