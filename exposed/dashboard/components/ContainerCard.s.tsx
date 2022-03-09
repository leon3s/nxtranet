import Styled from 'styled-components';
import {IconContainer} from '~/styles/icons';
import Label from './Label';
import PipelineStatus from './PipelineStatus';
import Text from './Text';

export const ContainerCardContainer = Styled.div`
display: flex;
padding: 8px;
position: relative;
flex-direction: row;
cursor: pointer;
overflow: hidden;
background-color: white;
transition: all .4s ease;
min-width: calc((100% / 4) - 6px);
box-sizing: border-box;
@media (max-width: 1024px) {
  min-width: calc((100% / 2) - 4px);
}
@media (max-width: 900px) {
  min-width: calc(100%);
}
${props => `
  border-radius: ${props.theme.borderRadius};
  box-shadow: ${props.theme.boxShadowAdvenced};
  :hover {
    opacity: 0.8;
    background: ${props.theme.view.background.hover};
  }
`}`;

export const HiddenLink = Styled.a`
  color: inherit;
  display: flex;
  flex: 1;
  flex-direction: row;
`;

export const ContainerCardIcon = Styled.div`
  position: relative;
  margin-right: 4px;
`;

export const PipelineStatusContainer = Styled.div`
  position: absolute;
  z-index: 2;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PipelineStatusBigger = Styled(PipelineStatus)`
`;

export const ContainerIcon = Styled(IconContainer)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  ${props => `
    color: ${props.theme.text.color.primary};
  `}
`;

export const ContainerCardContent = Styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const ContainerCardTitle = Styled(Text)`
  max-width: 100%;
  text-wrap: nowrap;
  text-align: left;
  margin: 0px;
`;

export const ContainerCardDescription = Styled(Label)`
  width: 100%;
  cursor: pointer;
  margin-bottom: 0px;
  text-align: left;
`;

export const ContainerCardActions = Styled.div`
`;
