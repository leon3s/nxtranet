import Styled from 'styled-components';

const Description = Styled.span`
${props => `
  margin: ${props.theme.spacing} 0px;
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.description};
`}
`;

export default Description;
