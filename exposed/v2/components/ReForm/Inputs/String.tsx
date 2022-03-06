import React, { useState } from 'react';
import type InputProps from './props';
import * as Style from './style';

export default function InputString(props: InputProps) {
  const [value, setValue] = useState(props.value || '');

  function onSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    props.onChange(e.target.value);
  }

  return (
    <Style.BaseInput
      type="text"
      name={props.name}
      value={value}
      onChange={onChange}
      onKeyDown={onSubmit}
      placeholder={props.placeholder}
    />
  );
}
