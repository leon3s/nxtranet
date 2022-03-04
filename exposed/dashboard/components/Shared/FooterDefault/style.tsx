import Styled from 'styled-components';
import * as GlobalStyles from '~/styles/global';

export const Container = Styled.div`
  ${props => `
    background-color: ${props.theme.primaryBackground};
    border-top: 1px solid ${props.theme.borderColorDefault};
  `}
`;

export const ContainerD = Styled(GlobalStyles.Container)`
  width: 100%;
  padding: 2rem 0 4rem;
`;

export const LinksContainer = Styled.div`
  display: flex;
  flex-direction: row;
`;

export const LinkContainer = Styled.div`
  width: 248px;
  display: flex;
  flex-direction: column;
`;

export const LinksTitle = Styled.h4`
  font-size: 0.8em;
  color: #111;
`;

export const FooterLink = Styled.a`
  color: #8c8c8c;
  cursor: pointer;
  text-decoration: none;
  margin-bottom: 4px;
  font-size: 0.8em;
  :hover {
    color: #111;
  }
`;

export const DCopy = Styled.p`
  margin-top: 3rem;
  color: #8c8c8c;
  font-size: 0.8em;
`;
