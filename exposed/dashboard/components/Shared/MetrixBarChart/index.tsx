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

// type CustomizedAxisTickProps = {
//   x: number;
//   y: number;
//   stroke?: string;
//   payload: any;
// }

class CustomizedAxisTick extends React.PureComponent<any> {
  render() {
    const {x, y, stroke, payload} = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} stroke={stroke} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">
          {payload.value}
        </text>
      </g>
    );
  }
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
