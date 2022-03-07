import Link from 'next/link';
import React from 'react';
import * as Style from './HeaderLogo.s';

interface HeaderLogoProps {
  href: string;
}

export default function HeaderLogo(props: HeaderLogoProps) {
  return (
    <Link
      passHref
      href={props.href}
    >
      <Style.IconLink>
        <Style.LogoContainer>
          <Style.Logo
            width={10}
            height={10}
            alt="nxtranet logo"
            src="/images/logo.png"
          />
        </Style.LogoContainer>
      </Style.IconLink>
    </Link>
  );
}
