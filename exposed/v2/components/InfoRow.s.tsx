import Styled from 'styled-components';
import Description from './Description';
import Label from './Label';

export const ContainerLine = Styled.div`
  display: flex;
  flex-direction: row;
  padding: 8px;
  justify-content: space-between;
`;

export const ContainerTitle = Styled(Label)`
  margin: 0px;
  min-width: 50%;
  font-weight: bold;
  &:first-letter {
    text-transform: uppercase;
  }
`;

export const ContainerValue = Styled(Description)`
  display: flex;
  margin: 0px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  text-transform: lowercase;
${props => `
  color: ${props.theme.text.color.secondary};
`}
`;

export const ContainerValueLink = Styled.a`
  ${props => `
    font-size: ${props.theme.text.fontSize.description};
  `}
  margin: 0px;
  padding: 0px;
  text-align: right;
  text-overflow: ellipsis;
  overflow: hidden;
  text-transform: lowercase;
  white-space: nowrap;
`;
