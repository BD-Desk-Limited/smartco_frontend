import { commaNumberFormat } from '@/utilities/numbersUtils';
import React from 'react';

import { formatDate } from '@/utilities/formatTime';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const CustomerOverview = ({
  profile,
  StatCard,
  s,
  setMonths,
  ChartCard,
  header,
  months,
}) => {
  // recharts needs real colours (it cannot read Tailwind class names)
  const BLUE = '#2563eb';
  const GREEN = '#16a34a';
  const MONTH_OPTIONS = [3, 6, 12, 24, 36];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Visits"
          value={s.visits}
          hint="Days with a sale at a branch"
        />
        <StatCard label="Orders" value={s.orders} />
        <StatCard
          label="Total spent"
          value={commaNumberFormat(s.totalSpent, 2)}
        />
        <StatCard
          label="Average order"
          value={commaNumberFormat(s.avgOrderValue, 2)}
        />
        <StatCard
          label="Last visit"
          value={s.lastVisit ? formatDate(new Date(s.lastVisit)) : '-'}
          hint={
            s.daysSinceLastVisit == null
              ? null
              : s.daysSinceLastVisit === 0
                ? 'Today'
                : `${s.daysSinceLastVisit} days ago`
          }
        />
        <StatCard
          label="First visit"
          value={s.firstVisit ? formatDate(new Date(s.firstVisit)) : '-'}
        />
        <StatCard label="Refunded" value={commaNumberFormat(s.refunded, 2)} />
        <StatCard
          label="Offers earned"
          value={header.rewards?.earned ?? header.offersCount ?? 0}
          hint={
            header.rewards
              ? `${header.rewards.available} available · ${header.rewards.redeemed} used${
                  header.rewards.expired
                    ? ` · ${header.rewards.expired} expired`
                    : ''
                }`
              : undefined
          }
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="font-semibold text-text-black">Trends</h4>
        <label className="flex items-center gap-2">
          Period
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="h-8 px-2 border border-gray-border rounded-md focus:outline-none"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                Last {m} months
              </option>
            ))}
          </select>
        </label>
      </div>

      <ChartCard title="Spend and visits by month">
        <ResponsiveContainer>
          <ComposedChart data={profile.monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis
              yAxisId="spend"
              tickFormatter={(v) => commaNumberFormat(v, 0)}
            />
            <YAxis yAxisId="visits" orientation="right" allowDecimals={false} />
            <Tooltip
              formatter={(value, name) =>
                name === 'Spent' ? commaNumberFormat(value, 2) : value
              }
            />
            <Legend />
            <Bar yAxisId="spend" dataKey="spent" name="Spent" fill={BLUE} />
            <Line
              yAxisId="visits"
              dataKey="visits"
              name="Visits"
              stroke={GREEN}
              strokeWidth={2}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 z-40">
        <ChartCard title="Visits by weekday (all time)">
          <ResponsiveContainer>
            <BarChart data={profile.weekdays}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="visits" name="Visits" fill={GREEN} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="What they buy (units by category)">
          {profile.categories.length ? (
            <ResponsiveContainer>
              <BarChart data={profile.categories.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="name" width={110} />
                <Tooltip />
                <Bar dataKey="quantity" name="Units" fill={BLUE} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="italic">No purchases yet.</p>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="border border-gray-border rounded-md p-3">
          <h4 className="font-semibold text-text-black mb-2">By branch</h4>
          <ResponsiveTable
            layout="table"
            dense
            align="left"
            maxHeightClass=""
            rows={profile.branches}
            getRowKey={(b) => b.branchId}
            emptyMessage="No sales yet."
            columns={[
              { key: 'branch', header: 'Branch', cell: (b) => b.name },
              { key: 'visits', header: 'Visits', align: 'right', cell: (b) => b.visits },
              {
                key: 'spent',
                header: 'Spent',
                align: 'right',
                cell: (b) => commaNumberFormat(b.spent, 2),
              },
            ]}
          />
        </div>

        <div className="border border-gray-border rounded-md p-3">
          <h4 className="font-semibold text-text-black mb-2">
            Favourite items
          </h4>
          <ResponsiveTable
            layout="table"
            dense
            align="left"
            maxHeightClass=""
            rows={profile.topProducts}
            getRowKey={(p) => p.productId}
            emptyMessage="No purchases yet."
            columns={[
              { key: 'item', header: 'Item', cell: (p) => p.name },
              { key: 'units', header: 'Units', align: 'right', cell: (p) => p.quantity },
              { key: 'orders', header: 'Orders', align: 'right', cell: (p) => p.orders },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default CustomerOverview;
