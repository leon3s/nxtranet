import Styled from 'styled-components';

type ContainerProps = {
  isVisible: boolean;
}

export const Container = Styled.div<ContainerProps>`
  position: fixed;
  left: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 100%;
  height: 100%;
  transition: all .6s ease;
${props => `
  backdrop-filter: ${props.theme.header.backdrop};
  ${props.isVisible ? `
  z-index: 99999;
  top: 0px;
  transform: scale(1);
  ` : `
  z-index: -99999;
  top: -2000px;
  transform: scale(0);
  `}
`}`;

export const ContentWrapper = Styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 180px);
`;

export const Content = Styled.div`
  align-self: center;
  display: flex;
  flex-direction: column;
  max-width: 342px;
  min-height: 142px;
  height: fit-content;
  width: 100%;
  position: relative;
${props => `
  background-image: ${props.theme.backgroundGradient};
  box-shadow: ${props.theme.boxShadowSmooth};
  border-radius: 6px;
  border: 1px solid ${props.theme.borderColorDefault};
`}`;

export const TitleContainer = Styled.div`
  display: flex;
  padding: 24px;
  height: 50px;
  width: 100%;
`;

export const Children = Styled.div`
  padding: 0px 24px 24px 24px;
  overflow-y: scroll;
  max-height: 100%;
`;
