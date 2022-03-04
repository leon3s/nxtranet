import React, {useState} from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid, ResponsiveContainer,
  Tooltip,
  XAxis
} from 'recharts';
import type {ContentType} from 'recharts/types/component/Tooltip';
import * as Style from './style';

type BarCharProps = {
  color: string;
  title: string;
  data: any;
  tooltipsLabel?: string;
}

export default function BarChar(props: BarCharProps) {
  const [activeBarLabel, setActiveBarLabel] = useState<string | null>(null);
  const renderTooltips: ContentType<number, string> = ({active, label, payload}) => {
    if (active && payload && payload.length) {
      return (
        <Style.TooltipsContainer>
          <Style.TooltipsLabel>
            {`[ ${label} ]`}
          </Style.TooltipsLabel>
          <Style.TooltipsValue>
            {payload[0].value}
          </Style.TooltipsValue>
        </Style.TooltipsContainer>
      );
    }
    return null;
  }

  return (
    <Style.Container>
      <Style.MetrixBarCharTitle>
        {props.title}
      </Style.MetrixBarCharTitle>
      <ResponsiveContainer
        width="100%"
        height={200}
      >
        <BarChart
          data={props.data}
          margin={{top: 2, right: 0, left: 0, bottom: 0}}
        >
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis
            interval={0}
            dataKey="_id"
            tick={{fontSize: 6}}
          >
          </XAxis>
          <Bar
            onMouseEnter={({label}) => setActiveBarLabel(label)}
            onMouseLeave={() => setActiveBarLabel(null)}
            radius={4}
            style={{
              borderTopRightRadius: 4,
              borderTopLeftRadius: 4,
            }}
            barSize={5}
            dataKey="count"
            fill={props.color}
          />
          <Tooltip
            content={renderTooltips}
            cursor={{fillOpacity: 0.2}}
          />
        </BarChart>
      </ResponsiveContainer>
    </Style.Container>
  )
}
