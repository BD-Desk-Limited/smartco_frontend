import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// One metric as a single pill-shaped bar for the period, plus a second, paler bar for the
// comparison period when there is one. bars: [{ label, value, compared? }]
// format: (value, { compact }) -> text.
const ComparisonBarChart = ({ title, bars, color, yLabel, format }) => (
  <section className="flex flex-col gap-2 border border-gray-shadow9 rounded-xl bg-white p-4 min-w-0">
    <h3 className=" font-semibold" style={{ color }}>
      {title}
    </h3>
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={bars}
          margin={{ top: 24, right: 8, bottom: 4, left: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#EAEFF7"
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#0E1013' }}
            tickLine={false}
            axisLine={{ stroke: '#D9D9D9' }}
            interval={0}
          />
          <YAxis
            tickFormatter={(v) => format(v, { compact: true })}
            tick={{ fontSize: 10, fill: '#757575' }}
            tickLine={false}
            axisLine={false}
            width={56}
            label={{
              value: yLabel,
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
              fill: '#0E1013',
            }}
          />
          <Tooltip
            cursor={{ fill: '#F8F9FA' }}
            formatter={(value) => [format(value), title]}
          />
          <Bar dataKey="value" radius={[999, 999, 999, 999]} maxBarSize={56}>
            {bars.map((bar, index) => (
              <Cell
                key={index}
                fill={color}
                fillOpacity={bar.compared ? 0.4 : 1}
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(v) => format(v, { compact: true })}
              style={{ fontSize: 11, fill: '#0E1013' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </section>
);

export default ComparisonBarChart;
