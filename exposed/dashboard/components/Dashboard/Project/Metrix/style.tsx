import Styled from 'styled-components';
import {Description, Text, Title} from '~/styles/text';

export const Container = Styled.div`
  margin-top: 18px;
`;

export const DomainPathContainers = Styled.div`
  flex: 1;
  flex-direction: column;
`;

export const DomainPathContainer = Styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${props => `
    padding: ${props.theme.padding.default}px;
    box-shadow: ${props.theme.boxShadowDefault};
  `}
`;

export const DomainPathContainerTitle = Styled(Title)`
`;

export const DomainPathTitle = Styled(Text)`
`;

export const DomainPathDescription = Styled(Description)`
  color: red;
  font-weight: bold;
`;

