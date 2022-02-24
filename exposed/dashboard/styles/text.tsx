import Styled from 'styled-components';

export const ModalTitle = Styled.h4`
${props => `
  color: ${props.theme.text.primary}
  font-weight: bold;
  font-size: 14px;
  width: 100%;
  margin-top: 0px;
  text-align: center;
`}`;

export const Title = Styled.p`
  font-size: 16px;
${props => `
  color: ${props.theme.text.primary};
`}`;

export const Text = Styled.p`
  font-size: 12px;
${props => `
  color: ${props.theme.text.primary};
`}`;

export const Description = Styled.span`
  font-size: 8px;
${props => `
  color: ${props.theme.text.secondary};
`} `;
