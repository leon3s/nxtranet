/*
 * Filename: c:\Users\leone\Documents\code\nextranet\dashboard\components\Shared\Modal\index.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Tuesday, October 26th 2021, 8:51:20 pm
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import React from 'react';

import * as Style from './style';

interface ModalProps {
  isVisible: boolean;
  children: React.ReactElement | React.ReactChildren;
}

export default function Modal(props: ModalProps) {
  return (
    <Style.Container
      isVisible={props.isVisible}
    >
      <Style.ContentWrapper>
        <Style.Content>
          {props.isVisible ? props.children : null}
        </Style.Content>
      </Style.ContentWrapper>
    </Style.Container>
  )
}
