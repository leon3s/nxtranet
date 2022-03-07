import Styled from 'styled-components';
import Subtitle from './Subtitle';

export type NavLinkProps = {
  isActive?: boolean;
}

export const Nav = Styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  flex: 1;
  width: 100%;
  max-width: 100%;
`;

export const NavTabContainer = Styled.div`
  min-width: 80px;
`;

export const IconContainer = Styled.div`
    width: 20px;
    height: 25px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

export const NavTab = Styled.div`
  max-width: fit-content;
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;
  height: 40px;
  border: 2px solid transparent;
  padding: 0px 4px;
`;

export const NavTabText = Styled(Subtitle)`
  margin-left: 2px;
  transition: all .5s ease;
`;

export const NavTabLink = Styled.a<NavLinkProps>`
  user-select: none;
  display: flex;
  font-weight: 600;
  align-items: center;
  transition: all .5s ease;
  text-align: left;
  :first-letter {
    text-transform: uppercase;
  }
  ${props => `
    font-size: ${props.theme.text.fontSize.subtitle};
    color: ${props.theme.text.color.primary};
    :hover {
      ${NavTabText} {
        color: ${props.theme.text.color.secondary};
      }
      color: ${props.theme.text.color.secondary};
    }
    ${props.isActive ? `
      ${NavTabText} {
        color: ${props.theme.text.color.colored};
      }
      color: ${props.theme.text.color.colored};
    ` : ``}
  `}
`;

// ${props => `
// ${props.active ? `
//   border-bottom: 2px solid ${props.theme.border.color.selected};
//   ${NavTabTitle} {
//     color: ${props.theme.text.color.colored};
//     :hover {
//       color: ${props.theme.text.color.primary};
//     }
//   }
//   ${IconContainer} {
//     color: ${props.theme.text.color.colored};
//     :hover {
//       color: ${props.theme.text.color.primary};
//     }
//   }
//   :hover {
//     border-bottom-color: transparent;
//   }
// ` : ``}
// :hover {
//   ${IconContainer} {
//     color: ${props.theme.text.color.secondary};
//   }
//   ${NavTabTitle} {
//       color: ${props.theme.text.color.secondary};
//     }
//   }
// `}
