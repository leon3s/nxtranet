import type {ModelProject} from '@nxtranet/headers';
import Link from 'next/link';
import React from 'react';
import FooterDefault from '~/components/Shared/FooterDefault';
import {ContainerWrapper} from '~/styles/global';
import {
  IconCluster, IconContainer, IconMetrix, IconPipeline, IconSetting
} from '~/styles/icons';
import * as NavStyle from '~/styles/nav';
import * as ProjectStyle from '~/styles/project';
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
    icon: () => <IconCluster
      size={16}
    />,
  },
  {
    title: 'Pipelines',
    href: '/pipelines',
    icon: () => <IconPipeline
      size={16}
    />,
  },
  {
    title: 'Containers',
    href: '/containers',
    icon: () => <IconContainer
      size={16}
    />,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: () => <IconSetting
      size={16}
    />,
  },
  {
    title: 'Metrix',
    href: '/metrix',
    icon: () => <IconMetrix
      size={16}
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
  const tab = (props.tab && tabMapping[props.tab](props)) || tabMapping.clusters(props);
  return (
    <ContainerWrapper>
      <Style.Container>
        <Style.ProjectWrap>
          <ProjectStyle.Title>
            {props.data.name}
          </ProjectStyle.Title>
          <NavStyle.Nav
            className='scroll-bar'
          >
            {navItems.map((navItem) => (
              <NavStyle.NavTab
                key={navItem.href}
              >
                <Link
                  passHref
                  href={generateUrl(props.data.name, navItem.href)}
                >
                  <Style.DesktopNavTitle
                    active={isActive(props.tab, navItem.href)}
                  >
                    {navItem.icon()}&nbsp;
                    {navItem.title}
                  </Style.DesktopNavTitle>
                </Link>
              </NavStyle.NavTab>
            ))}
          </NavStyle.Nav>
          {tab}
        </Style.ProjectWrap>
      </Style.Container>
      <FooterDefault />
    </ContainerWrapper >
  )
}
