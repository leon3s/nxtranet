import React from 'react';

import Link from 'next/link';

import FooterDefault from '~/components/Shared/FooterDefault';

import Clusters from './Clusters';
import Containers from './Containers';

import { ContainerWrapper } from '~/styles/global';
import * as ProjectStyle from '~/styles/project';
import * as NavStyle from '~/styles/nav';

import type { ModelProject } from '@nxtranet/headers';

import * as Style from './style';
import Settings from './Settings';
import Pipelines from './Pipelines';

type ProjectProps = {
  data: ModelProject;
  tab: string | null;
  subTab1: string | null;
}

const navItems = [
  {
    title: 'Clusters',
    href: '/clusters'
  },
  {
    title: 'Pipelines',
    href: '/pipelines',
  },
  {
    title: 'Containers',
    href: '/containers'
  },
  {
    title: 'Settings',
    href: '/settings',
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
          {tab}
        </Style.ProjectWrap>
      </Style.Container>
      <FooterDefault />
    </ContainerWrapper>
  )
}
