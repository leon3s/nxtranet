import Styled from 'styled-components';
import {Text} from '~/styles/text';

export const ItemOverlay = Styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 50;
  width: 100%;
  border-radius: 25px;
  height: 100%;
  display: none;
  backdrop-filter: blur(2px);
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
`}`;

export const Item = Styled.div`
  min-width: 100px;
  height: 28px;
  position: relative;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    ${ItemOverlay} {
      display: flex;
      flex-direction: row;
    }
  }
  ${props => `
    box-shadow: ${props.theme.boxShadowDefault};
    background: ${props.theme.header.backgroundColor};
`}`;

export const ItemTitle = Styled(Text)`
  font-size: 8px;
  font-weight: bold;
`;
