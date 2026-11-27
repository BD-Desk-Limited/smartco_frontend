// Formatting shared by the report tabs.

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// Date -> 'YYYY-MM-DD' in the user's local calendar (what the API expects)
export const ymd = (date) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const parseYmd = (text) => {
  const [y, m, d] = String(text).split('-').map(Number);
  return { y, m, d };
};

// '2025-06-22', '2025-06-30' -> '22 Jun - 30 Jun 2025'
export const rangeLabel = (from, to) => {
  const a = parseYmd(from);
  const b = parseYmd(to);
  const day = ({ d, m }) => `${d} ${MONTHS[m - 1]}`;
  if (from === to) return `${day(a)} ${a.y}`;
  return a.y === b.y
    ? `${day(a)} - ${day(b)} ${b.y}`
    : `${day(a)} ${a.y} - ${day(b)} ${b.y}`;
};

// Chart axis label for a bucket key: '2025-06-22' -> '22 Jun', '2025-06' -> 'Jun 25', '2025' -> '2025'
export const bucketLabel = (key) => {
  const { y, m, d } = parseYmd(key);
  if (key.length === 10) return `${d} ${MONTHS[m - 1]}`;
  if (key.length === 7) return `${MONTHS[m - 1]} ${String(y).slice(2)}`;
  return key;
};

// 2450 -> '₦2,450' (or '₦2,450.50'); compact: 1250000 -> '₦1.25M'
export const formatMoney = (value, currency, { compact = false } = {}) => {
  const symbol = currency?.symbol || '';
  const n = Number(value || 0);
  const text = compact
    ? new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 2,
      }).format(n)
    : n.toLocaleString('en', {
        // whole amounts without decimals, otherwise always 2 (2,450.50 not 2,450.5)
        minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
        maximumFractionDigits: 2,
      });
  return `${symbol}${text}`;
};

export const formatCount = (value, { compact = false } = {}) =>
  compact
    ? new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(Number(value || 0))
    : Number(value || 0).toLocaleString('en');

// 25 -> '+25%', -3.5 -> '-3.5%', null -> null (nothing to compare with)
export const formatChange = (value) =>
  value === null || value === undefined
    ? null
    : `${value > 0 ? '+' : ''}${Number(value).toLocaleString('en', { maximumFractionDigits: 1 })}%`;
