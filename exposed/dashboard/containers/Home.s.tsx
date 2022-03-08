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

export const Center = Styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${props => `
  border-radius: ${props.theme.borderRadius};
  background-color: ${props.theme.view.background.secondary};
  `}
`;
