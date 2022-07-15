import { api } from './api';

import { SessionProps } from '../utils/types';

class SessionService {
  async sessionCreate(data: SessionProps) {
    await api.post('/sessao/', {
      quantidadeTinta: data.quantityPaint,
      TempFlashCure: data.temperatureFlashcure,
      velocidadeMotor: data.speedEngine,
      tipoTinta: data.typePaint,
    });
  }
}

const sessionService = new SessionService();

export default sessionService;
