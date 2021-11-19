import React from 'react';

import { NextRouter, withRouter } from 'next/router'

import Link from 'next/link';

import * as Style from './style';
import HeaderLogo from '~/components/Shared/HeaderLogo';

const navItems = [
  { title: 'Overview', href: '/dashboard' },
  { title: 'Projects', href: '/dashboard/projects' },
  { title: 'Nginx', href: '/dashboard/nginx' },
];

interface DashboardHeaderProps {
  router: NextRouter;
}

class DashboardHeader extends React.PureComponent<DashboardHeaderProps> {
  state = {
    sticky: false,
  }

  el?: HTMLElement | null;

  componentDidMount() {
    this.el = document.getElementById('dashboard-nav-limiter');
    window.addEventListener('scroll', this.onScrollPtr);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollPtr);
  }

  onScrollPtr = (): void => {
    const {el} = this;
    if (!el) return;
    const elY = el.offsetTop;
    if (((window.scrollY + 68) >= elY)) {
      this.setState({
        sticky: true,
      })
    } else if (this.state.sticky) {
      this.setState({
        sticky: false,
      });
    }
  }

  render() {
    const {sticky} = this.state;
    const {router} = this.props;

    return (
      <React.Fragment>
        <Style.FixedContainer>
          <Style.Container>
            <HeaderLogo
              href="/dashboard"
            />
            <Style.UserAvatar
              width={30}
              height={30}
              src="/images/default_avatar.svg"
            />
          </Style.Container>
        </Style.FixedContainer>
        <Style.SubMenu>
          <Style.SubMenuNav>
            <Style.Sticky
              sticky={sticky}
            >
              <Style.MenuContainer>
                <Style.MenuContent>
                  <Style.AnimLogo
                    sticky={sticky}
                  >
                    <HeaderLogo
                      href="/dashboard"
                    />
                  </Style.AnimLogo>
                  <Style.MenuNav
                    sticky={sticky}
                  >
                    {navItems.map((navItem) => (
                      <Link
                        passHref
                        href={navItem.href}
                        key={`dash-${navItem.title}-${navItem.href}`}
                      >
                        <Style.NavItem
                          active={
                            navItem.href === '/dashboard' ?
                              navItem.href === router.asPath
                            : router.asPath.includes(navItem.href)
                          }
                        >
                          {navItem.title}
                        </Style.NavItem>
                      </Link>
                    ))}
                  </Style.MenuNav>
                </Style.MenuContent>
              </Style.MenuContainer>
            </Style.Sticky>
          </Style.SubMenuNav>
          <Style.Limiter id="dashboard-nav-limiter" />
        </Style.SubMenu>
      </React.Fragment>
    )
  }
}

export default withRouter(DashboardHeader);
