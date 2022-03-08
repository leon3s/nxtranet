import React from 'react';
import * as Style from './DashboardContent.s';
import ResponsiveComponent from './ResponsiveComponent';

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
