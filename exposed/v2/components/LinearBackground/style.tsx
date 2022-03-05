import Styled from 'styled-components';

export const Container = Styled.div`
  width: 100%;
  height: 100%;
  ${props => `
    background-image: ${props.theme.linearGradient};
  `}
`;
