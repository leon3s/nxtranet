import Styled from 'styled-components';

export const Container = Styled.div`
  display: flex;
  flex-direction: column;
`;

export const PipelineCardContainer = Styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
`;

export const PipelineCardHeader = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 8px;
`;

export const CommandContainer = Styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 8px;
`;

export const CommandCode = Styled.code`
  color: white;
  padding: 18px;
  height: fit-content;
  word-break: break-word;
  background-color: black;
  white-space: pre-wrap;
  border-bottom-left-radius: 4px;
  letter-spacing: 1px;
  border-bottom-right-radius: 4px;
  font-size: 10px;
`;

export const Command = Styled.span`
  color: white;
  font-weight: bold;
  margin: 8px 0px;
`;

export const PipelineCard = Styled.div`
  display: flex;
  flex-direction: column;
${props => `
  padding: ${props.theme.padding.light}px;
`}`;

export const CommandActions = Styled.div`
`;
