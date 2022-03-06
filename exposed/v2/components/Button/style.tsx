import Styled from 'styled-components';

export type ButtonColorType = "default" | "danger";

type ButtonProps = {
  colorType: ButtonColorType;
}

export const Button = Styled.button<ButtonProps>`
  border: 0px;
  cursor: pointer;
  min-width: 142px;
  ${props => `
    box-shadow: ${props.theme.boxShadowSmooth};
    font-size: ${props.theme.text.fontSize.description};
    padding: ${props.theme.spacing};
    border-radius: ${props.theme.borderRadius};
    color: ${props.theme.button[props.colorType].color.default};
    background: ${props.theme.button[props.colorType].background.default};
    border: 1px solid ${props.theme.button[props.colorType].border.color};
    :hover {
      color: ${props.theme.button[props.colorType].color.hoverDefault};
      background: ${props.theme.button[props.colorType].background.hoverDefault};
    }
  `}
`;
