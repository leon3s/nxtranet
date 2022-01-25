import Styled from 'styled-components';

export const Accordions = Styled.div`
  margin-top: 18px;
  display: flex;
  flex-direction: column;
`;

export const AccordionContainer = Styled.div`
  width: 100%;
  margin-bottom: 12px;
  border-radius: 2px;
  height: fit-content;
  border: 1px solid transparent;
  transition: border 0.4s ease;
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
  }
`}`;

export const AccordionTitle = Styled.p`
  font-size: 14px;
  margin: 0px;
  font-weight: bold;
  :first-letter {
    text-transform: uppercase;
  }
${props => `
  padding: ${props.theme.padding.light}px;
`}
`;

export const AccordionContent = Styled.div`
  display: flex;
  flex-direction: row;
${props => `
  border-top: 1px solid ${props.theme.borderColorDefault};
`}`;
