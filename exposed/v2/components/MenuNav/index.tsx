import Link from 'next/link';
import React from 'react';

import * as Style from './style';

export type MenuNavItem = {
  href: string;
  name?: string;
  displayName: string;
  icon?: () => React.ReactNode;
}

export type MenuNavProps = {
  current?: string;
  data: MenuNavItem[];
}

function MenuNav(props: MenuNavProps) {
  const {
    data,
    current,
  } = props;
  return (
    <Style.Nav
      className='scroll-bar'
    >
      {data.map((navItem) => (
        <Style.NavTab
          key={navItem.href}
        >
          <Link
            passHref
            href={navItem.href}
          >
            <Style.NavTabTitle
              active={current === navItem.name}
            >
              {navItem.icon ? [navItem.icon(), '&nbsp;'] : null}
              {navItem.displayName}
            </Style.NavTabTitle>
          </Link>
        </Style.NavTab>
      ))}
    </Style.Nav>
  );
}

export default MenuNav;
