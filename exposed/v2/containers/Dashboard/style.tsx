import Styled from 'styled-components';

export const Container = Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  min-height: 100vh;
  ${props => `
    background-color: ${props.theme.view.background.primary};
  `}
`;
