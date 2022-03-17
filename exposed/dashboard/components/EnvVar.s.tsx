import Styled from 'styled-components';
import Text from "./Text";

export const Overlay = Styled.div`
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
  box-shadow: ${props.theme.boxShadowAdvenced};
`}`;

export const Container = Styled.div`
  min-width: 100px;
  height: 28px;
  position: relative;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    ${Overlay} {
      display: flex;
      flex-direction: row;
    }
  }
${props => `
  box-shadow: ${props.theme.boxShadowAdvenced};
  background: ${props.theme.view.background.primary};
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
    border: 1px solid ${props.theme.border.color.default};
    box-shadow: ${props.theme.boxShadowAdvenced};
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
    border: 1px solid ${props.theme.border.color.default};
    box-shadow: ${props.theme.boxShadowAdvenced};
  }
`}`;

export const Title = Styled(Text)`
  font-size: 8px;
  font-weight: bold;
`;
