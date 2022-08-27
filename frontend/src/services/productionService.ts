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

  productionNextBatch() {
    return api.post('/controleProducao/', {
      action: 1
    });
  }

  productionSubmitTime(elapsedTime) {
    return api.post('/controleProducao/', {
      action: 2,
      elapsedTime
    });
  }

  productionToggle() {
    return api.post('/controleProducao/', {
      action: 4
    });
  }

  productionForceFinish() {
    return api.post('/controleProducao/', {
      action: 5
    });
  }

  productionRepaint() {
    return api.post('/controleProducao/', {
      action: 6
    });
  }
}

const productionService = new ProductionService();

export default productionService;
