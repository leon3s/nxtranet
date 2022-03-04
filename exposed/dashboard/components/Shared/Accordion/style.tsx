import Styled from 'styled-components';

interface IContentContainerProps {
  isVisible: boolean;
}

export const Container = Styled.div`
  width: 100%;
  height: fit-content;
`;

export const TitleContainer = Styled.div`
  user-select: none;
  cursor: pointer;
  :hover {
    border-radius: 2px;
  }
`;

export const ContentContainer = Styled.div<IContentContainerProps>`
  width: 100%;
  overflow: hidden;
  transition: all .8s ease-in-out;
  ${props => props.isVisible ? `
    max-height: 100vh;
  ` : `
    max-height: 0;
  `}
`;
