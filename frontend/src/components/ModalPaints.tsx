import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { Input } from './Input';
import { ButtonEditParam } from './ButtonEditParam';
import { ButtonConfirm } from './ButtonConfirm';

import { ModalPaintsProps } from '../utils/types';

import '../styles/components/ModalPaints.scss';
import 'react-toastify/dist/ReactToastify.css';

export function ModalPaints(props: ModalPaintsProps) {
  const [typePaint, setTypePaint] = useState(props.paint.type);
  const [dryingTemperature, setDryingTemperature] = useState(
    props.paint.dryingTemperature
  );
  const [dryingTime, setDryingTime] = useState(props.paint.dryingTime);

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

  const handleIncreaseTemperature = () => {
    setDryingTemperature(dryingTemperature + 5);
  };

  const handleDecreaseTemperature = () => {
    setDryingTemperature(dryingTemperature - 5);
  };

  const handleIncreaseTime = () => {
    setDryingTime(dryingTime + 1);
  };

  const handleDecreaseTime = () => {
    setDryingTime(dryingTime - 1);
  };

  const handleConfigSession = () => {
    // const data: SessionProps = {
    //   quantityPaint,
    //   temperatureFlashcure: temperature,
    //   speedEngine: speed,
    //   typePaint: typePaint,
    // };

    // sessionService.sessionCreate(data);
    // props.setIsModalOpen(false);
    // props.setSessionActive('none');

    notify();
  };

  // useEffect(() => {
  //   async function getPaints() {
  //     const response = await paintService.paintGetAll();

  //     let data: PaintProps[] = [];

  //     for (let index = 0; index < response.length; index++) {
  //       let new_paint: PaintProps;
  //       new_paint = {
  //         id: response[index].id,
  //         type: response[index].tipo,
  //         speedDefault: response[index].velocidadePadrao,
  //         temperatureDefault: response[index].temperaturaPadrao,
  //       };

  //       data.push(new_paint);
  //     }

  //     setPaints(data);
  //   }

  //   // getPaints();
  // }, []);

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
        <h3>{props.mode === 'criar' ? 'Criar' : 'Editar'} tinta</h3>

        {/* <div className="param-box">
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
        </div> */}

        <div className="param-box">
          <h4>Tipo de tinta:</h4>

          <div>
            <Input
              placeholder="Ex: plastisol"
              style={{ textAlign: 'start' }}
              value={typePaint}
              onChange={(e) => setTypePaint(e.target.value)}
            />
          </div>
        </div>

        <div className="param-box">
          <h4>Temperatura de secagem (°C):</h4>

          <div>
            <Input
              placeholder="0 °C"
              value={dryingTemperature}
              onChange={(e) => setDryingTemperature(Number(e.target.value))}
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
          <h4>Tempo de secagem (segundos):</h4>

          <div>
            <Input
              placeholder="0 s"
              value={dryingTime}
              onChange={(e) => setDryingTime(Number(e.target.value))}
            />
            <ButtonEditParam
              icon={<FiPlus size={18} color="#6A6A6B" />}
              onClick={handleIncreaseTime}
            />
            <ButtonEditParam
              icon={<FiMinus size={18} color="#6A6A6B" />}
              onClick={handleDecreaseTime}
            />
          </div>
        </div>

        <ButtonConfirm title="Salvar" onClick={handleConfigSession} />
      </div>
    </Modal>
  );
}
