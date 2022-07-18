import { ButtonConfirmProps } from '../utils/types';

import '../styles/components/ButtonConfirm.scss';

export function ButtonConfirm({ title, color, ...rest }: ButtonConfirmProps) {
  return (
    <button
      id="button-confirm"
      style={{ backgroundColor: `${color}` }}
      {...rest}
    >
      <h3>{title}</h3>
    </button>
  );
}
