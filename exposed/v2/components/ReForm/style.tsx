import Styled from 'styled-components';

export const Container = Styled.div`
  width: 100%;
`;

export const Form = Styled.form`
  display: flex;
  flex-direction: column;
`;

export const InputLine = Styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputTitle = Styled.label`
  font-size: 12px;
  margin: 0px;
${props => `
  color: ${props.theme.text.color.primary};
`}`;

export const InputDescription = Styled.span`
  font-size: 8px;
  padding: 8px 0px;
  margin: 0 0 8px 0;
${props => `
  color: ${props.theme.text.color.secondary};
  box-shadow: ${props.theme.boxShadowSmooth};
`}
`;


type InputErrorProps = {
  isVisible: boolean;
}

export const InputError = Styled(InputDescription) <InputErrorProps>`
  color: red;
  overflow: hidden;
  transition: all .4s ease;
  ${props => `
  ${props.isVisible ? `
    opacity: 1;
    transform: scaleY(1);
  ` : `
    height: 0px;
    min-height: 0px;
    font-size: 0px;
    opacity: 0;
    transform: scaleY(-1);
  `}
`}`;

export const ButtonContainer = Styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  margin-top: 8px;
  justify-content: space-between;
`;

export const HiddenDiv = Styled.div`
  display: flex;
`;
