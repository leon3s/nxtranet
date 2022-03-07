import Styled from 'styled-components';

export const Label = Styled.label`
${props => `
  color: ${props.theme.text.color.primary};
  font-size: ${props.theme.text.fontSize.label};
  margin: ${props.theme.spacing} 0px;
`}
`;

export default Label;
