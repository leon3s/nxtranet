import Styled from 'styled-components';

import ResponsiveComponent from '../ResponsiveComponent';

export const Container = Styled(ResponsiveComponent)`
`;

export const Content = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  ${props => `
    margin: ${props.theme.spacing};
    margin-right: 0px;
  `}
`;
