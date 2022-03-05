import type InputProps from './props';
import * as Style from './style';

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
  );
}
