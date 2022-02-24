import Styled from 'styled-components';
import * as GlobalStyle from '~/styles/global';

import {Text} from '~/styles/text';

export const Container = Styled(GlobalStyle.Container)`
  flex: 1;
  width: 100%;
  display: flex;
  min-height: 100%;
  height: fit-content;
  flex-direction column;
`;

export const ProjectsContainer = Styled.div`
  margin-top: 8px;
  display: flex;
  width: 100%;
  flex-direction: wrap;
`;

export const ModalContent = Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

export const ProjectCardContainer = Styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  cursor: pointer;
`;

export const ProjectCardTitle = Styled(Text)`
  text-align: center;
  width: 100%;
`;

export const ProjectCardTitleContainer = Styled.div`
  position: absolute;
  top: 80px;
  width: 100%;
`;
