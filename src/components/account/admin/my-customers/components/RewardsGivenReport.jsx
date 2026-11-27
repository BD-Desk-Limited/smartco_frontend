import React, { useCallback, useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  fetchPromoOptionsService,
  fetchRewardsGivenReportService,
} from '@/services/customerServices';
import ResponsiveTable from '@/components/account/admin/ui/ResponsiveTable';

const ymd = (d) => d.toISOString().slice(0, 10);
const money = (n, currency = '') => `${currency}${Number(n || 0).toFixed(2)}`;

const Table = ({ title, head, rows }) => (
  <div className="border rounded-lg p-3 flex flex-col gap-2">
    <h3 className="font-semibold text-sm">{title}</h3>
    {rows.length === 0 ? (
      <p className="text-sm text-text-gray">Nothing in this period.</p>
    ) : (
      <ResponsiveTable
        layout="table"
        dense
        align="left"
        maxHeightClass=""
        rows={rows}
        getRowKey={(r) => r.key}
        columns={head.map((h, i) => ({
          key: h,
          header: h,
          align: i > 0 ? 'right' : 'left',
          cell: (r) => r.cells[i],
        }))}
      />
    )}
  </div>
);

const RewardsGivenReport = () => {
  const today = new Date();
  const [from, setFrom] = useState(
    ymd(new Date(today.getFullYear(), today.getMonth(), 1))
  );
  const [to, setTo] = useState(ymd(today));
  const [branchId, setBranchId] = useState('');
  const [branches, setBranches] = useState([]);
  const [currency, setCurrency] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPromoOptionsService()
      .then((res) => {
        const o = res?.data || res;
        setBranches(o?.branches || []);
        setCurrency(o?.currency || '');
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchRewardsGivenReportService({
        from,
        to,
        ...(branchId ? { branchIds: [branchId] } : {}),
      });
      setData(res?.data || res);
    } catch (e) {
      setError(e?.message || 'Could not load the report.');
    } finally {
      setLoading(false);
    }
  }, [from, to, branchId]);

  useEffect(() => {
    load();
  }, [load]);

  const t = data?.totals;
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex flex-row flex-wrap items-end gap-3">
        <h2 className="text-lg font-semibold mr-auto">Rewards given out</h2>
        <label className="text-sm flex flex-col">
          From
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
            className="border rounded-md px-2 py-1 bg-transparent"
          />
        </label>
        <label className="text-sm flex flex-col">
          To
          <input
            type="date"
            value={to}
            min={from}
            onChange={(e) => setTo(e.target.value)}
            className="border rounded-md px-2 py-1 bg-transparent"
          />
        </label>
        {branches.length > 1 && (
          <label className="text-sm flex flex-col">
            Branch
            <select
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              className="border rounded-md px-2 py-1 bg-transparent"
            >
              <option value="">All branches</option>
              {branches.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {error && <p className="text-error text-sm">{error}</p>}
      {loading && !data && <p className="text-sm">Loading...</p>}

      {t && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              ['Cash given', money(t.cash, currency)],
              ['Free products (retail value)', money(t.productValue, currency)],
              ['Total given out', money(t.totalValue, currency)],
              [
                'Rewards used',
                `${t.count}${t.flagged ? ` (${t.flagged} flagged)` : ''}`,
              ],
            ].map(([label, value]) => (
              <div key={label} className="border rounded-lg p-3">
                <p className="text-xs text-text-gray">{label}</p>
                <p className="text-xl font-semibold">{value}</p>
              </div>
            ))}
          </div>

          {data.byDay.length > 0 && (
            <div className="border rounded-lg p-3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.byDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="cash" name="Cash" stackId="a" fill="#16a34a" />
                  <Bar
                    dataKey="productValue"
                    name="Free products"
                    stackId="a"
                    fill="#f59e0b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Table
              title="By promo"
              head={['Promo', 'Used', 'Cash', 'Products']}
              // the server groups by promo AND reward type, so a promo with both a cash and a
              // product reward comes back as two rows: key and label them by type
              rows={data.byPromo.map((r) => ({
                key: `${r.promoId ?? 'deleted'}-${r.type ?? 'other'}`,
                cells: [
                  <span key="name">
                    {r.name}
                    {r.type && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-gray-100 text-text-gray">
                        {r.type === 'product' ? 'free product' : r.type}
                      </span>
                    )}
                  </span>,
                  r.count,
                  money(r.cash, currency),
                  money(r.productValue, currency),
                ],
              }))}
            />
            <Table
              title="Free products handed over"
              head={['Product', 'Qty', 'Value']}
              rows={data.byProduct.map((r) => ({
                key: r.productId,
                cells: [r.name, r.quantity, money(r.value, currency)],
              }))}
            />
            {data.byBranch.length > 1 && (
              <Table
                title="By branch"
                head={['Branch', 'Used', 'Cash', 'Products']}
                rows={data.byBranch.map((r) => ({
                  key: r.branchId,
                  cells: [
                    r.name,
                    r.count,
                    money(r.cash, currency),
                    money(r.productValue, currency),
                  ],
                }))}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default RewardsGivenReport;
