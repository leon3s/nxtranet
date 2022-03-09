import Styled from 'styled-components';
import Label from './Label';
import Text from './Text';
import Title from './Title';

export const Container = Styled.div`
border: 1px solid transparent;
border-radius: 2px;
${props => `
  box-shadow: ${props.theme.boxShadowAdvenced};
  :hover {
    border: 1px solid ${props.theme.border.color.default};
  }
`}
`;

export const MetrixBarCharTitle = Styled(Title)`
  font-weight: bold;
  font-size: 12px;
  padding: 0px 6px;
`;

export const TooltipsContainer = Styled.div`
  background-color: white;
  border-radius: 4px;
  padding: 8px;
  ${props => `
    border: 1px solid ${props.theme.border.color.default};
  `}
`;

export const TooltipsLabel = Styled(Label)`
  margin: 0px;
`;

export const TooltipsValue = Styled(Text)`
  margin: 0px;
  text-align: center;
  ${props => `
    color: ${props.theme.text.color.colored};
  `}
`;
