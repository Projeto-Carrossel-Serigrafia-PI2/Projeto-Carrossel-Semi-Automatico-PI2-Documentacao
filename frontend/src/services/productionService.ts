import { api } from './api';

class ProductionService {
  productionCreate(data: any) {
    return api.post('/producao/', {
      totalDeCamisetas: data.totalDeCamisetas,
      velocidade: data.velocidade,
      base_producao_create: data.base_producao_create,
      image: data.image,
    });
  }

  productionStart() {
    return api.post('/controleProducao/', {
      action: 0
    });
  }

  productionState() {
    return api.get('/estado/');
  }
}

const productionService = new ProductionService();

export default productionService;
