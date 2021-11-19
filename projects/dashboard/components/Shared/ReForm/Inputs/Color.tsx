import * as Style from './style';

import type InputProps from './props';
import React from 'react';

export default function InputNumber(props: InputProps) {
  return (
    <Style.InputColor
      type="color"
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
    />
  )
}
