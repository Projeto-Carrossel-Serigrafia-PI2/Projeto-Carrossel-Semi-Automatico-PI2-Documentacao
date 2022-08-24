import { api } from './api';

class BatchService {
  batchGetAll() {
    return api.get('/lote/');
  }
}

const batchService = new BatchService();

export default batchService;
