import Styled from 'styled-components';

const Subtitle = Styled.h2`
${props => `
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.subtitle};
  margin: ${props.theme.spacing} 0px;
`}`;

export default Subtitle;
