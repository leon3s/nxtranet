import Styled from 'styled-components';

export const Content = Styled.div`
  height: 100%;
  ${props => `
    padding: ${props.theme.spacing};
  `}
`;
