import React, { useState, useEffect } from 'react';

import SimpleKeyboard from 'react-simple-keyboard';

import layout from 'simple-keyboard-layouts/build/layouts/brazilian';

import '../styles/components/Keyboard.scss';

export default function Keyboard(props) {
  const [ keyboardHeight, setKeyboardHeight ] = useState(0);
  const [ layoutName, setLayoutName ] = useState(0);
  const [ keyboard, setKeyboard ] = useState(null);
  const [ inUse, setInUse ] = useState(false);

  function updateKeyboardHeight() {
    const keyboard = document.getElementsByClassName('simple-keyboard')[0];

    setKeyboardHeight(keyboard.offsetHeight);
  }

  function handleShift() {
    const shiftToggle = layoutName == 'default' ? 'shift' : 'default';

    setLayoutName(shiftToggle);
  }

  function onKeyPress(key) {
    if(props.focusedElement) {
      if(key.length == 1)
        props.focusedElement.value += key;

      else if(key == '{bksp}')
        props.focusedElement.value = props.focusedElement.value.substr(0, props.focusedElement.value.length - 1);

      else if(['{shift}', '{lock}'].includes(key))
        return handleShift();

      const artificialEvent = {
        target: props.focusedElement
      };

      props.sendKeyboardEvent(artificialEvent, ...props.additionalArguments);
    }
  }

  useEffect(() => {
    if(props.focusedElement && props.focusedElement.attributes.requestskeyboard.value)
      setInUse(true);

    else
      setInUse(false);
  }, [props.focusedElement]);

  return (
    <>
      <SimpleKeyboard theme={`hg-theme-default ${inUse ? 'in-use' : 'not-in-use'}`} onInit={updateKeyboardHeight} onKeyPress={onKeyPress} layout={layout.layout} layoutName={layoutName} keyboardRef={r => setKeyboard(r)} />
      { props.disableAux ? null
        : <div className="keyboard-aux" style={{height: `${keyboardHeight}px`, width: "100%", display: inUse ? undefined : 'none'}}></div>
      }
    </>
  );
}
