import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'

import HeaderLogo from '~/components/Shared/HeaderLogo';

import * as Style from './style';

interface HeaderLinkProps {
  href:string;
  title:string;
  active?:boolean;
}

function HeaderLink(props:HeaderLinkProps) {
  const {
    href,
    title,
    active,
  } = props;
  return (
    <Style.NavItem>
      <Link
        passHref
        href={href}
      >
        <Style.NavTitle
          active={active}
        >
          {title}
        </Style.NavTitle>
      </Link>
    </Style.NavItem>
  )
}

const navs:HeaderLinkProps[] = [];

export default function Header() {
  const router = useRouter();
  return (
    <Style.FixedContainer>
      <Style.Container>
          <HeaderLogo
            href="/"
          />
          {navs.map((nav) => (
            <HeaderLink
              href={nav.href}
              title={nav.title}
              key={`nav-${nav.title}-${nav.href}`}
              active={
                nav.href === '/' ? nav.href === router.asPath : router.asPath.includes(nav.href)
              }
            />
          ))}
      </Style.Container>
    </Style.FixedContainer>
  )
}
