import type {ModelProject} from '@nxtranet/headers';
import Link from 'next/link';
import React, {useState} from 'react';
import {IconProject, IconProjectOpen} from '~/styles/icons';
import * as Style from './style';


type ProjectCardProps = {
  isVisible: boolean;
  data: ModelProject;
  onClick: (data: ModelProject) => void;
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

  function stopPropagation(e: React.MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
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
            <Link
              passHref
              href={`https://github.com/${data.github_username}/${data.github_project}`}
            >
              <Style.ProjectCardSubLink
                onClick={stopPropagation}
                target="_blank"
              >
                {data.github_username}/{data.github_project}
              </Style.ProjectCardSubLink>
            </Link>
          </Style.ProjectCardTitleContainer>
        </Style.ProjectCardDescription>
      </Style.ProjectCardContainer>
    </Link>
  )
}
