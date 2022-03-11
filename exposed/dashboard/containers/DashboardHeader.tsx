import type {NextRouter} from 'next/router';
import {withRouter} from 'next/router';
import React from 'react';
import HeaderLogo from '~/components/HeaderLogo';
import type {MenuNavItem} from '~/components/MenuNav';
import MenuNav from '~/components/MenuNav';
import {IconDnsmasq, IconNginx, IconOverview, IconProject} from '~/styles/icons';
import * as Style from './DashboardHeader.s';

const navItems: MenuNavItem[] = [
  {
    displayName: 'Overview',
    name: '/dashboard',
    href: '/dashboard',
    icon: () => <IconOverview size={16} />,
  },
  {
    displayName: 'Projects',
    name: '/dashboard/projects',
    href: '/dashboard/projects',
    icon: () => <IconProject size={16} />,
  },
  {
    displayName: 'Nginx',
    name: '/dashboard/nginx',
    href: '/dashboard/nginx',
    icon: () => <IconNginx size={16} />,
  },
  {
    displayName: 'Dnsmasq',
    name: '/dashboard/dnsmasq',
    href: '/dashboard/dnsmasq',
    icon: () => <IconDnsmasq size={16} />,
  }
];

type DashboardHeaderProps = {
  router: NextRouter;
}

class DashboardHeader extends
  React.PureComponent<DashboardHeaderProps> {

  state = {
    sticky: false,
  };

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
    if (((window.scrollY + 40) >= elY)) {
      this.setState({
        sticky: true,
      });
    } else if (this.state.sticky) {
      this.setState({
        sticky: false,
      });
    }
  };

  render() {
    const {sticky} = this.state;
    const {router} = this.props;
    const item = navItems.find((navItem) => {
      return navItem.href === '/dashboard' ?
        navItem.href === router.asPath
        : router.asPath.includes(navItem.href);
    });
    return (
      <Style.HeaderContainer>
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
                    <Style.MenuNavContainer
                      sticky={sticky}
                    >
                      <MenuNav
                        current={item?.name}
                        data={navItems}
                      />
                    </Style.MenuNavContainer>
                  </Style.MenuContent>
                </Style.MenuContainer>
              </Style.Sticky>
            </Style.SubMenuNav>
          </Style.SubMenu>
        </Style.FixedContainer>
        <Style.Limiter id="dashboard-nav-limiter" />
      </Style.HeaderContainer>
    );
  }
}

export default withRouter(DashboardHeader);
