import Styled from 'styled-components';
import Text from './Text';

export const BarChartContainer = Styled.div`
  ${props => `
    margin-top: 8px;
    min-height: 200px;
    position: relative;
    overflow: hidden;
    border-radius: ${props.theme.borderRadius};
    box-shadow: ${props.theme.boxShadowAdvenced};
  `}
`;

export const BarCharTitle = Styled(Text)`
  margin: 8px 12px;
`;
