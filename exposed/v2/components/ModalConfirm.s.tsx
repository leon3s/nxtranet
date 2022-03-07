import Styled from 'styled-components';
import ButtonLoading from '~/components/ButtonLoading';
import Description from './Description';

export const Container = Styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

export const ModalDescription = Styled(Description)`
  font-size: 12px;
${props => `
  padding-bottom: ${props.theme.spacing};
  color: ${props.theme.text.color.secondary};
`}`;

export const Button = Styled(ButtonLoading)`

`;

export const ButtonCancel = Styled(ButtonLoading)`
`;

type ButtonContainerProps = {
  isConfirmLoading: boolean;
  isConfirmSuccess: boolean;
}

export const ButtonContainer = Styled.div<ButtonContainerProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
${props => `
  ${props.isConfirmLoading ? `
    justify-content: center;
    ${ButtonCancel} {
      display: none;
      width: 0px;
      height: 0px;
    }
  `: `
  `}

  ${props.isConfirmSuccess ? `
    ${ButtonCancel} {
      display: none;
      width: 0px;
      height: 0px;
    }
    ${Button} {
      display: none;
      width: 0px;
      height: 0px;
    }
  `: ''}
`}
`;
