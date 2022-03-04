import Styled from 'styled-components';

export const A = Styled.a`
  height: fit-content;
  padding: 4px 10px;
  width: fit-content;
  font-weight: 500;
  cursor: pointer;
  transition: all .42s ease;
${props => `
  border-radius: 4px;
  background-color: ${props.theme.button.primaryBackground};
  color: ${props.theme.button.primaryColor};
  :hover {
    background-color: ${props.theme.button.primaryColor};
    color: ${props.theme.button.primaryBackground};
}`}`;
