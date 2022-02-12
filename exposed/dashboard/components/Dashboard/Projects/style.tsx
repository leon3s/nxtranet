import Styled from 'styled-components';
import * as GlobalStyle from '~/styles/global';

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
  flex-direction: column;
`;

export const ModalContent = Styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
