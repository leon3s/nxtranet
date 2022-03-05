import React from 'react';

import { withRouter } from 'next/router';

import HeaderLogo from '~/components/HeaderLogo';
import MenuNav from '~/components/MenuNav';

import * as Style from './style';

import type {NextRouter} from 'next/router';
import type { MenuNavItem } from '~/components/MenuNav';

const navItems: MenuNavItem[] = [
  {
    displayName: 'Overview',
    name: undefined,
    href: '/dashboard'
  },
  {
    displayName: 'Projects',
    name: 'projects',
    href: '/dashboard/projects'
  },
  {
    displayName: 'Nginx',
    name: 'nginx',
    href: '/dashboard/nginx',
  },
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
    if (((window.scrollY + 68) >= elY)) {
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
    const [currentTab] = router.query.all || [] as string[];

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
                  <Style.MenuNavContainer
                    sticky={sticky}
                  >
                    <MenuNav
                      current={currentTab}
                      data={navItems}
                    />
                  </Style.MenuNavContainer>
                </Style.MenuContent>
              </Style.MenuContainer>
            </Style.Sticky>
          </Style.SubMenuNav>
          <Style.Limiter id="dashboard-nav-limiter" />
        </Style.SubMenu>
      </React.Fragment>
    );
  }
}

export default withRouter(DashboardHeader);
