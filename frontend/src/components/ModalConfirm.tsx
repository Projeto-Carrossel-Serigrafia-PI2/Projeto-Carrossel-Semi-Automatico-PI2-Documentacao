import Modal from 'react-modal';

import { ButtonRequest } from './ButtonRequest';
import { ModalProps } from '../utils/types';
import { notify_error, notify_success } from '../utils/toastify';
import paintService from '../services/paintService';

import '../styles/components/ModalConfirm.scss';

export function ModalConfirm(props: ModalProps) {
  const handleDeletePaint = async () => {
    try {
      await paintService.paintDelete(props.paint.id!);

      props.setIsModalOpen!(false);
      notify_success('Tinta deletada com sucesso!');
      props.paint.setReload!(!props.paint.reload);
    } catch (error) {
      notify_error('Não foi possível deletar a tinta!');
      console.log(error);
    }
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
      <div className="modal-confirm-container">
        <h3>Excluir base de tinta</h3>

        <p>
          Tem certeza que deseja excluir a base de tinta{' '}
          <b>{props.paint.type}</b>?
        </p>

        <div>
          <ButtonRequest
            title="Excluir"
            color="#DE5757"
            onClick={handleDeletePaint}
          />
        </div>
      </div>
    </Modal>
  );
}
