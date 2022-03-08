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
  shallow?: boolean;
}

function MenuNav(props: MenuNavProps) {
  const {
    data,
    baseUrl,
    current,
    shallow,
  } = props;
  return (
    <Style.Nav
      className='scroll-bar'
    >
      <Style.NavContent>
        {data.map((navItem) => (
          <Style.NavTabContainer
            key={navItem.href}
          >
            <Link
              passHref
              shallow={shallow}
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
      </Style.NavContent>
    </Style.Nav>
  );
}

MenuNav.defaultProps = {
  baseUrl: '',
  shallow: false,
};

export default MenuNav;
