import Styled from 'styled-components';

export const ButtonDefault = Styled.button`
  font-weight: 500;
  padding: 0px 8px;
  height: 30px;
  width: fit-content;
  min-width: 142px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 10px;
  transition: all .42s ease;
${props => `
  border: 1px solid ${props.theme.button.primaryBorder};
  color: ${props.theme.button.primaryColor};
  background-color: ${props.theme.button.primaryBackground};
  :hover {
    background-color: ${props.theme.button.primaryColor};
    color: ${props.theme.button.primaryBackground};
  }
`}`;

export const ButtonSubmitDefault = Styled.input.attrs(() => ({
  type: 'submit',
}))`
  width: 100%;
  height: 30px;
  min-width: 0px;
  font-weight: 500;
  font-size: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: all .42s ease;
${props =>`
  border: 1px solid ${props.theme.button.primaryBorder};
  background-color: ${props.theme.button.primaryBackground};
  color: ${props.theme.button.primaryColor};
  :hover {
    background-color: ${props.theme.button.primaryColor};
    color: ${props.theme.button.primaryBackground};
  }
`}`;

export const ButtonCancelDefault = Styled(ButtonDefault)`
  border-color: red;
  margin: 0;
  color: white;
  background-color: red;
  :hover {
    background-color: white;
    color: red;
  }
`;
