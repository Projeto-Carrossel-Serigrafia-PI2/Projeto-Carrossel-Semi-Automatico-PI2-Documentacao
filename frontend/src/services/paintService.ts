import { api } from './api';

import { PaintProps } from '../utils/types';

class PaintService {
  async paintCreate(data: PaintProps) {
    await api.post('/tipoTinta/', {
      id: data.id,
      tipo: data.type,
      velocidadePadrao: data.speedDefault,
      temperaturaPadrao: data.temperatureDefault
    });
  }

  async paintGetAll() {
    const paints = await api.get('/tipoTinta/');

    return paints.data;
  }
}

const paintService = new PaintService();

export default paintService;
