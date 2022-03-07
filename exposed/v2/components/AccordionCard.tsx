import Styled from 'styled-components';
import Subtitle from './Subtitle';

export const AccordionTitle = Styled(Subtitle)`
  margin: 0px;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
  font-weight: bold;
  transition: all .5s ease;
  ${props => `
    padding: ${props.theme.spacing};
    :hover {
    }
  `}
`;

export const AccordionTitleContainer = Styled.div`
  width: 100%;
  display: inline-flex;
  ${props => `
    :hover {
      ${AccordionTitle} {
        color: ${props.theme.text.color.secondary};

      }
    }
  `}
`;

export const AccordionContainer = Styled.div`
  width: 100%;
  margin-bottom: 12px;
  border-radius: 2px;
  height: fit-content;
  border: 1px solid transparent;
  transition: all .5s ease;
`;

export const AccordionContent = Styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
${props => `
  border-top: 1px solid ${props.theme.border.color.default};
`}`;
