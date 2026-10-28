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
      <div className="grid grid-cols-4 gap-3">
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
        <StatCard label="Offers earned" value={header.offersCount ?? 0} />
      </div>

      <div className="flex items-center justify-between">
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

      <div className="grid grid-cols-2 gap-3">
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

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-border rounded-md p-3">
          <h4 className="font-semibold text-text-black mb-2">By branch</h4>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-border">
                <th className="py-1">Branch</th>
                <th className="py-1 text-right">Visits</th>
                <th className="py-1 text-right">Spent</th>
              </tr>
            </thead>
            <tbody>
              {profile.branches.length ? (
                profile.branches.map((b) => (
                  <tr key={b.branchId} className="border-b border-gray-border">
                    <td className="py-1">{b.name}</td>
                    <td className="py-1 text-right">{b.visits}</td>
                    <td className="py-1 text-right">
                      {commaNumberFormat(b.spent, 2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 italic" colSpan={3}>
                    No sales yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border border-gray-border rounded-md p-3">
          <h4 className="font-semibold text-text-black mb-2">
            Favourite items
          </h4>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-border">
                <th className="py-1">Item</th>
                <th className="py-1 text-right">Units</th>
                <th className="py-1 text-right">Orders</th>
              </tr>
            </thead>
            <tbody>
              {profile.topProducts.length ? (
                profile.topProducts.map((p) => (
                  <tr key={p.productId} className="border-b border-gray-border">
                    <td className="py-1">{p.name}</td>
                    <td className="py-1 text-right">{p.quantity}</td>
                    <td className="py-1 text-right">{p.orders}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-2 italic" colSpan={3}>
                    No purchases yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default CustomerOverview;
