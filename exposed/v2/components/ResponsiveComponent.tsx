import Styled from 'styled-components';

const ResponsesiveComponent = Styled.div`
  max-width: 1024px;
  margin-right: auto;
  background: transparent;
  margin-left: auto;
  @media (max-width: 1025px) {
    max-width: 800px;
  }
  @media (max-width: 901px) {
    max-width: 342px;
  }
`;

export default ResponsesiveComponent;
