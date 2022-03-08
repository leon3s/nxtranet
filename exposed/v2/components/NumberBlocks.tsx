import React from 'react';
import LoadingBackground from './LoadingBackground';
import * as Style from './NumberBlocks.s';

type NumberBlock = {
  title: string;
  value?: string | number;
}

type NumberBlocksProps = {
  data: NumberBlock[]
}

export default function NumberBlocks(props: NumberBlocksProps) {
  return (
    <Style.NumberBlocks>
      {props.data.map((block, i) => (
        <Style.NumberBlock
          key={`${block.title}-${i}`}
        >
          <LoadingBackground />
          <Style.NumberBlockTitle>
            {block.title}
          </Style.NumberBlockTitle>
          <Style.NumberBlockValue>
            {block.value || '      '}
          </Style.NumberBlockValue>
        </Style.NumberBlock>
      ))}
    </Style.NumberBlocks>
  );
}
