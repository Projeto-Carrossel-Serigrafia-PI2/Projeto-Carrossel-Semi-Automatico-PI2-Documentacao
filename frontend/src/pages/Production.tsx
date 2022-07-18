import { useState } from 'react';

import { Input } from '../components/Input';

import '../styles/pages/Production.scss';

export function Production() {
  const [quantityTShirts, setQuantityTShirts] = useState(0);
  const [quantityColors, setQuantityColors] = useState(0);

  return (
    <div id="production">
      <h2>Produção</h2>

      <main>
        <div>
          <h3>Quantidade de camisetas:</h3>

          <Input
            placeholder="0"
            value={quantityTShirts}
            onChange={(e) => setQuantityTShirts(Number(e.target.value))}
          />
        </div>

        <div>
          <h3>Quantidade de cores:</h3>

          <Input
            placeholder="0"
            value={quantityColors}
            onChange={(e) => setQuantityColors(Number(e.target.value))}
          />
        </div>

        <section>
          
        </section>
      </main>
    </div>
  );
}
