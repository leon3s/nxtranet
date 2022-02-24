import type {ModelProject} from '@nxtranet/headers';
import React, { useState } from 'react';
import {FcFolder, FcOpenedFolder} from 'react-icons/fc';
import * as Style from './style';

type ProjectCardProps = {
  isVisible: boolean;
  data: ModelProject;
  onClick: (data: ModelProject) => void;
};

export default function ProjectCard(props: ProjectCardProps) {
  const [ isHover, setIsHover] = useState(false);
  const {
    data,
  } = props;

  function onClick() {
    props.onClick(data);
  }

  function onMouseEnter() {
    setIsHover(true);
  }

  function onMouseLeave() {
    setIsHover(false);
  }

  return (
    <Style.ProjectCardContainer
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {isHover ?
          <FcOpenedFolder size={100} />
        : <FcFolder size={100} />
      }
      <Style.ProjectCardTitleContainer>
        <Style.ProjectCardTitle>
          {props.data.name}
        </Style.ProjectCardTitle>
      </Style.ProjectCardTitleContainer>
    </Style.ProjectCardContainer>
  )
}
