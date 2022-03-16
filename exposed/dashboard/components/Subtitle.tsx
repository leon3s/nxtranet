import Styled from 'styled-components';

const Subtitle = Styled.h2`
font-family: "Consolas",-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif !important;

  font-weight: 600;
${props => `
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.subtitle};
  margin: ${props.theme.spacing} 0px;
`}`;

export default Subtitle;
