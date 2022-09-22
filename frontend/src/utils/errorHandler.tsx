import { notify_error } from './toastify'

export default function backendRequestErrorHandler(error) {
  if(error.code == 'ERR_NETWORK')
    notify_error('Conexão com o back-end falhou!');
  else
    notify_error('Falha ao comunicar com o back-end. Código: ' + error.code);
}
