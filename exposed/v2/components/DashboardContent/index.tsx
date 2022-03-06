import React from 'react';

import ResponsiveComponent from '../ResponsiveComponent';

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
    <ResponsiveComponent>
      <Style.Content>
        {children}
      </Style.Content>
    </ResponsiveComponent>
  );
}
