import Link from 'next/link';
import React from 'react';
import * as Style from './Footer.s';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <Style.Container>
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
                href="https://github.com/leon3s/nxtranet"
              >
                Github
              </Style.FooterLink>
            </Style.LinkContainer>
          </Style.LinksContainer>
          <Style.DCopy>
            Copyright © 2022 nxthat, Inc. All rights reserved.
          </Style.DCopy>
        </Style.ContainerD>
      </Style.Container>
    );
  }
}
