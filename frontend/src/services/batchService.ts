import { api } from './api';
import { BatchProps } from '../utils/types';

class BatchService {
  batchGetAll() {
    return api.get('/lote/');
  }

  async batchGetOne(id: number) {
    const response = await api.get('/lote/')
    return response.data.find((batch: BatchProps) => batch.id == id)
  }
}

const batchService = new BatchService();

export default batchService;
