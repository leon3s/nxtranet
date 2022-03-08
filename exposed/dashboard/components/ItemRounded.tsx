import React from 'react';
import * as Style from './ItemRouded.s';

type ItemRoundedProps = {
  onClick?: () => void;
  title?: string;
  children?: string | React.ReactElement | React.ReactChildren;
}

export default function ItemRounded(props: ItemRoundedProps) {
  return (
    <Style.Item
      title={props.title}
    >
      <Style.ItemOverlay onClick={props.onClick} />
      <Style.ItemTitle>
        {props.children}
      </Style.ItemTitle>
    </Style.Item>
  );
}
