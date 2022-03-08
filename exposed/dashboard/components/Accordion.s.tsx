import Styled from 'styled-components';

interface IContentContainerProps {
  isVisible: boolean;
}

export const TitleContainer = Styled.div`
  user-select: none;
  cursor: pointer;
`;

export const Container = Styled.div`
  width: 100%;
  height: fit-content;
  overflow: hidden;
  ${props => `
    border-radius: ${props.theme.borderRadius};
    box-shadow: ${props.theme.boxShadowAdvenced};
  `}
`;

export const ContentContainer = Styled.div<IContentContainerProps>`
  width: 100%;
  overflow: hidden;
  transition: all .5s ease-in-out;
  ${props => props.isVisible ? `
    max-height: 400vh;
  ` : `
    max-height: 0;
  `}
`;
