import Styled from 'styled-components';

export const Accordions = Styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
`;

export const AccordionTitle = Styled.p`
  font-size: 14px;
  margin: 0px;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-weight: bold;
  ${props => `
    padding: ${props.theme.padding.light}px;
  `}
`;

export const AccordionContainer = Styled.div`
  width: 100%;
  margin-bottom: 12px;
  border-radius: 2px;
  height: fit-content;
  border: 1px solid transparent;
  transition: border 0.4s ease;
${props => `
  box-shadow: ${props.theme.boxShadowAdvenced};
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
    ${AccordionTitle} {
      color: ${props.theme.button.primaryColor};
    }
  }
`}`;

export const AccordionContent = Styled.div`
  display: flex;
  flex-direction: row;
${props => `
  border-top: 1px solid ${props.theme.borderColorDefault};
`}`;
