import { api } from './api';
import { ProductionProps } from '../utils/types';

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
      action: 0,
    });
  }

  productionState() {
    return api.get('/estado/');
  }

  productionGetAll() {
    return api.get('/producao/');
  }

  async productionGetOne(id: number) {
    const response = await api.get('/producao/');
    return response.data.find(
      (production: ProductionProps) => production.id == id
    );
  }
}

const productionService = new ProductionService();

export default productionService;
