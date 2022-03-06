import React from 'react';
import * as Style from './style';


type PageWrapperProps = {
  children?: React.ReactElement | React.ReactChildren | null;
}

export default function PageWrapper(props: PageWrapperProps) {
  return (
    <Style.Container>
      {props.children}
    </Style.Container>
  )
}
