import Styled from 'styled-components';

type NavItemProps = {
  active?: boolean;
}

export const Nav = Styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  width: 100%;
  max-width: 100%;
`;

export const NavTab = Styled.div`
  max-width: fit-content;
`;

export const NavTabTitle = Styled.a<NavItemProps>`
  font-size: 14px;
  font-weight: 400;
  user-select: none;
  transition: all .25s ease;
  text-align: left;
  cursor: pointer;
  border: 2px solid transparent;
  z-index: 100;
  color: #696969;
  :first-letter {
    text-transform: uppercase;
  }
  transition: color .2s;
  :hover {
    color: #000;
  }
${props => `
${props.active ? `
  color: #FD4D2B;
  font-weight: 500;
  padding-bottom: 10px;
  border-bottom: 4px solid #FD4D2B;
  :hover {
    color: #696969;
    border-bottom: 4px solid #696969;
  }`
    : ``}
`}`;
