import Styled from 'styled-components';

export const Container = Styled.div`
  width: fit-content;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 200px;
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
`}`;

export const Name = Styled.p`
  padding: 8px;
  font-size: 12px;
${props => `
  color: ${props.theme.text.primary};
`}`;
