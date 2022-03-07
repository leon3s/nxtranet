import Styled from 'styled-components';
import Text from './Text';

export const CardTitleContainer = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  flex: 1;
  ${props => `
  border-top: 1px solid ${props.theme.border.color.default};
    :first-child {
      border-top: 0px;
    }
  `}
`;

export const CardTitleText = Styled(Text)`
  font-weight: bold;
  margin: 0px;
`;
