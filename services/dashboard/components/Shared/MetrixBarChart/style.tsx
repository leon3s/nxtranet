import Styled from 'styled-components';

export const Container = Styled.div`
border: 1px solid transparent;
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
  }
`}
`;

export const Title = Styled.h1`
  font-weight: bold;
  font-size: 12px;
  padding: 0px 6px;
`;
