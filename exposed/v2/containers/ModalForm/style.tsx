import Styled from 'styled-components';

export const Container = Styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  ${props => `
  background-color: ${props.theme.view.background.primary};
  `}
`;
