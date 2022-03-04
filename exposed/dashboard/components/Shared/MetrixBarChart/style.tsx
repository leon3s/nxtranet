import Styled from 'styled-components';
import {Text, Title} from '~/styles/text';

export const Container = Styled.div`
border: 1px solid transparent;
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
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
    border: 1px solid ${props.theme.borderColorDefault};
  `}
`;

export const TooltipsLabel = Styled(Title)`
  margin: 0px;
`;

export const TooltipsValue = Styled(Text)`
  margin: 0px;
  text-align: center;
  ${props => `
    color: ${props.theme.button.primaryColor};
  `}
`;
