import Styled from 'styled-components';
import Label from './Label';
import Text from './Text';

export const NginxFileCardIcon = Styled.div`
  ${props => `
    color: ${props.theme.text.color.primary};
  `}
`;

export const NginxFileCardContainer = Styled.a`
  display: flex;
  padding: 6px;
  position: relative;
  flex-direction: row;
  cursor: pointer;
  overflow: hidden;
  background-color: white;
  transition: all .4s;
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
      background-color: ${props.theme.view.background.hover};
    }
  `}
`;

export const NginxFileCardTitleContainer = Styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-direction: column;
`;

export const NginxFileCardDescription = Styled.div`
`;

export const NginxFileCardSubtitle = Styled(Label)`
  cursor: pointer;
`;

export const NginxFileCardTitle = Styled(Text)`
  margin: 0px;
`;
