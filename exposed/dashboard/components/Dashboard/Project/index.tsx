import type {ModelProject} from '@nxtranet/headers';
import Link from 'next/link';
import React, {useState} from 'react';
import {AiOutlineCluster} from 'react-icons/ai';
import {FiEdit2} from 'react-icons/fi';
import {GiCargoShip, GiMatterStates, GiShipWheel} from 'react-icons/gi';
import {MdOutlineQueryStats} from 'react-icons/md';
import {SiLinuxcontainers} from 'react-icons/si';
import FooterDefault from '~/components/Shared/FooterDefault';
import {ContainerWrapper} from '~/styles/global';
import * as NavStyle from '~/styles/nav';
import * as ProjectStyle from '~/styles/project';
import {MobileHidden, MobileVisible} from '~/styles/responsive';
import Clusters from './Clusters';
import Containers from './Containers';
import Metrix from './Metrix';
import Pipelines from './Pipelines';
import Production from './Production';
import Settings from './Settings';
import * as Style from './style';


type ProjectProps = {
  data: ModelProject;
  tab: string | null;
  subTab1: string | null;
}

const navItems = [
  {
    title: 'Clusters',
    href: '/clusters',
    icon: () => <AiOutlineCluster
      size={20}
    />,
  },
  {
    title: 'Pipelines',
    href: '/pipelines',
    icon: () => <GiMatterStates
      size={20}
    />,
  },
  {
    title: 'Containers',
    href: '/containers',
    icon: () => <SiLinuxcontainers
      size={20}
    />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: () => <FiEdit2
      size={20}
    />,
  },
  {
    title: 'Production',
    href: '/production',
    icon: () => <GiCargoShip
      size={20}
    />,
  },
  {
    title: 'Metrix',
    href: '/metrix',
    icon: () => <MdOutlineQueryStats
      size={20}
    />,
  }
];

type TabMapping = Record<string, (props: ProjectProps) => JSX.Element>

const tabMapping: TabMapping = {
  clusters: (props) => (
    <Clusters
      clusterName={props.subTab1}
      projectName={props.data.name}
    />
  ),
  containers: (props) => (
    <Containers
      containerName={props.subTab1}
      projectName={props.data.name}
    />
  ),
  settings: (props) => (
    <Settings
      project={props.data}
      projectName={props.data.name}
    />
  ),
  pipelines: (props) => (
    <Pipelines
      projectName={props.data.name}
    />
  ),
  production: (props) => (
    <Production
      projectName={props.data.name}
    />
  ),
  metrix: (props) => (
    <Metrix
      projectName={props.data.name}
    />
  )
}

function generateUrl(name: string, href: string) {
  return `/dashboard/projects/${name}${href}`;
}

function isActive(tab: string | null, href: string): boolean {
  if (href === '/clusters' && !tab) {
    return true;
  }
  return `/${tab}` === href;
}

export default function Project(props: ProjectProps) {
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const tab = (props.tab && tabMapping[props.tab](props)) || tabMapping.clusters(props);

  function onClickMobileSettings() {
    setIsMobileSettingsOpen(!isMobileSettingsOpen);
  }

  return (
    <ContainerWrapper>
      <Style.Container>
        <Style.ProjectWrap>
          <MobileVisible>
            <Style.MobileSettings>
              <Style.MobileSettingAbs>
                <Style.MobileSettingContainer onClick={onClickMobileSettings}>
                  <GiShipWheel size={24} />
                </Style.MobileSettingContainer>
                <Style.MobileNavContainer
                  onMouseUp={onClickMobileSettings}
                  isVisible={isMobileSettingsOpen}
                >
                  {navItems.map((navItem) => (
                    <Link
                    key={navItem.href}
                      passHref
                      href={generateUrl(props.data.name, navItem.href)}
                    >
                      <Style.MobileSettingContainer
                        active={isActive(props.tab, navItem.href)}
                      >
                        {navItem.icon()}
                      </Style.MobileSettingContainer>
                    </Link>
                  ))}
                </Style.MobileNavContainer>
              </Style.MobileSettingAbs>
            </Style.MobileSettings>
          </MobileVisible>
          <ProjectStyle.Title>
            {props.data.name}
          </ProjectStyle.Title>
          <MobileHidden>
            <NavStyle.Nav>
              {navItems.map((navItem) => (
                <NavStyle.NavTab
                  key={navItem.href}
                >
                  <Link
                    passHref
                    href={generateUrl(props.data.name, navItem.href)}
                  >
                    <NavStyle.NavTabTitle
                      active={isActive(props.tab, navItem.href)}
                    >
                      {navItem.title}
                    </NavStyle.NavTabTitle>
                  </Link>
                </NavStyle.NavTab>
              ))}
            </NavStyle.Nav>
          </MobileHidden>
          {tab}
        </Style.ProjectWrap>
      </Style.Container>
      <FooterDefault />
    </ContainerWrapper >
  )
}
