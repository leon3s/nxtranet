import Styled from 'styled-components';

export const Text = Styled.p`
font-family: "Consolas",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif !important;

${props => `
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.text};
  margin: ${props.theme.spacing} 0px;
`}
`;

export default Text;
