import { formatMoney } from '@/components/account/admin/reports/reportFormat';
import {
  METHODS,
  OFFERED_METHODS,
  methodLabel,
} from '@/utilities/paymentMethods';

export const STATUS = {
  not_started: { label: 'Not started', className: 'bg-gray-100 text-gray-700' },
  draft: { label: 'Draft', className: 'bg-blue-100 text-blue-800' },
  submitted: {
    label: 'Pending approval',
    className: 'bg-amber-100 text-amber-800',
  },
  changes_requested: {
    label: 'Changes requested',
    className: 'bg-red-100 text-red-700',
  },
  approved: { label: 'Approved', className: 'bg-green-100 text-green-800' },
};

export const StatusChip = ({ status }) => {
  const s = STATUS[status] || STATUS.not_started;
  return (
    <span
      className={`inline-block whitespace-nowrap rounded px-2 py-0.5 text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  );
};

export const DOCUMENT_KINDS = [
  { value: 'proof_of_payment', label: 'Proof of payment' },
  { value: 'supporting_document', label: 'Supporting document' },
];

export const ACCEPTED_FILES =
  '.pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,.csv,.xls,.xlsx,.doc,.docx';
export const MAX_FILE_MB = 10;

export const makeMoney = (currency) => (v) => formatMoney(v, currency);

export const r2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export { methodLabel };

// methods to show: every method still taken, plus any other with money on the day
export const visibleMethods = (lines) =>
  METHODS.filter(
    (m) =>
      OFFERED_METHODS.includes(m) ||
      lines.some(
        (l) =>
          l.method === m.value &&
          (l.expected || l.deductions || l.banked || l.takenIn)
      )
  ).map((m) => m.value);

/*
  The same sums the server does (utilities/cashDeclarations.js computeLines), on the figures being typed,
  so the variance updates while the manager types. The server's figures are the ones that count.
*/
export const previewLines = (serverLines, form) =>
  serverLines.map((l) => {
    const deductions = r2(
      form.deductions
        .filter((d) => d.method === l.method)
        .reduce((s, d) => s + (Number(d.amount) || 0), 0)
    );
    const typed = form.banked[l.method]?.amount;
    const banked =
      typed === '' || typed === undefined ? null : r2(Number(typed));
    const toBank = r2(l.expected - deductions);
    return {
      ...l,
      deductions,
      toBank,
      banked,
      variance: banked === null ? null : r2(banked - toBank),
    };
  });

export const totalsOf = (lines) => {
  const sum = (k) => r2(lines.reduce((s, l) => s + (Number(l[k]) || 0), 0));
  const t = {
    takenIn: sum('takenIn'),
    refunds: sum('refunds'),
    expected: sum('expected'),
    deductions: sum('deductions'),
    toBank: sum('toBank'),
    banked: sum('banked'),
  };
  t.variance = r2(t.banked - t.toBank);
  return t;
};

// the editable form from a declaration the server sent
export const formFrom = (d) => ({
  deductions: (d?.deductions || []).map((x) => ({
    _id: x._id,
    method: x.method,
    label: x.label,
    amount: String(x.amount),
    note: x.note || '',
  })),
  banked: Object.fromEntries(
    (d?.lines || [])
      .filter((l) => l.banked !== null)
      .map((l) => [
        l.method,
        { amount: String(l.banked), reference: l.reference || '' },
      ])
  ),
  note: d?.note || '',
});

// the form as the server expects it
export const formBody = (form, revision) => ({
  revision,
  note: form.note,
  deductions: form.deductions.map((d) => ({
    ...(d._id ? { _id: d._id } : {}),
    method: d.method,
    label: d.label,
    amount: Number(d.amount) || 0,
    note: d.note,
  })),
  banked: Object.entries(form.banked)
    .filter(([, v]) => v && v.amount !== '' && v.amount !== undefined)
    .map(([method, v]) => ({
      method,
      amount: Number(v.amount) || 0,
      reference: v.reference || '',
    })),
});

// 'YYYY-MM-DD' on this device's calendar
export const ymd = (date = new Date()) => {
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const showDay = (day) =>
  new Date(`${day}T00:00`).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const showTime = (date) =>
  new Date(date).toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export const fileTooBig = (file) =>
  file && file.size > MAX_FILE_MB * 1024 * 1024;
