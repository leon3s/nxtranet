import React, { useState } from 'react';
import * as Style from './style';

import type InputProps from './props';

export default function InputNumber(props: InputProps) {
  const [s, setS] = useState('');

  function onSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      props.onChange([
        ...props.value,
        s,
      ]);
      setS('');
    }
  }

  return (
    <Style.ArrayStringContainer>
      <Style.StringBadgeContainer>
        {props.value.map((s: string) => (
          <Style.StringBadge
          key={s}
          >
            {s}
          </Style.StringBadge>
        ))}
      </Style.StringBadgeContainer>
      <Style.ArrayStringInput
        type="text"
        value={s}
        name={props.name}
        onKeyDown={onSubmit}
        placeholder={props.placeholder}
        onChange={(e) => setS(e.target.value)}
      />
    </Style.ArrayStringContainer>
  )
}
