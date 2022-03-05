import Styled from 'styled-components';

import Title from '../Title';

export const ModalFormTitle = Styled(Title)`
  margin-left: 4px;
  font-weight: bold;
`;

export const ModalFormTitleContainer = Styled.div`
  display: flex;
  height: fit-content;
  flex-direction: row;
  align-items: center;
  padding: 8px 24px;
  width: 100%;
  ${props => `
    border-bottom: 1px solid ${props.theme.border.color.default};
  `}
`;
