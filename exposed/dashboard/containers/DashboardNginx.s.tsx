import Styled from 'styled-components';

export const MenuNavContainer = Styled.div`
${props => `
  height: fit-content;
  margin-bottom: ${props.theme.spacing};
  border-top: 1px solid ${props.theme.border.color.default};
  border-bottom: 1px solid ${props.theme.border.color.default};
`}
`;

export const FilesCardContainer = Styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
