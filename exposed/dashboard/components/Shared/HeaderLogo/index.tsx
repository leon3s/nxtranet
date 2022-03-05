import Link from 'next/link';
import Image from 'next/image';
import Styled from 'styled-components';

const LogoContainer = Styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 20px;
  user-select: none;
  ${props => `
    box-shadow: ${props.theme.boxShadowSmooth};
    background-image: ${props.theme.backgroundGradientInverted};
  `}
`;

const Logo = Styled(Image)`
  user-drag: none;
  user-select: none;
  width: 10px;
  height: 10px;
`;

const IconLink = Styled.a`
  text-decoration: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  ${props => `
    color: ${props.theme.text.primary};
  `}
`;

interface HeaderLogoProps {
  href:string;
}

export default function HeaderLogo(props:HeaderLogoProps) {
  return (
    <Link
      passHref
      href={props.href}
    >
      <IconLink>
        <LogoContainer>
          <Logo
            width={10}
            height={10}
            alt="logo"
            src="/images/logo.png"
          />
        </LogoContainer>
      </IconLink>
    </Link>
  )
}
