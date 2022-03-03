import Styled from 'styled-components';

export const MobileVisible = Styled.div`
  @media (max-width: 900px) {
    display: block;
  }
  display: none;
`;

export const MobileHidden = Styled.div`
  @media (max-width: 900px) {
    width: 0px;
    height: 0px;
    display: none;
  }
`;
