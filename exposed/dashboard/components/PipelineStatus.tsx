import {PipelineStatusEnum} from '@nxtranet/headers';
import Styled from 'styled-components';

export type PipelineStatusProps = {
  color: string;
  status?: PipelineStatusEnum;
};

const opacityStatus = {
  [PipelineStatusEnum.FAILED]: 'red',
  [PipelineStatusEnum.ONLINE]: 'green',
  [PipelineStatusEnum.PASSED]: 'purple',
  [PipelineStatusEnum.STARTING]: 'cyan',
};

const PipelineStatus = Styled.div<PipelineStatusProps>`
  width: 15px;
  height: 15px;
${props => `
  overflow: hidden;
  border-radius: ${props.theme.borderRadius};
  border: 1px solid black;
  background: linear-gradient(135deg, ${props.color} 0 45%, white,
    ${props.status ? opacityStatus[props.status] : props.color} 55% 100%);
`}`;

export default PipelineStatus;
