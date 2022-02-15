import React from 'react';
import {
  Bar,
  BarChart, ResponsiveContainer, Tooltip, XAxis
} from 'recharts';
import * as Style from './style';


type BarCharProps = {
  color: string;
  title: string;
  data: any;
}

export default function BarChar(props: BarCharProps) {
  console.log('props', {props});
  return (
    <Style.Container>
      <Style.Title>
        {props.title}
      </Style.Title>
      <ResponsiveContainer
        width="100%"
        height={200}
      >
        <BarChart
          data={props.data.sort((a: any, b: any) => b.count - a.count)}
          margin={{top: 0, right: 0, left: 0, bottom: 0}}
        >
          <XAxis
            interval={0}
            dataKey="_id"
            tickSize={8}
            tickCount={8}
            minTickGap={8}
            axisLine={false}
            allowDecimals={false}
            tick={{fontSize: 6}}
          >
          </XAxis>
          <Bar dataKey="count" fill={props.color} />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Style.Container>
  )
}
