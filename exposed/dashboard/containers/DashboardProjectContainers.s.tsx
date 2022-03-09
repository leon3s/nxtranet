import Styled from 'styled-components';

export const MenuContainer = Styled.div`
  ${props => `
    border-top: 1px solid ${props.theme.border.color.default};
  `}
`;

export const ContainerContainers = Styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  gap: 8px;
`;
