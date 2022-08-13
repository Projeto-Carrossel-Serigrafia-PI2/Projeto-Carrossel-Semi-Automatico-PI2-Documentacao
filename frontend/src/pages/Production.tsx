import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';

import { Input } from '../components/Input';
import { ButtonRequest } from '../components/ButtonRequest';
import { ButtonEditParam } from '../components/ButtonEditParam';
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
  const [colors, setColors] = useState<ColorProps[]>(data);
  const { state, setParameters, setState } = useContext(StateContext);
  const { setPage } = useContext(PageContext);
  const navigate = useNavigate();

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

  async function handleCreateProduction() {
    if(state.inSession)
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
      };

      productionService.productionCreate(production).then((res) => {
        productionService.productionStart().then((response) => {
          if(response.data.error) {
            notify_error('Não foi possível executar a produção!');
            console.log(response.data.description)
          }

          else {
            setParameters({
              paints: production.base_producao_create.map((paint) => {
                return {
                  color: paint.cor,
                  base: paint.base
                }
              }),
              shirts: production.totalDeCamisetas,
              batches: Math.ceil(production.totalDeCamisetas/4),
              speed
            });

            clearInterval(window.updateInterval);
            window.updateInterval = setInterval(() => {
              productionService.productionState().then((response) => {
                setState(response.data);
              });
            }, 1000);

            localStorage.setItem('elapsedTime', 0);
            navigate(`/dashboard/`);
            setPage('dashboard');
            notify_success('Produção criada e inicializada com sucesso!');
          }
        }).catch((e) => {
          notify_error('Não foi possível executar a produção!');
        });
      }).catch(() => {
        notify_error('Não foi possível criar a produção!');
      });  
    }
  }

  useEffect(() => {
    async function getAllPaintsType() {
      const response = await paintService.paintGetAll();

      setPaints(response);
    }

    getAllPaintsType();
  }, []);

  return (
    <div id="production">
      <h1>Produção</h1>

      <main>
        <section className="input-group">
          <h2>Quantidade de camisetas:</h2>

          <div>
            <Input
              style={{ textAlign: 'left' }}
              placeholder="0"
              value={quantityTShirts}
              onChange={(e) => setQuantityTShirts(Number(e.target.value))}
            />
            <ButtonEditParam
              icon={<FiPlus size={18} color="#6A6A6B" />}
              onClick={handleIncreaseTShirts}
            />
            <ButtonEditParam
              icon={<FiMinus size={18} color="#6A6A6B" />}
              onClick={handleDecreaseTShirts}
            />
          </div>
        </section>

        <section className="input-group">
          <h2>Velocidade:</h2>

          <div>
            <Input
              style={{ textAlign: 'left' }}
              placeholder="0"
              value={speed}
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
        </section>

        <h2>Cores:</h2>

        <section className="colors-section">
          {colors.map((item, index) => (
            <div key={item.color} className="colors-card">
              <h3>#{index + 1}</h3>

              <section className="input-group">
                <h4>Cor:</h4>

                <div>
                  <Input
                    style={{
                      textAlign: 'left',
                      borderBottom: '1px solid #6A6A6B',
                    }}
                    placeholder="Ex: azul"
                    value={item.color}
                    onChange={(e) => handleFormChangeColor(index, e)}
                    autoFocus
                  />
                </div>
              </section>

              <section className="input-group">
                <h4>Base da tinta:</h4>
                <select
                  value={paints.find((paint) => paint.id === item.id)?.type}
                  onChange={(e) => handleFormChangeTypeColor(index, e)}
                  className="dropdown"
                >
                  <option value="">Selecione</option>
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

        <div className="buttons-group">
          <div>
            <ButtonRequest
              title="Adicionar nova cor"
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
            title="Iniciar produção"
            onClick={handleCreateProduction}
          />
        </div>
      </main>
    </div>
  );
}
