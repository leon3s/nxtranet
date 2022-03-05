import React from 'react';

import * as Style from './style';

export type DashboardContentProps = {
  title?: string;
  children?: React.ReactNode;
}

export default function DashboardContent(props: DashboardContentProps) {
  const {
    children
  } = props;
  return (
    <Style.Container>
      <Style.Content>
        {children}
      </Style.Content>
    </Style.Container>
  );
}
