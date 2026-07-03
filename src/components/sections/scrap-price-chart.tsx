'use client';

import { useMemo } from 'react';
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import type { ScrapPriceDTO } from '@/lib/data/scrap';

const LINE_COLORS = ['#16305c', '#c8a24a', '#64748b', '#1c2230', '#3b82f6'];

/** Historical price-trend chart (one line per category). Admin-facing. */
export function ScrapPriceChart({
  prices,
  title,
}: {
  prices: Pick<ScrapPriceDTO, 'date' | 'category' | 'price'>[];
  title?: string;
}) {
  const categories = useMemo(
    () => Array.from(new Set(prices.map((p) => p.category))).sort(),
    [prices],
  );

  const chartData = useMemo(() => {
    const dates = Array.from(new Set(prices.map((p) => p.date))).sort();
    return dates.map((date) => {
      const row: Record<string, string | number> = { date };
      for (const cat of categories) {
        const match = prices.find((p) => p.date === date && p.category === cat);
        if (match) row[cat] = match.price;
      }
      return row;
    });
  }, [prices, categories]);

  if (prices.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-soft">
      {title && <h3 className="mb-6 text-lg font-semibold">{title}</h3>}
      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%" className="!relative">
          <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: -8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(215 20% 90%)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: 'hsl(215 14% 42%)' }}
              tickLine={false}
              axisLine={{ stroke: 'hsl(215 20% 90%)' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'hsl(215 14% 42%)' }}
              tickLine={false}
              axisLine={false}
              width={56}
              domain={['auto', 'auto']}
            />
            <RechartsTooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid hsl(215 20% 90%)',
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {categories.map((cat, i) => (
              <Line
                key={cat}
                type="monotone"
                dataKey={cat}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={2}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
