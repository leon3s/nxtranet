import dynamic from 'next/dynamic';
import React from 'react';
import BarChart from '~/components/MetrixBarChart';
import LoadingBackground from './LoadingBackground';
import * as Style from './MetrixBarChartDynamic.s';

const MetrixBarChart = dynamic(
  async (): Promise<typeof BarChart> => import("../components/MetrixBarChart").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingBackground />,
  }
);

export type MetrixBarChartDynamic = {
  title: string;
  data: any;
}

export default function MetrixBarChartDynamic(props: MetrixBarChartDynamic) {
  const {title, data} = props;
  return (
    <Style.BarChartContainer>
      <Style.BarCharTitle>
        {title}
      </Style.BarCharTitle>
      <MetrixBarChart
        data={data}
        color="#ff4d2a"
      />
    </Style.BarChartContainer>
  );
}
