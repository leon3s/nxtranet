import React from 'react';
import * as Style from './ContainerMetrix.s';
import NumberBlocks from './NumberBlocks';

export type ContainerMetrixProps = {
  data: any | null;
}

function calculatePercent(n1: number, n2: number) {
  return (n2 / n1 * 100).toFixed(2);
}

export default function ContainerMetrix(props: ContainerMetrixProps) {
  const {data} = props;
  const numberBlocks1 = [
    {
      title: 'Art',
      value: data.art.toString(),
    },
    {
      title: 'Requests Handled',
      value: data.reqCount,
    }
  ];
  const {stat} = data;
  console.log(stat);
  const {
    networks,
    cpu_stats,
    blkio_stats,
    memory_stats,
  } = stat;
  const diskStat = blkio_stats.io_service_bytes_recursive?.length ?
    blkio_stats.io_service_bytes_recursive : [{value: 0}, {value: 0}];


  const numberBlock2 = [
    {
      title: 'Cpu usage',
      value: calculatePercent(
        cpu_stats.system_cpu_usage,
        cpu_stats.cpu_usage.total_usage,
      ).toString(),
    },
    {
      title: 'Memory usage',
      value:
        `${((memory_stats.usage - (memory_stats.total_inactive_file || 0)) / 1000000).toFixed(2)} MB`,
    },
    {
      title: 'Disk read/write',
      value: diskStat.reduce((acc: string, item: any) => {
        acc += `${(item.value / 1000).toFixed(2)} kB `;
        return acc;
      }, '')
    },
    {
      title: 'Network I/O',
      value: `
        ${((networks.eth0.rx_bytes - networks.eth0.rx_packets) / 1000).toFixed(2)} kB
        ${((networks.eth0.tx_bytes - networks.eth0.tx_packets) / 1000).toFixed(2)} kB
      `
    }
  ];

  return (
    <Style.Container>
      <NumberBlocks
        data={numberBlocks1}
      />
      <Style.Spacer />
      <NumberBlocks
        data={numberBlock2}
      />
    </Style.Container >
  );
}
