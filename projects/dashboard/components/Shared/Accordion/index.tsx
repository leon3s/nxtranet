import React, {useState} from 'react';

import * as Style from './style';

interface IAccordionProps {
  isVisible?:boolean;
  title:string | React.ReactChildren | React.ReactElement;
  content:string | React.ReactChildren | React.ReactElement;
  onClick?: () => void;
}

export default function Accordion(props:IAccordionProps) {
  const [isVisible, setIsVisible] = useState(props.isVisible || false);

  function showAccordion() {
    setIsVisible(!isVisible);
    if (props.onClick) props.onClick();
  }

  return (
    <Style.Container>
      <Style.TitleContainer onClick={showAccordion}>
        {props.title}
      </Style.TitleContainer>
      <Style.ContentContainer
        isVisible={isVisible}
      >
        {props.content}
      </Style.ContentContainer>
    </Style.Container>
  )
}
