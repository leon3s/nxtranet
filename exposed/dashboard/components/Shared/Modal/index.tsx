import React from 'react';
import * as Style from './style';

interface ModalProps {
  isVisible: boolean;
  title?: String | React.ReactElement | React.ReactChildren;
  children: React.ReactElement | React.ReactChildren;
}

export default function Modal(props: ModalProps) {
  return (
    <Style.Container
      isVisible={props.isVisible}
    >
      <Style.ContentWrapper>
        <Style.Content>
          {props.title ?
            <Style.TitleContainer>
              {props.title}
            </Style.TitleContainer>
            : null}
          <Style.Children className='scroll-bar'>
            {props.isVisible ? props.children : null}
          </Style.Children>
        </Style.Content>
      </Style.ContentWrapper>
    </Style.Container>
  )
}
