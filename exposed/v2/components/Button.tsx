import React from 'react';
import type {ButtonColorType} from './Button.s';
import * as Style from './Button.s';

export type {ButtonColorType} from './Button.s';

export type ButtonProps = {
  title?: string;
  className?: string;
  disabled?: boolean;
  colorType?: ButtonColorType;
  children: string | React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const defaultProps = {
  colorType: "default",
};

function Button(props: ButtonProps) {
  const {
    title,
    onClick,
    children,
    disabled,
    colorType,
    className,
  } = props;
  return (
    <Style.Button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={className}
      colorType={colorType || 'default'}
    >
      {children}
    </Style.Button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
