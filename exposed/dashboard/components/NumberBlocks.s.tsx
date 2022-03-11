import Styled from 'styled-components';
import Description from './Description';
import Label from './Label';

export const NumberBlocks = Styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const NumberBlock = Styled.div`
  width: 100%;
  flex: 1 0 10%;
  height: auto;
  padding: 20px;
  display: flex;
  position: relative;
  overflow: hidden;
  flex-direction: column;
  justify-content: center;
  ${props => `
    border: 1px solid ${props.theme.border.color.default};
    border-radius: ${props.theme.borderRadius};
    background-color: ${props.theme.view.background.primary};
    box-shadow: ${props.theme.boxShadowAdvenced};
`}
`;

export const NumberBlockTitle = Styled(Label)`
  text-align: center;
  width: 100%;
  margin: 0px 0px 10px 0px;
`;

export const NumberBlockValue = Styled(Description)`
  font-weight: bold;
  width: 100%;
  text-align: center;
  margin: 0px;
  ${props => `
    color: ${props.theme.text.color.secondary};
  `}
`;
