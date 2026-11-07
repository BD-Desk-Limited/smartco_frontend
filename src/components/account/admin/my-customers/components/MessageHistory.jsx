import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import Pagination from '@/components/account/Pagination';
import {
  fetchCampaignsService,
  fetchCampaignByIdService,
  fetchCampaignRecipientsService,
  cancelCampaignService,
  retryCampaignService,
} from '@/services/customerServices';
import { formatDate, ISOStringToLocalTime } from '@/utilities/formatTime';
import { capitalizeFirst } from '@/utilities/stringUtils';

const STATUS = {
  queued: { label: 'Queued', style: 'bg-yellow-500 text-text-white' },
  sending: { label: 'Sending', style: 'bg-blue-500 text-text-white' },
  completed: { label: 'Sent', style: 'bg-green-500 text-text-white' },
  completed_with_failures: {
    label: 'Finished with failures',
    style: 'bg-orange-500 text-text-white',
  },
  cancelled: { label: 'Cancelled', style: 'bg-gray-500 text-text-white' },
};
const ACTIVE = ['queued', 'sending'];
const SKIP_TEXT = {
  opted_out: 'Unsubscribed',
  no_contact: 'No contact detail',
  customer_unavailable: 'Customer no longer available',
};

const Badge = ({ status }) => (
  <span
    className={`px-2 py-1 rounded-md ${STATUS[status]?.style || 'bg-gray-500 text-text-white'}`}
  >
    {STATUS[status]?.label || capitalizeFirst(status)}
  </span>
);

const done = (c) =>
  c.counts.sent + c.counts.failed + c.counts.skipped + c.counts.cancelled;
const progress = (c) => `${c.counts.sent} of ${c.totals.queued} sent`;

/* ---------------- detail ---------------- */

