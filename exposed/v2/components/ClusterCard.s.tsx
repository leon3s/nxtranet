import Styled from 'styled-components';

export const ContainerAnimed = Styled.div<{
  isVisible?: boolean;
}>`
  transition: opacity .5s ease;
  ${props => `
    ${props.isVisible ? `
    ` : `
      opacity: 0;
      min-height: 0px;
      max-height: 0px;
      height: 0px;
      overflow: hidden;
    `}
  `}
`;

export const HiddenLink = Styled.a`
  padding: 0px;
  margin: 0px;
`;

export const ClusterContent = Styled.div`
  display: flex;
  flex: 1;
  margin: 0px 4px;
  flex-direction: column;
`;

export const ClusterLine = Styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
  max-width: auto;
  align-items: center;
  max-height: 40px;
  height: fit-content;
${props => `
padding: ${props.theme.spacing};
`}`;

export const ClusterContainers = Styled.div`
  display: flex;
  ${props => `
    padding: ${props.theme.spacing};
  `}
`;

export const ClusterCardTitleContainer = Styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  margin-left: 4px;
`;

export const ClusterCardTitleActions = Styled.div`
  display: flex;
  margin-right: 12px;
`;

export const ClusterColumn = Styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0px;
`;
