/*
 * Filename: c:\Users\leone\Documents\code\docktron\org\components\FooterDefault\index.tsx
 * Path: c:\Users\leone\Documents\code\docktron\org
 * Created Date: Monday, October 25th 2021, 12:52:21 am
 * Author: leone
 * 
 * Copyright (c) 2021 docktron
 */

import React from 'react';

import Link from 'next/link';

import * as Style from './style';

export default class FooterDefault extends React.PureComponent {
  render() {
    return (
      <Style.ContainerWrapper>
      <Style.ContainerD>
        <Style.LinksContainer>
          <Style.LinkContainer>
            <Style.LinksTitle>
              General resources
            </Style.LinksTitle>
            <Link
              href="/"
              passHref
            >
              <Style.FooterLink>
                Home
              </Style.FooterLink>
            </Link>
            <Link
              href="/releases"
              passHref
            >
              <Style.FooterLink>
                Releases
              </Style.FooterLink>
            </Link>
            <Style.FooterLink
              target="_blank"
              href="https://github.com/leon3s/Docktron"
            >
              Github
            </Style.FooterLink>
          </Style.LinkContainer>
        </Style.LinksContainer>
        <Style.DCopy>
          Copyright © 2021 Doctron, Inc. All rights reserved.
        </Style.DCopy>
      </Style.ContainerD>
    </Style.ContainerWrapper>
    );
  }
}