const CampaignDetail = ({ campaignId, onClose, onChanged }) => {
  const [campaign, setCampaign] = useState(null);
  const [recipients, setRecipients] = useState(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [tick, setTick] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetch = async () => {
      let cancelled = false;
      Promise.all([
        fetchCampaignByIdService(campaignId),
        fetchCampaignRecipientsService(campaignId, {
          status: filter,
          page,
          limit: 15,
        }),
      ]).then(([c, r]) => {
        if (cancelled) return;
        if (c.error) setMessage({ type: 'error', text: String(c.error) });
        else setCampaign(c.data);
        if (r.data) setRecipients(r.data);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [campaignId, filter, page, tick]);

  // keep the numbers moving while it is still sending
  const active = campaign && ACTIVE.includes(campaign.status);
  useEffect(() => {
    if (!active) return undefined;
    const timer = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, [active]);

  useEffect(() => {
    if (campaign) onChanged?.();
  }, [campaign?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (fn) => {
    setBusy(true);
    setMessage({ type: '', text: '' });
    const res = await fn(campaignId);
    setBusy(false);
    if (res.error)
      return setMessage({ type: 'error', text: String(res.error) });
    setMessage({ type: 'ok', text: res.message });
    setTick((t) => t + 1);
  };

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-1/2 h-full bg-text-white flex flex-col p-4 text-sm text-text-gray gap-3 overflow-y-auto scrollbar-thin rounded-l-lg"
    >
      <div className="absolute top-0 right-0 z-50 p-1 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer m-1">
        <FaTimes className="text-text-white" onClick={onClose} />
      </div>

      {!campaign ? (
        <Spinner />
      ) : (
        <>
          <div className="pr-8 flex flex-col gap-1">
            <h3 className="text-lg font-semibold text-text-black">
              {campaign.subject ||
                `${capitalizeFirst(campaign.type)} ${campaign.channel}`}
            </h3>
            <p>
              <Badge status={campaign.status} />{' '}
              {capitalizeFirst(campaign.type)} ·{' '}
              {campaign.channel.toUpperCase()}
            </p>
            <p>
              Sent as <strong>{campaign.senderName}</strong>
              {campaign.createdBy?.fullName
                ? ` by ${campaign.createdBy.fullName}`
                : ''}{' '}
              on {ISOStringToLocalTime(campaign.createdAt)}
            </p>
            <p>
              Replies:{' '}
              {campaign.reply?.allowed
                ? [campaign.reply.email, campaign.reply.phone]
                    .filter(Boolean)
                    .join(' · ') || 'allowed'
                : 'not allowed'}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 text-center">
            {[
              ['Sent', campaign.counts.sent],
              ['Waiting', campaign.counts.queued + campaign.counts.sending],
              ['Failed', campaign.counts.failed],
              ['Skipped', campaign.counts.skipped],
              ['Cancelled', campaign.counts.cancelled],
            ].map(([label, value]) => (
              <div
                key={label}
                className="border border-gray-border rounded-md p-2"
              >
                <div className="text-lg font-semibold text-text-black">
                  {value}
                </div>
                <div className="text-xs">{label}</div>
              </div>
            ))}
          </div>
          {active && (
            <p className="italic">
              Sending in the background: {progress(campaign)}. You can leave
              this page.
            </p>
          )}
          {done(campaign) === campaign.totals.queued && (
            <p className="italic">
              All messages have been sent. You can leave this page.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {active && (
              <button
                onClick={() => act(cancelCampaignService)}
                disabled={busy}
                className="py-1 px-3 rounded-lg border border-error text-error disabled:opacity-50"
              >
                Stop sending
              </button>
            )}
            {campaign.status === 'completed_with_failures' && (
              <button
                onClick={() => act(retryCampaignService)}
                disabled={busy}
                className="py-1 px-3 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
              >
                Retry failed
              </button>
            )}
          </div>
          {message.text && (
            <p
              className={
                message.type === 'error' ? 'text-error' : 'text-green-600'
              }
            >
              {message.text}
            </p>
          )}

          <div>
            <h4 className="font-semibold text-text-black">Message</h4>
            <p className="whitespace-pre-wrap break-words border border-gray-border rounded-md p-2 bg-gray-shadow10">
              {campaign.body}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-text-black">Recipients</h4>
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="h-8 px-2 border border-gray-border rounded-md focus:outline-none"
              aria-label="Filter recipients by status"
            >
              <option value="">All</option>
              {[
                'sent',
                'queued',
                'sending',
                'failed',
                'skipped',
                'cancelled',
              ].map((s) => (
                <option key={s} value={s}>
                  {capitalizeFirst(s)}
                </option>
              ))}
            </select>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-shadow10">
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Detail</th>
              </tr>
            </thead>
            <tbody>
              {recipients?.recipients?.length ? (
                recipients.recipients.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-gray-border align-top"
                  >
                    <td className="px-2 py-2">
                      <span className="block text-text-black">
                        {r.customer?.name || 'Unknown'}
                      </span>
                      <span className="text-xs">
                        {r.customer?.customerNumber}
                      </span>
                    </td>
                    <td className="px-2 py-2">{capitalizeFirst(r.status)}</td>
                    <td className="px-2 py-2 text-xs">
                      {r.status === 'sent' && r.sentAt
                        ? ISOStringToLocalTime(r.sentAt)
                        : ''}
                      {r.status === 'skipped'
                        ? SKIP_TEXT[r.skipReason] || ''
                        : ''}
                      {['failed', 'queued'].includes(r.status) && r.error
                        ? r.error
                        : ''}
                      {r.attempts > 1 ? ` (attempt ${r.attempts})` : ''}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-2 py-6 text-center italic" colSpan={3}>
                    No recipients here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {recipients?.pagination && (
            <Pagination
              currentPage={page}
              totalPages={recipients.pagination.totalPages || 1}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

/* ---------------- list ---------------- */

const MessageHistory = ({ isAdmin, openCampaignId, onOpened, refreshKey }) => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    if (openCampaignId) {
      setSelectedId(openCampaignId);
      onOpened?.();
    }
  }, [openCampaignId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetch = async () => {
      let cancelled = false;
      setLoading(true);
      fetchCampaignsService({ status, page, limit: 15 }).then((res) => {
        if (cancelled) return;
        if (res.error) setError(String(res.error));
        else {
          setError('');
          setData(res.data);
        }
        setLoading(false);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [status, page, reload, refreshKey]);

  return (
    <div className="flex flex-col gap-3 text-sm text-text-gray">
      <div className="flex items-center justify-between">
        <p>
          {isAdmin
            ? 'Every message sent from your company.'
            : 'The messages you can view.'}
        </p>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="h-8 px-2 border border-gray-border rounded-md focus:outline-none"
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS).map(([value, s]) => (
            <option key={value} value={value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-error">{error}</p>}
      {loading ? (
        <Spinner />
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-shadow10">
              <th className="px-4 py-3 border border-gray-shadow8">Sent</th>
              <th className="px-4 py-3 border border-gray-shadow8">Message</th>
              <th className="px-4 py-3 border border-gray-shadow8">Sent as</th>
              {isAdmin && (
                <th className="px-4 py-3 border border-gray-shadow8">By</th>
              )}
              <th className="px-4 py-3 text-center border border-gray-shadow8">
                Delivered
              </th>
              <th className="px-4 py-3 text-center border border-gray-shadow8">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.campaigns?.length ? (
              data.campaigns.map((c) => (
                <tr
                  key={c._id}
                  onClick={() => setSelectedId(c._id)}
                  className="border-b border-gray-border cursor-pointer hover:bg-gray-shadow10"
                >
                  <td className="px-4 py-3">
                    {formatDate(new Date(c.createdAt))}
                  </td>
                  <td className="px-4 py-3">
                    <span className="block text-text-black">
                      {c.subject || capitalizeFirst(c.type)}
                    </span>
                    <span className="text-xs">
                      {capitalizeFirst(c.type)} · {c.channel.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">{c.senderName}</td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      {c.createdBy?.fullName || '-'}
                    </td>
                  )}
                  <td className="px-4 py-3 text-center">
                    {c.counts.sent}/{c.totals.queued}
                    {c.counts.failed > 0 && (
                      <span className="text-error">
                        {' '}
                        · {c.counts.failed} failed
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge status={c.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center h-[30vh]">
                <td className="font-semibold" colSpan={isAdmin ? 6 : 5}>
                  No messages sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {data?.pagination && (
        <Pagination
          currentPage={page}
          totalPages={data.pagination.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {selectedId && (
        <div
          className="inset-0 fixed bg-black bg-opacity-50 z-50 flex justify-end items-center"
          onClick={() => setSelectedId(null)}
        >
          <CampaignDetail
            key={selectedId}
            campaignId={selectedId}
            onClose={() => setSelectedId(null)}
            onChanged={() => setReload((r) => r + 1)}
          />
        </div>
      )}
    </div>
  );
};

export default MessageHistory;
