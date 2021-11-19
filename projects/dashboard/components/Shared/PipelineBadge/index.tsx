import React from 'react';

import Styled from 'styled-components';

import {PipelineStatusEnum} from '@nxtranet/headers';
import type {ModelPipelineStatus} from '@nxtranet/headers';

type ColorBadgeProps = {
  color: string;
  status?: string;
};

const opacityStatus = {
  [PipelineStatusEnum.FAILED]: '',
  [PipelineStatusEnum.ONLINE]: '',
  [PipelineStatusEnum.PASSED]: '',
  [PipelineStatusEnum.STARTING]: '',
}

const ColorBadge = Styled.div<ColorBadgeProps>`
width: 20px;
height: 20px;
border-radius: 20px;
${props => `
  background-color: ${props.color};
`}`;

export default ColorBadge;
