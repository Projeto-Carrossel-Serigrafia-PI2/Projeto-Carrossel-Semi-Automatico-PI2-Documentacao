import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FiMinus, FiPlus } from 'react-icons/fi';

import { Input } from './Input';
import { ButtonEditParam } from './ButtonEditParam';
import { ButtonRequest } from './ButtonRequest';
import { ModalProps } from '../utils/types';
import paintService from '../services/paintService';
import { notify_success, notify_update, notify_error } from '../utils/toastify';

import '../styles/components/ModalPaints.scss';

export function ModalPaints(props: ModalProps) {
  const [typePaint, setTypePaint] = useState(props.paint.type);
  const [dryingTemperature, setDryingTemperature] = useState(
    props.paint.dryingTemperature
  );
  const [dryingTime, setDryingTime] = useState(props.paint.dryingTime);

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

  const handleNewPaint = async () => {
    try {
      await paintService.paintCreate({
        type: typePaint,
        dryingTemperature,
        dryingTime,
      });

      notify_success('Base de tinta criada com sucesso!');
      props.setIsModalOpen!(false);
    } catch (error) {
      notify_error('Não foi possível criar uma nova base de tinta!');
      console.log(error);
    }
  };

  const handleUpdatePaint = async () => {
    try {
      await paintService.paintUpdate({
        id: props.paint.id,
        type: typePaint,
        dryingTemperature,
        dryingTime,
      });

      notify_update('Base de tinta atualizada com sucesso!');
      props.setIsModalOpen!(false);
    } catch (error) {
      notify_error('Não foi possível criar uma nova base de tinta!');
      console.log(error);
    }
  };

  useEffect(() => {
    if (props.mode === 'criar') {
      setDryingTemperature(0);
      setDryingTime(0);
      setTypePaint('');
    }
  }, [props.isModalOpen]);

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
        <h3>{props.mode === 'criar' ? 'Criar' : 'Editar'} base de tinta</h3>

        <div className="param-box">
          <h4>Base da tinta:</h4>

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

        <ButtonRequest
          title="Salvar"
          onClick={props.mode === 'criar' ? handleNewPaint : handleUpdatePaint}
        />
      </div>
    </Modal>
  );
}
