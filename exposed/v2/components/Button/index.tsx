import React from 'react';

import * as Style from './style';
import type {ButtonColorType} from './style';

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
    className,
  } = props;
  return (
    <Style.Button
      title={title}
      onClick={onClick}
      colorType="default"
      disabled={disabled}
      className={className}
    >
      {children}
    </Style.Button>
  );
};

Button.defaultProps = defaultProps;

export default Button;
