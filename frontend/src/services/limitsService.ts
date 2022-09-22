import { api } from './api';

class LimitsService {
  getLimits() {
    return api.get('/limites/');
  }
}

const limitsService = new LimitsService();

export default limitsService;
