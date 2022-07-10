import { OptionProps } from '../utils/types';

import '../styles/components/Option.scss'

export function Option(props: OptionProps) {
  return (
    <div id="option">
      {props.icon}
      <h2>{props.title}</h2>
    </div>
  )
}