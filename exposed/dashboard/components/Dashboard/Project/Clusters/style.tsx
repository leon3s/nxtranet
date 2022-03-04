import Styled from 'styled-components';

export const Container = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const Title = Styled.h1`
  font-weight: bold;
  font-size: 12px;
  margin: 0px;
${props => `
  padding: ${props.theme.padding.light}px;
  padding-bottom: 0px;
`}`;

export const ClustersContainer = Styled.div`
  margin-top: 8px;
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
`;

export const ClusterContent = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export const FlexLine = Styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
  max-width: auto;
  align-items: center;
  max-height: 40px;
  height: fit-content;
${props => `
  padding: ${props.theme.padding.light}px;
`}`;

export const ClusterContainers = Styled.div`
  padding: 8px;
  display: flex;
`;

export const ClusterCardTitleContainer = Styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const ClusterCardTitleActions = Styled.div`
  display: flex;
`;
