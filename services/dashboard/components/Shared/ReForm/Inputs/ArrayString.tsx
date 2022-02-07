import React, {useState} from 'react';
import type InputProps from './props';
import * as Style from './style';

export default function InputNumber(props: InputProps) {
  const [s, setS] = useState('');
  const [i, setI] = useState<number | null>(null);

  function onSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!s.length) return;
      if (i === null) {
        props.onChange([
          ...props.value,
          s,
        ]);
      } else {
        props.value[i] = s;
        setI(null);
        props.onChange([...props.value]);
      }
      setS('');
    }
  }

  function onDeleteGenerator(i: number) {
    return function onDelete() {
      props.value.splice(i, 1);
      props.onChange([...props.value]);
    }
  }

  function onEditGenerator(s: string, i: number) {
    return function onEdit() {
      setS(s);
      setI(i);
    }
  }

  return (
    <Style.ArrayStringContainer>
      <Style.StringBadgeContainer>
        {props.value.map((s: string, i: number) => (
          <Style.StringBadgeWrapper
            key={`${s}-${i}`}
          >
            <Style.StringBadgeAbs>
              <Style.Delete
                onClick={onDeleteGenerator(i)}
                title="Delete"
              />
              <Style.Edit
                onClick={onEditGenerator(s, i)}
                title="Edit"
              />
            </Style.StringBadgeAbs>
            <Style.StringBadge>
              {s}
            </Style.StringBadge>
          </Style.StringBadgeWrapper>
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
