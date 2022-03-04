import Styled from 'styled-components';

export const ContainerWrapper = Styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  background: transparent;
`;

export const Container = Styled.div`
  max-width: 1024px;
  margin-right: auto;
  background: transparent;
  margin-left: auto;
  @media (max-width: 1024px) {
    max-width: 800px;
  }
  @media (max-width: 900px) {
    max-width: 342px;
  }
`;
