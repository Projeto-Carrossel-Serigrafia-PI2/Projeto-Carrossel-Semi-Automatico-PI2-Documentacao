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

    const data: PaintProps[] = [];

      for (let index = 0; index < paints.data.length; index++) {
        data.push({
          id: paints.data[index].id,
          type: paints.data[index].tipo,
          dryingTemperature: paints.data[index].temperaturaSecagem,
          dryingTime: paints.data[index].tempoSecagem,
        });
      }

    return data;
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
