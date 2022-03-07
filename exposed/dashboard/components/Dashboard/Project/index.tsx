import type {ModelProject} from '@nxtranet/headers';
import Link from 'next/link';
import React from 'react';
import FooterDefault from '~/components/Shared/FooterDefault';
import PageTitle from '~/components/Shared/PageTitle';
import {ContainerWrapper} from '~/styles/global';
import {
  IconCluster,
  IconContainer,
  IconDelete,
  IconMetrix,
  IconPipeline,
  IconSetting
} from '~/styles/icons';
import * as NavStyle from '~/styles/nav';
import PageWrapper from '../PageWrapper';
import Clusters from './Clusters';
import Containers from './Containers';
import Metrix from './Metrix';
import Pipelines from './Pipelines';
import Settings from './Settings';
import * as Style from './style';

type ProjectProps = {
  data: ModelProject;
  tab: string | null;
  subTab1: string | null;
  onOpenDeleteModal: (data: ModelProject) => void;
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

// type TabLink = {
//   name: string;
//   link: string;
// }

// TODO
// function generateTabs(initialLink: string, tabs: string[]) {
//   const newTabs: TabLink[] = [];
//   tabs.forEach((tab, i) => {
//     const prev = newTabs[i - 1];
//     if (!prev) {
//       newTabs.push({
//         name: tab,
//         link: `${initialLink}/${tab}`,
//       });
//     } else {
//       newTabs.push({
//         name: tab,
//         link: `${prev.link}/${tab}`,
//       });
//     }
//   });
//   return newTabs;
// }

export default function Project(props: ProjectProps) {
  const tab = (props.tab && tabMapping[props.tab](props)) || tabMapping.clusters(props);

  function onOpenModalDeleteProject() {
    props.onOpenDeleteModal(props.data);
  }

  return (
    <ContainerWrapper>
      <PageWrapper>
        <Style.Container>
          <Style.ProjectWrap>
            {/* <Style.NavFeedContainer>
                <Style.NavFeedWrapper>
                  <Link
                    passHref
                    href="/dashboard/projects"
                  >
                    <Style.NavFeedItem>
                      Projects
                    </Style.NavFeedItem>
                  </Link>
                  <Style.NavFeedSeparator>
                    {">"}
                  </Style.NavFeedSeparator>
                </Style.NavFeedWrapper>
                {tabs.map((tab, i) => (
                  <Style.NavFeedWrapper
                    key={tab.name}
                  >
                    <Link
                      passHref
                      href={tab.link}
                    >
                      <Style.NavFeedItem>
                        {tab.name}
                      </Style.NavFeedItem>
                    </Link>
                    {i < tabs.length - 1 ?
                      <Style.NavFeedSeparator>
                        {">"}
                      </Style.NavFeedSeparator> : null}
                  </Style.NavFeedWrapper>
                ))}
              </Style.NavFeedContainer> */}
            <PageTitle
              title={props.data.name}
              actions={[
                {
                  title: 'Settings',
                  icon: () => <IconSetting size={12} />,
                  fn: () => { },
                },
                {
                  title: 'Delete',
                  icon: () => <IconDelete size={12} />,
                  fn: onOpenModalDeleteProject,
                }
              ]}
            />
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
      </PageWrapper>
      <FooterDefault />
    </ContainerWrapper >
  )
}
