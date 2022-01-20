import {PipelineStatusEnum} from '@nxtranet/headers';
import Styled from 'styled-components';



type ColorBadgeProps = {
  color: string;
  status?: PipelineStatusEnum;
};

const opacityStatus = {
  [PipelineStatusEnum.FAILED]: 'red',
  [PipelineStatusEnum.ONLINE]: 'green',
  [PipelineStatusEnum.PASSED]: 'purple',
  [PipelineStatusEnum.STARTING]: 'cyan',
}

const ColorBadge = Styled.div<ColorBadgeProps>`
width: 20px;
height: 20px;
border-radius: 20px;
${props => `
  background: linear-gradient(120deg, ${props.color} 0 45%, white,
    ${props.status ? opacityStatus[props.status] : props.color} 55% 100%);
`}`;

export default ColorBadge;
