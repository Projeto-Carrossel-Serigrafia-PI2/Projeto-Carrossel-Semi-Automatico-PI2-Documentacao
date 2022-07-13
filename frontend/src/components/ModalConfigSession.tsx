import { useState } from 'react';
import Modal from 'react-modal';
import { FiMinus, FiPlus } from 'react-icons/fi';

import { Input } from './Input';
import { ButtonEditParam } from './ButtonEditParam';

import { ModalConfigSessionProps } from '../utils/types';

import '../styles/components/ModalConfigSession.scss';

export function ModalConfigSession(props: ModalConfigSessionProps) {
  const [paint, setPaint] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [speed, setSpeed] = useState(0);

  const handleIncreasePaint = () => {
    setPaint(paint + 1);
  };

  const handleDecreasePaint = () => {
    setPaint(paint - 1);
  };

  const handleIncreaseTemperature = () => {
    setTemperature(temperature + 5);
  };

  const handleDecreaseTemperature = () => {
    setTemperature(temperature - 5);
  };

  const handleIncreaseSpeed = () => {
    setSpeed(speed + 5);
  };

  const handleDecreaseSpeed = () => {
    setSpeed(speed - 5);
  };
  return (
    <Modal
      isOpen={props.isModalOpen}
      onRequestClose={props.closeModal}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
        content: {
          width: '39.5rem',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#D9D9D9',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          borderRadius: '1rem',
          outline: 'none',
        },
      }}
    >
      <div id="modal-session">
        <h3>Configurar Sessão</h3>

        <div className="param-box">
          <h4>Tipo de tinta:</h4>

          <select name="" className="dropdown">
            <option value="">Selecione</option>
            <option value="">Base d'água</option>
            <option value="">Plastisol</option>
          </select>
        </div>

        <div className="param-box">
          <h4>Quantidade de tintas:</h4>

          <div>
            <Input
              placeholder="0"
              value={paint}
              onChange={(e) => setPaint(Number(e.target.value))}
            />
            <ButtonEditParam
              icon={<FiPlus size={18} color="#6A6A6B" />}
              onClick={handleIncreasePaint}
            />
            <ButtonEditParam
              icon={<FiMinus size={18} color="#6A6A6B" />}
              onClick={handleDecreasePaint}
            />
          </div>
        </div>

        <div className="param-box">
          <h4>Temperatura flashcure:</h4>

          <div>
            <Input
              placeholder="0 °C"
              value={`${temperature} °C`}
              onChange={(e) => setTemperature(Number(e.target.value))}
            />
            <ButtonEditParam
              icon={<FiPlus size={18} color="#6A6A6B" />}
              onClick={handleIncreaseTemperature}
            />
            <ButtonEditParam
              icon={<FiMinus size={18} color="#6A6A6B" />}
              onClick={handleDecreaseTemperature}
            />
          </div>
        </div>

        <div className="param-box">
          <h4>Velocidade motor:</h4>

          <div>
            <Input
              placeholder="0 RPM"
              value={`${speed} RPM`}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <ButtonEditParam
              icon={<FiPlus size={18} color="#6A6A6B" />}
              onClick={handleIncreaseSpeed}
            />
            <ButtonEditParam
              icon={<FiMinus size={18} color="#6A6A6B" />}
              onClick={handleDecreaseSpeed}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
