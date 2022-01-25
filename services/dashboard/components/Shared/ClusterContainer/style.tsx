import Styled from 'styled-components';
import { Text } from "~/styles/text";

export const Overlay = Styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 50;
  width: 100%;
  border-radius: 25px;
  height: 100%;
  display: flex;
  transition: all .2s ease;
  opacity: 0;
  backdrop-filter: blur(2px);
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
`}`;

export const Container = Styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
  cursor: pointer;
  padding: 8px;
  :hover {
    ${Overlay} {
      opacity: 1;
      flex-direction: row;
    }
  }
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
  background: ${props.theme.header.backgroundColor};
`}`;

export const Delete = Styled.div`
  position: relative;
  background-color: rgba(220, 20, 60, 0.25);
  width: 100%;
  z-index: 101;
  transition: all .2s ease;
  border-radius: 25px 0px 0px 25px;
${props => `
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
    box-shadow: ${props.theme.boxShadowDefault};
  }
`}`;

export const Edit = Styled.div`
  position: relative;
  background-color: rgba(0, 191, 255, 0.25);
  width: 100%;
  z-index: 101;
  transition: all .2s ease;
  border-radius: 0px 25px 25px 0px;
${props => `
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
    box-shadow: ${props.theme.boxShadowDefault};
  }
`}`;

export const LineTitle = Styled(Text)`
  font-size: 10px;
  font-weight: bold;
`;

export const LinePort = Styled(Text)`
  font-size: 8px;
  margin-top: 0px;
  color: red;
`;
