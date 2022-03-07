import type {ModelProject} from '@nxtranet/headers';
import Link from 'next/link';
import React, {useState} from 'react';
import {
  IconProject,
  IconProjectOpen
} from '~/styles/icons';
import * as Style from './ProjectCard.s';

type ProjectCardProps = {
  data?: ModelProject | null;
};

export default function ProjectCard(props: ProjectCardProps) {
  const [isHover, setIsHover] = useState(false);
  const {
    data,
  } = props;

  function onMouseEnter() {
    setIsHover(true);
  }

  function onMouseLeave() {
    setIsHover(false);
  }

  if (!data) {
    return (
      <Style.ProjectCardContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Style.Overlay>
          <Style.AnimatedLine />
        </Style.Overlay>
        <Style.ProjectCardIcon>
          {isHover ?
            <IconProjectOpen size={50} />
            : <IconProject size={50} />
          }
        </Style.ProjectCardIcon>
        <Style.ProjectCardDescription>
          <Style.ProjectCardTitleContainer>
            <Style.ProjectCardTitle>
              project name
            </Style.ProjectCardTitle>
            <Style.ProjectCardSubtitle
            >
              github_username/project_name
            </Style.ProjectCardSubtitle>
          </Style.ProjectCardTitleContainer>
        </Style.ProjectCardDescription>
      </Style.ProjectCardContainer>
    );
  }
  return (
    <Link
      passHref
      href={`/dashboard/projects/${data.name}`}
    >
      <Style.ProjectCardContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Style.ProjectCardIcon>
          {isHover ?
            <IconProjectOpen size={50} />
            : <IconProject size={50} />
          }
        </Style.ProjectCardIcon>
        <Style.ProjectCardDescription>
          <Style.ProjectCardTitleContainer>
            <Style.ProjectCardTitle>
              {data.name}
            </Style.ProjectCardTitle>
            <Style.ProjectCardSubtitle>
              {data.github_username}/{data.github_project}
            </Style.ProjectCardSubtitle>
          </Style.ProjectCardTitleContainer>
        </Style.ProjectCardDescription>
      </Style.ProjectCardContainer>
    </Link>
  );
}
