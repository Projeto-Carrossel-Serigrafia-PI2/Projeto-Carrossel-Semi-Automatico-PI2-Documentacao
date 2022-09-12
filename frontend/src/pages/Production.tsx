import React, { useEffect, useState, useContext } from 'react';
import { FiPlus, FiMinus, FiCamera, FiUpload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { Input } from '../components/Input';
import { ButtonRequest } from '../components/ButtonRequest';
import { ButtonEditParam } from '../components/ButtonEditParam';
import { ButtonTakePhoto } from '../components/ButtonTakePhoto';
import { ModalPhoto } from '../components/ModalPhoto';
import productionService from '../services/productionService';
import paintService from '../services/paintService';
import { ColorProps, PaintProps } from '../utils/types';

import StateContext from '../contexts/StateContext';
import PageContext from '../contexts/PageContext';

import '../styles/pages/Production.scss';

import {
  notify_error,
  notify_success,
  notify_warning,
} from '../utils/toastify';
import errorHandler from '../utils/errorHandler';

const data: ColorProps[] = [
  {
    id: 0,
    color: '',
    type: 0,
  },
];

export function Production() {
  const [paints, setPaints] = useState<PaintProps[]>([]);
  const [quantityTShirts, setQuantityTShirts] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [imageUpload, setImageUpload] = useState<string | ArrayBuffer>('');
  const [imageTaken, setImageTaken] = useState('');
  const [colors, setColors] = useState<ColorProps[]>(data);
  const [isModalPhotoOpen, setIsModalPhotoOpen] = useState(false);

  const { state, setParameters, setState } = useContext(StateContext);
  const { setPage } = useContext(PageContext);

  const navigate = useNavigate();

  const openModalPhoto = async () => {
    setIsModalPhotoOpen(true);
  };

  const closeModalPhoto = () => {
    setIsModalPhotoOpen(false);
  };

  function handleIncreaseTShirts() {
    setQuantityTShirts(quantityTShirts + 4);
  }

  function handleDecreaseTShirts() {
    setQuantityTShirts(quantityTShirts - 4);
  }

  function handleIncreaseSpeed() {
    setSpeed(speed + 1);
  }

  function handleDecreaseSpeed() {
    setSpeed(speed - 1);
  }

  function handleFormChangeColor(
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    let data: ColorProps[] = [...colors];

    data[index] = {
      color: e.target.value,
      type: data[index].type,
    };

    setColors(data);
  }

  function handleFormChangeTypeColor(
    index: number,
    e: React.ChangeEvent<HTMLSelectElement>
  ) {
    let data: ColorProps[] = [...colors];

    data[index] = {
      color: data[index].color,
      type: paints.find((item) => item.type === e.target.value)?.id!,
    };

    setColors(data);
  }

  function handleCreateNewColor() {
    let newColor: ColorProps = {
      color: '',
      type: 0,
    };

    setColors([...colors, newColor]);
  }

  function handleDeleteLastColor(index: number) {
    setColors(color => color.filter((_, i) => i !== index));
  }

  async function handleCreateProduction() {
    if (state.inSession)
      notify_error(
        `Uma produção já está em progresso! Pause ou finalize-a antes
         de começar outra.`
      );
    else {
      if (quantityTShirts <= 0) {
        notify_warning('Quantidade de camisetas é obrigatório!');
        return;
      }
      if (speed <= 0) {
        notify_warning('A velocidade é obrigatória!');
        return;
      }
      if (!colors[0].color || colors[0].type === 0) {
        notify_warning('Defina ao menos 1 cor!');
        return;
      }
      let data_colors: { cor: string; base: number }[] = [];

      for (let index = 0; index < colors.length; index++) {
        data_colors.push({
          cor: colors[index].color,
          base: colors[index].type,
        });
      }

      const production = {
        totalDeCamisetas: quantityTShirts,
        velocidade: speed,
        base_producao_create: data_colors,
        image: imageTaken ? imageTaken : imageUpload,
      };

      productionService
        .productionCreate(production)
        .then((res) => {
          productionService
            .productionStart()
            .then((response) => {
              if (response.data.error) {
                notify_error('Não foi possível executar a produção!');
                console.log(response.data.description);
              } else {
                setParameters({
                  paints: production.base_producao_create.map((paint) => {
                    return {
                      color: paint.cor,
                      base: paint.base,
                    };
                  }),
                  shirts: production.totalDeCamisetas,
                  batches: Math.ceil(production.totalDeCamisetas / 4),
                  speed,
                });

                clearInterval(window.updateInterval);
                window.updateInterval = setInterval(() => {
                  productionService
                    .productionState()
                    .then((response) => {
                      setState(response.data);
                    })
                    .catch((error) => {
                      if (error.code == 'ERR_NETWORK') {
                        notify_error(
                          'Conexão com o back-end falhou! Interrompendo atualizações de estado!'
                        );

                        clearInterval(window.updateInterval);
                      } else
                        notify_error(
                          'Falha ao comunicar com o back-end. Código: ' +
                            error.code
                        );
                    });
                }, 1000);

                localStorage.removeItem('elapsedTime');
                localStorage.removeItem('before');
                localStorage.removeItem('isDone');
                navigate(`/dashboard/`);
                setPage('dashboard');
                notify_success('Produção criada e inicializada com sucesso!');
              }
            })
            .catch(errorHandler);
        })
        .catch(errorHandler);
    }
  }

  function convertFileToBase64(file: File) {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (e) => {
      setImageUpload(e.target?.result!);
    };
  }

  useEffect(() => {
    async function getAllPaintsType() {
      paintService
        .paintGetAll()
        .then((response) => {
          setPaints(response);
        })
        .catch(errorHandler);
    }

    getAllPaintsType();
  }, []);

  return (
    <div id='production'>
      <h1>Produção</h1>

      <ModalPhoto
        isModalOpen={isModalPhotoOpen}
        setIsModalOpen={setIsModalPhotoOpen}
        closeModal={closeModalPhoto}
        image={imageTaken}
        setImage={setImageTaken}
      />

      <main>
        <section className='input-group'>
          <h2>Quantidade de camisetas:</h2>

          <div>
            <Input
              style={{ textAlign: 'left' }}
              placeholder='0'
              value={quantityTShirts}
              onChange={(e) => setQuantityTShirts(Number(e.target.value))}
            />
            <ButtonEditParam
              icon={<FiPlus size={18} color='#6A6A6B' />}
              onClick={handleIncreaseTShirts}
            />
            <ButtonEditParam
              icon={<FiMinus size={18} color='#6A6A6B' />}
              onClick={handleDecreaseTShirts}
            />
          </div>
        </section>

        <section className='input-group'>
          <h2>Velocidade:</h2>

          <div>
            <Input
              style={{ textAlign: 'left' }}
              placeholder='0'
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <ButtonEditParam
              icon={<FiPlus size={18} color='#6A6A6B' />}
              onClick={handleIncreaseSpeed}
            />
            <ButtonEditParam
              icon={<FiMinus size={18} color='#6A6A6B' />}
              onClick={handleDecreaseSpeed}
            />
          </div>
        </section>

        <section className='input-group'>
          <h2>Foto da estampa para referência:</h2>

          <div>
            <ButtonTakePhoto
              title='Enviar foto'
              icon={<FiUpload size={18} color='#39393a' />}
              filename={imageUpload ? 'imagem salva!' : ''}
              mode='upload'
              onChange={(e) => {
                setImageTaken('');
                convertFileToBase64(e.target.files![0]);
              }}
            />
            <ButtonTakePhoto
              title='Tirar foto'
              icon={<FiCamera size={18} color='#39393a' />}
              filename={imageTaken ? 'imagem salva!' : ''}
              mode='taken'
              onClick={() => {
                openModalPhoto();
                setImageUpload('');
              }}
            />
          </div>
        </section>

        <h2>Cores:</h2>

        <section className='colors-section'>
          {colors.map((item, index) => (
            <div key={item.color} className='colors-card'>
              <h3>#{index + 1}</h3>

              <section className='input-group'>
                <h4>Cor:</h4>

                <div>
                  <Input
                    style={{
                      textAlign: 'left',
                      borderBottom: '1px solid #6A6A6B',
                    }}
                    placeholder='Ex: azul'
                    value={item.color}
                    onChange={(e) => handleFormChangeColor(index, e)}
                    autoFocus
                  />
                </div>
              </section>

              <section className='input-group'>
                <h4>Base de tinta:</h4>

                <select
                  value={paints.find((paint) => paint.id === item.id)?.type}
                  onChange={(e) => handleFormChangeTypeColor(index, e)}
                  className='dropdown'
                >
                  <option value=''>Selecione</option>
                  {paints.map((paint) => (
                    <option key={paint.id} value={paint.type}>
                      {paint.type}
                    </option>
                  ))}
                </select>
              </section>
            </div>
          ))}
        </section>

        <div className='buttons-group'>
          {colors.length > 1 ? (
            <div>
              <ButtonRequest
                title='Remover última cor'
                onClick={() => handleDeleteLastColor(colors.length - 1)}
                style={{ backgroundColor: '#DE5757' }}
              />
            </div>
          ) : null}
          <div>
            <ButtonRequest
              title='Adicionar nova cor'
              onClick={handleCreateNewColor}
              style={{ backgroundColor: '#4fce88' }}
              disabled={
                colors[colors.length - 1]?.color &&
                colors[colors.length - 1]?.type
                  ? false
                  : true
              }
            />
          </div>
          <ButtonRequest
            title='Iniciar produção'
            onClick={handleCreateProduction}
          />
        </div>
      </main>
    </div>
  );
}
