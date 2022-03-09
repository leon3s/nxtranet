import Styled from 'styled-components';
import Label from './Label';

export const ContainerAnimed = Styled.div<{
  isVisible?: boolean;
}>`
  transition: opacity .5s ease;
  ${props => `
    ${props.isVisible ? `
    ` : `
      opacity: 0;
      min-height: 0px;
      max-height: 0px;
      height: 0px;
      overflow: hidden;
    `}
  `}
`;

export const HiddenLink = Styled.a`
  padding: 0px;
  margin: 0px;
`;

export const PipelineCardTitleContainer = Styled.div`
  margin: 0px 12px;
  align-items: center;
  display: inline-flex;
  justify-content: space-between;
  flex: 1;
`;

export const PipelineCardTitleHeader = Styled.div`
  align-items: center;
  display: inline-flex;
`;

export const PipelineCardContentHeader = Styled.div`
  margin: 0px 4px;
`;

export const PipelineContent = Styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const PipelineCmdContainer = Styled.div`
  display: flex;
  flex-direction: column;
  background-color: #111;
  flex: 1;
  height: 100%;
  width: 100%;
  min-height: 100px;
`;

export const PipelineCmdRow = Styled.div`
  display: inline-flex;
  margin: 8px 12px 0px 12px;
  align-items: center;
  justify-content: space-between;
`;

export const PipelineCmdText = Styled(Label)`
  color: white;
`;

export const PipelineCmdActions = Styled.div`
`;
