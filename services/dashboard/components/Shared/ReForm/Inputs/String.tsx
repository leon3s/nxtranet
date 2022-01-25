/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\components\Shared\ReForm\Inputs\String.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Wednesday, October 27th 2021, 5:15:36 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import * as Style from './style';

import type InputProps from './props';

export default function InputString(props: InputProps) {
  function onSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }
  return (
    <Style.BaseInput
      type="text"
      name={props.name}
      value={props.value}
      onKeyDown={onSubmit}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
    />
  )
}
