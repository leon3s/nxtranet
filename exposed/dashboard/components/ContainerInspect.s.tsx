import Styled from 'styled-components';

export const Content = Styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  ${props => `
    padding: 4px;
    border-radius: ${props.theme.borderRadius};
    box-shadow: ${props.theme.boxShadowAdvenced};
    border: 1px solid ${props.theme.border.color.default};
  `}
`;
