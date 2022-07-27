import { api } from './api';

class ProductionService {
  async productionCreate(data: any) {
    await api.post('/producao/', {
      totalDeCamisetas: data.totalDeCamisetas,
      velocidade: data.velocidade,
      base_producao_create: data.base_producao_create
    });
  }
}

const productionService = new ProductionService();

export default productionService;
