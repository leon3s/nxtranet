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

// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

export default function BarChar(props: BarCharProps) {
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
          <XAxis dataKey="_id" />
          <Bar dataKey="count" fill={props.color} />
          <Tooltip />
        </BarChart>
      </ResponsiveContainer>
    </Style.Container>
  )
}
