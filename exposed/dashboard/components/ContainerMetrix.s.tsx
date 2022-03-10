import Styled from 'styled-components';

export const Container = Styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Spacer = Styled.div`
${props => `
  margin: ${props.theme.spacing} 0px;
`}
`;
