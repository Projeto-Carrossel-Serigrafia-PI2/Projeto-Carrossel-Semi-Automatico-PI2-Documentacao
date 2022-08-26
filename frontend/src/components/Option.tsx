import { Link } from 'react-router-dom';

import { OptionProps } from '../utils/types';

import '../styles/components/Option.scss';

export function Option(props: OptionProps) {
  return (
    <button id="option" onClick={props.onClick}>
      {props.icon}
      {props.route === '/quality' ? (
        <h2
          className={
            props.active ? 'session-active session-title' : 'session-title'
          }
        >
          {props.title}
        </h2>
      ) : (
        <Link to={props.disabled? '#' : props.route!} style={{ textDecoration: 'none' }}>
          <h2
            className={
              props.active ? 'session-active session-title' : 'session-title'
            }
          >
            {props.title}
          </h2>
        </Link>
      )}
    </button>
  );
}
