import Styled from 'styled-components';
import Label from './Label';

export const ContainerLine = Styled.div`
  display: flex;
  flex-direction: row;
  margin: 8px;
  flex: 1;
  align-items: center;
  height: 20px;
  min-height: 20px;
  max-height: 20px;
  justify-content: space-between;
`;

export const ContainerTitle = Styled(Label)`
  margin: 0px;
  display: flex;
  flex: 1;
  min-width: 20%;
  font-weight: bold;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const ContainerValue = Styled(Label)`
  margin: 0px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-transform: lowercase;
`;

export const ContainerValueLink = Styled.a`
  ${props => `
    font-size: ${props.theme.text.fontSize.label};
  `}
  margin: 0px;
  padding: 0px;
  display: flex;
  text-align: right;
`;
