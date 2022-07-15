import { ButtonConfirmProps } from '../utils/types';

import '../styles/components/ButtonConfirm.scss';

export function ButtonConfirm({ title, ...rest }: ButtonConfirmProps) {
  return (
    <button id="button-confirm" {...rest}>
      <h3>{title}</h3>
    </button>
  );
}
