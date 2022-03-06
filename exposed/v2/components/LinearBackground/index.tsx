import React from 'react';

import * as Style from './style';

export type LinearBackgroundProps = {
  children?: React.ReactNode;
}

export default function LinearBackground(props: LinearBackgroundProps) {
  return (
    <Style.Container>
      {props.children}
    </Style.Container>
  );
}
