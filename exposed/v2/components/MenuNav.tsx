import Link from 'next/link';
import React from 'react';
import * as Style from './MenuNav.s';

export type MenuNavItem = {
  href: string;
  name?: string;
  displayName: string;
  icon?: () => React.ReactNode;
}

export type MenuNavProps = {
  current?: string;
  baseUrl?: string;
  data: MenuNavItem[];
}

function MenuNav(props: MenuNavProps) {
  const {
    data,
    baseUrl,
    current,
  } = props;
  return (
    <Style.Nav
      className='scroll-bar'
    >
      {data.map((navItem) => (
        <Style.NavTabContainer
          key={navItem.href}
        >
          <Link
            passHref
            href={`${baseUrl}${navItem.href}`}
          >
            <Style.NavTabLink
              isActive={current === navItem.name}
            >
              <Style.NavTab>
                <Style.IconContainer>
                  {navItem.icon ?
                    navItem.icon()
                    : null}
                </Style.IconContainer>
                <Style.NavTabText>
                  {navItem.displayName}
                </Style.NavTabText>
              </Style.NavTab>
            </Style.NavTabLink>
          </Link>
        </Style.NavTabContainer>
      ))}
    </Style.Nav>
  );
}

MenuNav.defaultProps = {
  baseUrl: '',
};

export default MenuNav;
