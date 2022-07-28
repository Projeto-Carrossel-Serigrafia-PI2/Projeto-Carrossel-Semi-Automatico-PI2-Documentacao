import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { Input } from '../components/Input';
import { ButtonConfirm } from '../components/ButtonConfirm';
import { ButtonEditParam } from '../components/ButtonEditParam';
import productionService from '../services/productionService';
import paintService from '../services/paintService';
import { ColorProps, PaintProps } from '../utils/types';
import StateContext from '../contexts/StateContext';

import '../styles/pages/Production.scss';

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
  const { setParameters, setState } = useContext(StateContext);
  const navigate = useNavigate();

  function handleIncreaseTShirts() {
    setQuantityTShirts(quantityTShirts + 4);
  }

  function handleDecreaseTShirts() {
    setQuantityTShirts(quantityTShirts - 4);
  }

  function handleIncreaseSpeed() {
    setSpeed(speed + 5);
  }

  function handleDecreaseSpeed() {
    setSpeed(speed - 5);
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

  function handleCreateProduction() {
    try {
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

      console.log(production);

      productionService.productionCreate(production).then(() => {
        productionService.productionStart().then((response) => {
          if(response.data.error) {
            toast.error('Não foi possível executar a produção!');
            console.log(response.data.description)
          }

          else {
            setParameters({
              paints: production.base_producao_create.map((paint) => {
                return {
                  color: paint.cor,
                  base: paint.base - 1
                }
              }),
              shirtQuantity: production.totalDeCamisetas,
              batches: Math.ceil(production.totalDeCamisetas/4)
            });

            console.log({
              paints: production.base_producao_create,
              shirtQuantity: production.totalDeCamisetas,
              batches: Math.ceil(production.totalDeCamisetas/4)
            });

            window.updateInterval = setInterval(() => {
              productionService.productionState().then((response) => {
                setState(response.data);
              });
            }, 1000);

            navigate('/dashboard');

            toast.success('Produção criada e inicializada com sucesso!');
          }
        }).catch((e) => {
          toast.error('Não foi possível executar a produção!');
        });
      }).catch(() => {
        toast.error('Não foi possível criar a produção!');
      });
    } catch (error) {
      toast.error('Não foi possível criar a produção!');
      console.log(error);
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
                <h4>Tipo de tinta:</h4>
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
            <ButtonConfirm
              title="Criar nova cor"
              onClick={handleCreateNewColor}
              style={{ backgroundColor: '#4fce88' }}
            />
          </div>
          <ButtonConfirm
            title="Iniciar produção"
            onClick={handleCreateProduction}
          />
        </div>
      </main>
    </div>
  );
}
