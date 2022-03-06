import Styled from 'styled-components';

export const Container = Styled.div`
  min-height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  ${props => `
    background-image: ${props.theme.backgroundGradient};
  `}
`;
