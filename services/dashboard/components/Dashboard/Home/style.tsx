import Styled from 'styled-components';
import * as GlobalStyle from '~/styles/global';

export const Container = Styled(GlobalStyle.Container)`
  flex: 1;
  width: 100%;
  padding-top: 8px;
  display: flex;
  min-height: 100%;
  height: fit-content;
  flex-direction column;
`;

export const FormWrap = Styled.div`
  max-width: 400px;
`;

export const NumberBlocks = Styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const NumberBlock = Styled.div`
  width: 100%;
  flex: 1 0 26%;
  height: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 10px 6px;
  border: 1px solid transparent;
  ${props => `
    box-shadow: ${props.theme.boxShadowDefault};
    :hover {
      border: 1px solid ${props.theme.borderColorDefault};
    }
`}
`;

export const NumberBlockTitle = Styled.h1`
  font-weight: bold;
  font-size: 12px;
  text-align: center;
  width: 100%;
  margin: 0px 0px 10px 0px;
`;

export const NumberBlockValue = Styled.p`
  font-weight: bold;
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin: 0px;
  ${props => `
    color: ${props.theme.text.secondary};
  `}
`;

export const CharWrapper = Styled.div`
  margin: 10px 6px;
`;
