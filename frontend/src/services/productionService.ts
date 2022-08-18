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
