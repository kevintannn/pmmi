'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';

export type ScrapPriceDTO = {
  id: string;
  date: string; // YYYY-MM-DD
  category: string;
  price: number;
  currency: string;
  notes: string | null;
};

const LINE_COLORS = ['#16305c', '#c8a24a', '#64748b', '#1c2230', '#3b82f6'];
const ALL = '__all__';

export function ScrapPricesView({ prices }: { prices: ScrapPriceDTO[] }) {
  const t = useTranslations('Scrap');
  const tc = useTranslations('Common');
  const [category, setCategory] = useState<string>(ALL);

  const categories = useMemo(
    () => Array.from(new Set(prices.map((p) => p.category))).sort(),
    [prices],
  );

  const filtered = useMemo(
    () => (category === ALL ? prices : prices.filter((p) => p.category === category)),
    [prices, category],
  );

  // Pivot into chart rows: one row per date, one numeric key per category.
  const chartData = useMemo(() => {
    const dates = Array.from(new Set(filtered.map((p) => p.date))).sort();
    const shown = category === ALL ? categories : [category];
    return dates.map((date) => {
      const row: Record<string, string | number> = { date };
      for (const cat of shown) {
        const match = filtered.find((p) => p.date === date && p.category === cat);
        if (match) row[cat] = match.price;
      }
      return row;
    });
  }, [filtered, categories, category]);

  const shownCategories = category === ALL ? categories : [category];

  if (prices.length === 0) {
    return (
      <div className="rounded-2xl border bg-card p-16 text-center text-muted-foreground shadow-soft">
        {t('empty')}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Filter */}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-64">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger aria-label={t('filterCategory')}>
              <SelectValue placeholder={t('filterCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>{tc('all')}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">{t('updated')}</p>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <h3 className="mb-6 text-lg font-semibold">{t('chartTitle')}</h3>
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
              {shownCategories.map((cat, i) => (
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

      {/* Table (newest first) */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('colDate')}</TableHead>
              <TableHead>{t('colCategory')}</TableHead>
              <TableHead className="text-right">{t('colPrice')}</TableHead>
              <TableHead>{t('colCurrency')}</TableHead>
              <TableHead>{t('colNotes')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.date}</TableCell>
                <TableCell>
                  <Badge variant="muted">{p.category}</Badge>
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums">
                  {formatCurrency(p.price, p.currency)}
                </TableCell>
                <TableCell className="text-muted-foreground">{p.currency}</TableCell>
                <TableCell className="text-muted-foreground">{p.notes ?? '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
