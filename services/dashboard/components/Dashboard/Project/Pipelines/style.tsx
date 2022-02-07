import {MdEdit} from 'react-icons/md';
import {TiDelete} from 'react-icons/ti';
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
  padding: 24px;
  height: fit-content;
  word-break: break-word;
  background-color: black;
  white-space: pre-wrap;
  border-bottom-left-radius: 4px;
  letter-spacing: 1px;
  border-bottom-right-radius: 4px;
  font-size: 10px;
`;

export const CommandWrapper = Styled.div`
  position: relative;
  width: fit-content;
`;

export const Command = Styled.span`
  color: white;
  font-weight: bold;
  margin: 8px 0px;
  z-index: 1;
`;

export const PipelineCard = Styled.div`
  display: flex;
  flex-direction: column;
${props => `
  padding: ${props.theme.padding.light}px;
`}`;

export const CommandOptions = Styled.div`
  position: absolute;
  left: -24px;
  top: -2px;
  min-height: 16px;
  display: flex;
  flex-direction: flex-end;
  align-items: flex-end;
  justify-content: flex-end;
  z-index: 10;
`;

export const CommandDelete = Styled(TiDelete)`
  color: red;
  transition: all .2s ease;
  cursor: pointer;
`;

export const CommandEdit = Styled(MdEdit)`
  color: blue;
  cursor: pointer;
  transition: all .2s ease;
`;
