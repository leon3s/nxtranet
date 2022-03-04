import Styled from 'styled-components';
import {A} from '~/styles/link';
import {Text} from '~/styles/text';

export const ContainerLine = Styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  justify-content: space-between;
`;

export const ContainerTitle = Styled.p`
  font-size: 12px;
  margin: 0px;
  min-width: 50%;
  font-weight: bold;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const ContainerValue = Styled(Text)`
  display: flex;
  font-size: 12px;
  margin: 0px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-transform: lowercase;
${props => `
  color: ${props.theme.text.secondary};
`}
`;

export const ContainerValueLink = Styled(A)`
  font-size: 12px;
  margin: 0px;
  padding: 0px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: lowercase;
  white-space: nowrap;
`;
