import Image from 'next/image';
import Styled from 'styled-components';

export const LogoContainer = Styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 20px;
  user-select: none;
  ${props => `
    box-shadow: ${props.theme.boxShadowAdvenced};
  `}
`;

export const Logo = Styled(Image)`
  user-drag: none;
  user-select: none;
  width: 10px;
  height: 10px;
`;

export const IconLink = Styled.a`
  text-decoration: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;
