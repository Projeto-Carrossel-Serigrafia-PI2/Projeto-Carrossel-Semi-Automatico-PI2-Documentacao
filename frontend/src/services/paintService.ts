import { api } from './api';

import { PaintProps } from '../utils/types';

class PaintService {
  async paintCreate(data: PaintProps) {
    await api.post('/base/', {
      tipo: data.type,
      temperaturaSecagem: data.dryingTemperature,
      tempoSecagem: data.dryingTime,
    });
  }

  async paintGetAll() {
    const paints = await api.get('/base/');

    return paints;
  }

  async paintUpdate(data: PaintProps) {
    await api.put(`/base/${data.id}/`, {
      tipo: data.type,
      temperaturaSecagem: data.dryingTemperature,
      tempoSecagem: data.dryingTime,
    });
  }

  async paintDelete(paintId: number) {
    await api.delete(`/base/${paintId}/`);
  }
}

const paintService = new PaintService();

export default paintService;
