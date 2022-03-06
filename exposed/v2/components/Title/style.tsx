import Styled from 'styled-components';

export const Title = Styled.h1`
  ${props => `
    color: ${props.theme.text.color.secondary};
    font-size: ${props.theme.text.fontSize.title};
  `}
`;
