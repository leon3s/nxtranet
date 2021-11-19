import { ApiEnvironement } from '@nxtranet/headers';
import React from 'react';

import * as Style from './style';

type EnvironementPinProps = {
  data: ApiEnvironement
}

export default function EnvironementPin(props: EnvironementPinProps) {
  return (
    <Style.Container>
      <Style.Name>
        {props.data.name}
      </Style.Name>
    </Style.Container>
  )
}