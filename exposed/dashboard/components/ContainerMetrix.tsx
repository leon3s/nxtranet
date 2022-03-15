import React from 'react';
import * as Style from './ContainerMetrix.s';
import MetrixBarChartDynamic from './MetrixBarChartDynamic';
import NumberBlocks from './NumberBlocks';

export type ContainerMetrixProps = {
  data: any | null;
}

function calculateCpuUsage(prevCpu: any, currCpu: any) {
  const cpuDelta = currCpu.cpu_usage.total_usage - prevCpu.cpu_usage.total_usage;
  const systemDelta = currCpu.system_cpu_usage - prevCpu.system_cpu_usage;
  return (cpuDelta / systemDelta * (currCpu.cpu_usage?.percpu_usage?.length || 1) * 100).toFixed(2);
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
  console.log(data);
  const {
    networks,
    cpu_stats,
    precpu_stats,
    blkio_stats,
    memory_stats,
  } = stat;
  const diskStat = blkio_stats.io_service_bytes_recursive?.length ?
    blkio_stats.io_service_bytes_recursive : [{value: 0}, {value: 0}];

  const numberBlock2 = [
    {
      title: 'Cpu usage',
      value: calculateCpuUsage(
        precpu_stats,
        cpu_stats,
      ).toString(),
    },
    {
      title: 'Memory usage',
      value:
        `${((memory_stats.usage - (memory_stats.total_inactive_file || 0)) / 1000000).toFixed(2)} MB`,
    },
    {
      title: 'Disk read/write',
      value: diskStat.reduce((acc: string, item: any, i: number) => {
        if (i > 1) return acc;
        acc += `${(item.value / 1000).toFixed(2)} kB `;
        return acc;
      }, '')
    },
    {
      title: 'Network I/O',
      value: `
        ${((networks.eth0.rx_bytes - networks.eth0.rx_packets) / 1000000).toFixed(2)} MB
        ${((networks.eth0.tx_bytes - networks.eth0.tx_packets) / 1000000).toFixed(2)} MB
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
      <MetrixBarChartDynamic
        title="Requests status"
        data={data.rsc}
      />
    </Style.Container >
  );
}
