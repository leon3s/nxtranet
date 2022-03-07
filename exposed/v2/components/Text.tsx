import Styled from 'styled-components';

export const Text = Styled.p`
${props => `
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.text};
  margin: ${props.theme.spacing} 0px;
`}
`;

export default Text;
