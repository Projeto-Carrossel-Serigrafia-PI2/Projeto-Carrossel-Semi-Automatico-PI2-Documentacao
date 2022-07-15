import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { Input } from './Input';
import { ButtonEditParam } from './ButtonEditParam';
import { ButtonConfirm } from './ButtonConfirm';

import {
  ModalConfigSessionProps,
  PaintProps,
  SessionProps,
} from '../utils/types';
import paintService from '../services/paintService';
import sessionService from '../services/sessionService';

import '../styles/components/ModalConfigSession.scss';
import 'react-toastify/dist/ReactToastify.css';

export function ModalConfigSession(props: ModalConfigSessionProps) {
  const [paints, setPaints] = useState<PaintProps[]>([]);
  const [typePaint, setTypePaint] = useState('Selecione');
  const [quantityPaint, setQuantityPaint] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [speed, setSpeed] = useState(0);

  const notify = () =>
    toast('Sessão criada com sucesso', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      type: 'success',
    });

  const handleIncreasePaint = () => {
    setQuantityPaint(quantityPaint + 1);
  };

  const handleDecreasePaint = () => {
    setQuantityPaint(quantityPaint - 1);
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

  const handleConfigSession = () => {
    const data: SessionProps = {
      quantityPaint,
      temperatureFlashcure: temperature,
      speedEngine: speed,
      typePaint: typePaint,
    };

    sessionService.sessionCreate(data);
    props.setIsModalOpen(false);
    props.setSessionActive('none');

    notify();
  };

  useEffect(() => {
    async function getPaints() {
      const response = await paintService.paintGetAll();

      let data: PaintProps[] = [];

      for (let index = 0; index < response.length; index++) {
        let new_paint: PaintProps;
        new_paint = {
          id: response[index].id,
          type: response[index].tipo,
          speedDefault: response[index].velocidadePadrao,
          temperatureDefault: response[index].temperaturaPadrao,
        };

        data.push(new_paint);
      }

      setPaints(data);
    }

    getPaints();
  }, []);

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

          <select
            value={typePaint}
            onChange={(e) => setTypePaint(e.target.value)}
            className="dropdown"
          >
            <option value="">Selecione</option>
            {paints.map((paint) => (
              <option key={paint.id} value={paint.id}>
                {paint.type}
              </option>
            ))}
          </select>
        </div>

        <div className="param-box">
          <h4>Quantidade de tintas:</h4>

          <div>
            <Input
              placeholder="0"
              value={quantityPaint}
              onChange={(e) => setQuantityPaint(Number(e.target.value))}
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
          <h4>Temperatura flashcure (°C):</h4>

          <div>
            <Input
              placeholder="0 °C"
              value={
                typePaint
                  ? paints.find((paint) => paint.id === typePaint)
                      ?.temperatureDefault
                  : temperature
              }
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
          <h4>Velocidade motor (RPM):</h4>

          <div>
            <Input
              placeholder="0 RPM"
              value={
                typePaint
                  ? paints.find((paint) => paint.id === typePaint)?.speedDefault
                  : speed
              }
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

        <ButtonConfirm title="Salvar" onClick={handleConfigSession} />
      </div>
    </Modal>
  );
}
