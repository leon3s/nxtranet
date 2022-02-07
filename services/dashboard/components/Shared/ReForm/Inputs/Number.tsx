import React from 'react';
import type InputProps from './props';
import * as Style from './style';

export default function InputNumber(props: InputProps) {
  function onSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }
  return (
    <Style.BaseInput
      type="number"
      name={props.name}
      value={props.value}
      onKeyDown={onSubmit}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(Number(e.target.value))}
    />
  )
}
