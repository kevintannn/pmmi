'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

/** 30-day daily visits trend (admin-only). */
export function VisitsChart({
  data,
}: {
  data: Array<{ date: string; visits: number }>;
}) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%" className="!relative">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="visitsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16305c" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#16305c" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 90%)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'hsl(215 14% 42%)' }}
            tickLine={false}
            axisLine={{ stroke: 'hsl(215 20% 90%)' }}
            tickFormatter={(v: string) => v.slice(5)}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(215 14% 42%)' }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            width={44}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid hsl(215 20% 90%)',
              fontSize: 13,
            }}
            labelFormatter={(l) => `Date: ${l}`}
            formatter={(v: number) => [v, 'Visits']}
          />
          <Area
            type="monotone"
            dataKey="visits"
            stroke="#16305c"
            strokeWidth={2}
            fill="url(#visitsFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
