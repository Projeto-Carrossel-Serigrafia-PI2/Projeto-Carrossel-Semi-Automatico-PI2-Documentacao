import { OptionProps } from '../utils/types';

import '../styles/components/Option.scss'

export function Option(props: OptionProps) {
  return (
    <button id="option" onClick={props.onClick}>
      {props.icon}
      <h2 className={props.active ? 'session-active' : ''}>{props.title}</h2>
    </button>
  )
}