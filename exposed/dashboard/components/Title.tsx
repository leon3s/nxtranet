import Styled from 'styled-components';

export const Title = Styled.h1`
font-family: "Consolas",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif !important;

  font-weight: bold;
${props => `
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.title};
  margin: ${props.theme.spacing} 0px;
`}
`;

export default Title;
