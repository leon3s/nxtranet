import Styled from 'styled-components';

export const ContainerLogsWrapper = Styled.div`
  overflow-y: scroll;
  width: 100%;
  display: flex;
  flex: 1;
  background-color: black;
  max-height: 400px;
  transform: rotate(180deg) rotateY(180deg);
${props => `
    border-radius: ${props.theme.borderRadius};
    border: 1px solid ${props.theme.border.color.default};
    box-shadow: ${props.theme.boxShadowAdvenced};
  `}
`;

export const ContainerLogs = Styled.code`
  color: white;
  padding: 12px;
  height: fit-content;
  word-break: break-word;
  white-space: pre-wrap;
  transform: rotate(180deg) rotateY(180deg);
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  font-size: 10px;
  ${props => `
    border-radius: ${props.theme.borderRadius};
  `}
`;

export const Command = Styled.span`
  color: white;
  height: fit-content;
  font-weight: bold;
  margin-bottom: 8px;
`;

export const Stdout = Styled.span`
  color: rgba(255, 255, 255, 0.8);
`;

export const Stderr = Styled.span`
  color: red;
`;
