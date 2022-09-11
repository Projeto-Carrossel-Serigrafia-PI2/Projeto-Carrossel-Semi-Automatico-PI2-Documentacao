import Modal from 'react-modal';
import Camera from 'react-html5-camera-photo';

import { ButtonRequest } from './ButtonRequest';
import { ModalPhotoProps } from '../utils/types';

import '../styles/components/ModalPhoto.scss';
import 'react-html5-camera-photo/build/css/index.css';

export function ModalPhoto(props: ModalPhotoProps) {
  function handleTakePhoto(dataUri: any) {
    props.setImage!(dataUri);
  }

  function handleCameraStart() {
    console.log('handleCameraStart');
  }

  function handleCameraStop() {
    console.log('handleCameraStop');
  }

  function handleDeleteImage() {
    props.setImage!('');
  }

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
      <div id="modal-photo-container">
        {!props.image ? (
          <Camera
            onTakePhoto={(dataUri) => {
              handleTakePhoto(dataUri);
            }}
            onCameraStop={() => {
              handleCameraStop();
            }}
            onCameraStart={() => {
              handleCameraStart();
            }}
            isMaxResolution={true}
          />
        ) : (
          <div>
            <img src={props.image} alt="" />

            <div className="buttons-photo-group">
              <ButtonRequest
                title="Tirar novamente"
                onClick={handleDeleteImage}
              />
              <div>
                <ButtonRequest title="Salvar foto" onClick={props.closeModal} />
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
