import { ButtonEditParamProps } from '../utils/types';

import '../styles/components/ButtonEditParam.scss';

export function ButtonEditParam({ icon, ...rest }: ButtonEditParamProps) {
  return (
    <button {...rest} id="button-param">
      {icon}
    </button>
  );
}
