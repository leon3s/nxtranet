import Styled from 'styled-components';
import { A } from '~/styles/link';

export const Container = Styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const AccordionHeader = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
${props => `
  padding-right: ${props.theme.padding.light}px;
`}
`;

export const ContainersContainer = Styled.div`
  margin-top: 8px;
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const AccordionContent = Styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const ContainerLine = Styled.div`
  display: flex;
  flex-direction: row;
  padding: 18px;
  justify-content: space-between;
`;

export const ContainerTitle = Styled.p`
  font-size: 10px;
  margin: 0px;
  min-width: 50%;
  font-weight: bold;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const ContainerValue = Styled.p`
  font-size: 10px;
  margin: 0px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const ContainerValueLink = Styled(A)`
  font-size: 10px;
  margin: 0px;
  padding: 0px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const ContainerOutputWrapper = Styled.div`
  overflow-y: scroll;
  width: 100%;
  display: flex;
  flex: 1;
  background-color: black;
  max-height: 400px;
  transform: rotate(180deg) rotateY(180deg);
`;

export const ContainerOutput = Styled.code`
  color: white;
  padding: 18px;
  height: fit-content;
  word-break: break-word;
  white-space: pre-wrap;
  transform: rotate(180deg) rotateY(180deg);
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

export const Stdout = Styled.span`
  color: rgba(255, 255, 255, 0.8);
`;

export const Stderr = Styled.span`
  color: red;
`;