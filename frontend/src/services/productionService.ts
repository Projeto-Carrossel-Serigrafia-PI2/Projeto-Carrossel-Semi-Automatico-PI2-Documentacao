import { api } from './api';

// import { PaintProps } from '../utils/types';

class ProductionService {
  async productionCreate(data: any) {
    await api.post('/producao/', {
      totalDeCamisetas: data.totalDeCamisetas,
      velocidade: data.velocidade,
      base_producao_create: data.base_producao_create
    });
  }

  // async paintGetAll() {
  //   const paints = await api.get('/tipoTinta/');

  //   return paints.data;
  // }
}

const productionService = new ProductionService();

export default productionService;
