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
  transition: all .4s;
  background-color: rgba(0, 0, 0, 0.42);
${props => `
  backdrop-filter: ${props.theme.view.backdrop.primary};
  ${props.isVisible ? `
    z-index: 99999;
    top: 0px;
  ` : `
    z-index: -99999;
    top: -2000px;
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
  max-width: 400px;
  min-height: 142px;
  height: fit-content;
  width: 100%;
  position: relative;
${props => `
  background: ${props.theme.view.background.primary};
  box-shadow: ${props.theme.boxShadowAdvenced};
  border-radius: 2px;
  border: 1px solid ${props.theme.border.color.default};
`}`;

export const TitleContainer = Styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: fit-content;
`;

export const Children = Styled.div`
  padding: 8px 24px 24px 24px;
  overflow-y: scroll;
  max-height: 100%;
  height: fit-content;
`;
