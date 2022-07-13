import React from 'react'
import '../styles/components/Input.scss'

export function Input({...rest}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input id="input-param" {...rest} />
  )
}