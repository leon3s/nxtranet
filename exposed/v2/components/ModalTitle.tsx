import React from 'react';
import * as Style from './ModalTitle.s';


export type ModalTitleProps = {
  title: string;
  icon?: React.ReactNode;
}

const ModalTitle = (props: ModalTitleProps) => (
  <Style.ModalFormTitleContainer>
    {props.icon}
    <Style.ModalFormTitle>
      {props.title}
    </Style.ModalFormTitle>
  </Style.ModalFormTitleContainer>
);

export default ModalTitle;
