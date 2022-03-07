import Styled from 'styled-components';

const LinearBackground = Styled.div`
  width: 100%;
  height: 100%;
  ${props => `
    background-image: ${props.theme.linearGradient};
  `}
`;

export default LinearBackground;
