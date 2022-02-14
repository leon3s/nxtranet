import type {ModelProject} from '@nxtranet/headers';
import React from 'react';
import Accordion from '~/components/Shared/Accordion';
import * as AccordionStyle from '~/styles/accordionLine';

type ProjectCardProps = {
  isVisible: boolean;
  data: ModelProject;
  onClick: (data: ModelProject) => void;
};

export default function ProjectCard(props: ProjectCardProps) {
  const {
    data,
    isVisible,
  } = props;

  function onClick() {
    props.onClick(data);
  }

  return (
    <AccordionStyle.AccordionContainer>
      <Accordion
        onClick={onClick}
        isVisible={isVisible}
        title={
          <AccordionStyle.AccordionTitle>
            {data.name}
          </AccordionStyle.AccordionTitle>
        }
        content={
          <AccordionStyle.AccordionContent>
          </AccordionStyle.AccordionContent>
        }
      />
    </AccordionStyle.AccordionContainer>
  )
}
