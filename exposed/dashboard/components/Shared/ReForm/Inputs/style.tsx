import Styled from 'styled-components';
import {Text} from '~/styles/text';

export const BaseInput = Styled.input`
  border-radius: 4px;
  padding: 0px 12px;
  line-height: normal;
  height: 28px;
  min-width: 0;
  outline: none;
  font-size: 10px;
  outline: none;
  -webkit-appearance: none;
  transition: border-color .15s ease;
  border: 1px solid rgba(0, 0, 0, 0.2);
${props => `
:focus {
  border-color: ${props.theme.borderColorPrimary};
}`}`;

export const HiddenFileInput = Styled.input.attrs(() => ({
  type: 'file',
}))`
  display: none;
`;

export const InputIconContainer = Styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

interface InputIconImgProps {
  backgroundSrc?: string | null;
}

export const InputIconImg = Styled.div<InputIconImgProps>`
  background-color: grey;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  cursor: pointer;
  background-size: cover;
${props => `
${props.backgroundSrc ? `
  background-image: url('${props.backgroundSrc}');
`: ''}
`}`;

export const ArrayStringContainer = Styled.div`
  display: flex;
  flex-direction: column;
`;

export const StringBadgeContainer = Styled.div`
  display: flex;
  flex-direction: row;
`;

export const StringBadge = Styled.p`
  width: fit-content;
  padding: 6px;
  font-size: 10px;
  margin: 0px;
`;

export const ArrayStringInput = Styled(BaseInput)`
`;

export const InputColor = Styled.input`
  border-radius: 20px;
  width: 20px;
  border: 0px;
  cursor: pointer;
  margin: 0px;
  padding: 0px;
  height: 20px;
  &::-webkit-color-swatch-wrapper {
    margin: 0px;
    padding: 0px;
    border-radius: 20px;
  }
  &::-webkit-color-swatch {
    margin: 0px;
    padding: 0px;
    border-radius: 20px;
  }
`;

export const InputRelationContainer = Styled.div`
`;

export const InputRelationSelect = Styled.select`
  width: 100%;
  height: 30px;
  font-size: 10px;
  padding: 0px 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
${props => `
:focus {
  border-color: ${props.theme.borderColorPrimary};
}`}`;

export const InputRelationOptions = Styled.option`
  padding: 0px 12px;
  height: 30px;
  font-size: 10px;

${props => `
    border-color: ${props.theme.borderColorPrimary};
`}`;

export const Delete = Styled.div`
  position: relative;
  background-color: rgba(220, 20, 60, 0.25);
  width: 100%;
  transition: all .2s ease;
${props => `
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
    box-shadow: ${props.theme.boxShadowDefault};
  }
`}`;

export const Edit = Styled.div`
  position: relative;
  background-color: rgba(0, 191, 255, 0.25);
  width: 100%;
  transition: all .2s ease;
${props => `
  :hover {
    border: 1px solid ${props.theme.borderColorDefault};
    box-shadow: ${props.theme.boxShadowDefault};
  }
`}`;

export const StringBadgeAbs = Styled.div`
  width: 100%;
  height: 100%;
  display: none;
  position: absolute;
  z-index: 101;
`;

export const StringBadgeWrapper = Styled.div`
  position: relative;
  margin: 8px 0px;
  :hover {
    ${StringBadgeAbs} {
      display: flex;
    }
  }
  :first-child {
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    ${Delete} {
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }
  }
  :last-child {
    border-top-right-radius: 20px;
    border-bottom-right-radius: 20px;
    ${Edit} {
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }
  ${props => `
    border: 1px solid ${props.theme.borderColorDefault};
  `}
`;


export const InputMultipleContainer = Styled.div`
  display: flex;
  flex-direction: column;
`;

export const InputMultipleLine = Styled.div`
  display: inline-flex;
  height: 50px;
  flex-wrap: wrap;
  gap: 8px;
`;

export const InputMultipleItemOverlay = Styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 50;
  width: 100%;
  border-radius: 25px;
  height: 100%;
  display: none;
  backdrop-filter: blur(2px);
${props => `
  box-shadow: ${props.theme.boxShadowDefault};
`}`;

export const InputMultipleItem = Styled.div`
  min-width: 100px;
  height: 28px;
  position: relative;
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  :hover {
    ${InputMultipleItemOverlay} {
      display: flex;
      flex-direction: row;
    }
  }
  ${props => `
    box-shadow: ${props.theme.boxShadowDefault};
    background: ${props.theme.header.backgroundColor};
`}`;

export const InputMultipleItemTitle = Styled(Text)`
  font-size: 8px;
  font-weight: bold;
`;
