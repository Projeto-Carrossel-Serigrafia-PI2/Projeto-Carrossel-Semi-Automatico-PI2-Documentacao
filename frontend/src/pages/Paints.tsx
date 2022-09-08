import { useState, useEffect } from 'react';

import { PaintCard } from '../components/PaintCard';
import { ButtonRequest } from '../components/ButtonRequest';
import { ModalPaints } from '../components/ModalPaints';
import { ModalConfirm } from '../components/ModalConfirm';
import paintService from '../services/paintService';
import { PaintProps } from '../utils/types';

import '../styles/pages/Paints.scss';

export function Paints() {
  const [paints, setPaints] = useState<PaintProps[]>([]);
  const [typePaint, setTypePaint] = useState('');
  const [dryingTemperature, setDryingTemperature] = useState(0);
  const [dryingTime, setDryingTime] = useState(0);
  const [reload, setReload] = useState(false);

  const [isModalPaintsOpen, setIsModalPaintsOpen] = useState(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState('criar');
  const [selectedPaint, setSelectedPaint] = useState({});

  const openModalPaints = (mode = 'criar', paint = { type: typePaint, dryingTemperature, dryingTime }) => {
    setModalMode(mode);
    setSelectedPaint(paint);

    setIsModalPaintsOpen(true);
  };

  const closeModalPaints = () => {
    setIsModalPaintsOpen(false);
  };

  const openModalConfirm = (paint) => {
    setSelectedPaint(paint);

    setIsModalConfirmOpen(true);
  };

  const closeModalConfirm = () => {
    setIsModalConfirmOpen(false);
  };

  useEffect(() => {
    async function getAllPaintsType() {
      const response = await paintService.paintGetAll();

      setPaints(response);
    }

    getAllPaintsType();
  }, [isModalPaintsOpen, reload]);

  return (
    <div id="paints" className={paints.length <= 0 ? 'no-paints' : ''}>
      <ModalPaints
        isModalOpen={isModalPaintsOpen}
        setIsModalOpen={setIsModalPaintsOpen}
        closeModal={closeModalPaints}
        paint={selectedPaint}
        mode={modalMode}
      />

      <ModalConfirm
        isModalOpen={isModalConfirmOpen}
        setIsModalOpen={setIsModalConfirmOpen}
        closeModal={closeModalConfirm}
        paint={selectedPaint}
      />

      <header>
        <h1>Bases de Tinta</h1>

        <div>
          <ButtonRequest
            title="Nova base de tinta"
            color="#4fce88"
            onClick={() => openModalPaints()}
          />
        </div>
      </header>

      {paints.length > 0 ? (
        paints.map((paint) => (
          <PaintCard
            key={paint.id}
            id={paint.id}
            type={paint.type}
            dryingTemperature={paint.dryingTemperature}
            dryingTime={paint.dryingTime}
            setReload={setReload}
            openModalPaints={openModalPaints}
            openModalConfirm={openModalConfirm}
          />
        ))
      ) : (
        <span>Nenhuma base de tinta cadastrada</span>
      )}
    </div>
  );
}
