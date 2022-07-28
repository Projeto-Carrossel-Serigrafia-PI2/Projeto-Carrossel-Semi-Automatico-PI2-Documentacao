import { ButtonRequestProps } from '../utils/types';

import '../styles/components/ButtonRequest.scss';

export function ButtonRequest({ title, color, ...rest }: ButtonRequestProps) {
  return (
    <button
      id="button-request"
      style={{ backgroundColor: `${color}` }}
      {...rest}
    >
      <h3>{title}</h3>
    </button>
  );
}
