import { api } from './api';

class ProductionService {
  async productionCreate(data: any) {
    const response = await api.post('/producao/', {
      totalDeCamisetas: data.totalDeCamisetas,
      velocidade: data.velocidade,
      base_producao_create: data.base_producao_create,
      image: data.image,
    });

    return response;
  }
}

const productionService = new ProductionService();

export default productionService;
