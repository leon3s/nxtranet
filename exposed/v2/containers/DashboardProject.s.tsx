import Styled from 'styled-components';

export const MenuNavContainer = Styled.div`
${props => `
  margin-bottom: ${props.theme.spacing};
  border-top: 1px solid ${props.theme.border.color.default};
  border-bottom: 1px solid ${props.theme.border.color.default};
`}
`;

export const ClusterCardContainer = Styled.div`
`;
