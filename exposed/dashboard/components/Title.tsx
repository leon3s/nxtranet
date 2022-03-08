import Styled from 'styled-components';

export const Title = Styled.h1`
  font-weight: bold;
${props => `
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.title};
  margin: ${props.theme.spacing} 0px;
`}
`;

export default Title;
