import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaGift, FaTimes, FaTrash } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import Pagination from '@/components/account/Pagination';
import {
  fetchPromoByIdService,
  changePromoStatusService,
  deletePromoService,
  previewPromoQualifiersService,
  awardPromoService,
  fetchPromoRewardsService,
  revokeRewardService,
} from '@/services/customerServices';
import { formatDate, ISOStringToLocalTime } from '@/utilities/formatTime';
import { capitalizeFirst } from '@/utilities/stringUtils';
import { commaNumberFormat } from '@/utilities/numbersUtils';

export const PHASE = {
  draft: { label: 'Draft', style: 'bg-gray-500 text-text-white' },
  scheduled: { label: 'Scheduled', style: 'bg-yellow-500 text-text-white' },
  running: { label: 'Running', style: 'bg-green-500 text-text-white' },
  paused: { label: 'Paused', style: 'bg-orange-500 text-text-white' },
  finished: { label: 'Finished', style: 'bg-gray-500 text-text-white' },
  ended: { label: 'Ended', style: 'bg-gray-500 text-text-white' },
};

const REWARD_STATUS = {
  available: 'bg-green-500 text-text-white',
  redeemed: 'bg-blue-500 text-text-white',
  expired: 'bg-gray-500 text-text-white',
  revoked: 'bg-error text-text-white',
};

const names = (ids, list) =>
  (ids || [])
    .map(
      (id) => list.find((x) => String(x._id) === String(id))?.name || 'Unknown'
    )
    .join(', ');

// the rules, in plain words
const describeRules = (promo, currency) => {
  const c = promo.criteria;
  const l = promo.lookups;
  const lines = [];
  if (c.visitCount?.enabled)
    lines.push(
      `Every ${c.visitCount.count} visit${c.visitCount.count === 1 ? '' : 's'} (repeats)`
    );
  if (c.totalSpent?.enabled)
    lines.push(
      `Spends at least ${currency}${commaNumberFormat(c.totalSpent.amount, 2)}`
    );
  if (c.branchesVisited?.enabled)
    lines.push(
      `Visits at least ${c.branchesVisited.count} of: ${names(c.branchesVisited.branches, l.branches)}`
    );
  if (c.products?.enabled)
    lines.push(
      `Buys at least ${c.products.count} unit(s) of: ${names(c.products.products, l.products)}`
    );
  if (c.customerGroups?.enabled)
    lines.push(`Is in group: ${names(c.customerGroups.groups, l.groups)}`);
  return lines;
};

const PromoDetailSideView = ({
  promoId,
  currency,
  onClose,
  onEdit,
  onChanged,
  onDeleted,
}) => {
  const [promo, setPromo] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(''); // 'end' | 'delete' | 'award' | ''

  // who qualifies
  const [preview, setPreview] = useState(null);
  const [saveGroup, setSaveGroup] = useState(false);
  const [groupName, setGroupName] = useState('');

  // rewards list
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rewards, setRewards] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await fetchPromoByIdService(promoId);
      if (res.error) setError(String(res.error));
      else {
        setError('');
        setPromo(res.data);
      }
    };
    load();
  }, [promoId, reload]);

  useEffect(() => {
    const fetch = () => {
      let cancelled = false;
      fetchPromoRewardsService(promoId, {
        status,
        searchTerm: appliedSearch,
        page,
        limit: 12,
      }).then((res) => {
        if (!cancelled && res.data) setRewards(res.data);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [promoId, status, appliedSearch, page, reload]);

  const refresh = () => {
    setReload((r) => r + 1);
    onChanged?.();
  };

  const run = async (fn, done) => {
    setBusy(true);
    setMessage({ type: '', text: '' });
    const res = await fn();
    setBusy(false);
    setConfirm('');
    if (res.error)
      return setMessage({ type: 'error', text: String(res.error) });
    done?.(res);
    return res;
  };

  const act = (action) =>
    run(
      () => changePromoStatusService(promoId, action),
      (res) => {
        setMessage({ type: 'ok', text: res.message });
        setPreview(null);
        refresh();
      }
    );

  const remove = () =>
    run(
      () => deletePromoService(promoId),
      () => onDeleted?.()
    );

  const check = () =>
    run(
      () => previewPromoQualifiersService(promoId),
      (res) => setPreview(res.data)
    );

  const award = () =>
    run(
      () =>
        awardPromoService(
          promoId,
          saveGroup ? { saveAsGroup: { name: groupName } } : {}
        ),
      (res) => {
        const d = res.data;
        const parts = [res.message];
        if (d.cappedByTotalLimit)
          parts.push(
            'The total limit was reached, so some customers did not get theirs.'
          );
        if (d.group)
          parts.push(
            `Customer group "${d.group.name}" created with ${d.group.members} customers.`
          );
        if (d.groupError) parts.push(d.groupError);
        setMessage({
          type: d.groupError ? 'error' : 'ok',
          text: parts.join(' '),
        });
        setPreview(null);
        setSaveGroup(false);
        setGroupName('');
        refresh();
      }
    );

  const revoke = (id) =>
    run(
      () => revokeRewardService(id),
      (res) => {
        setMessage({ type: 'ok', text: res.message });
        refresh();
      }
    );

  const phase = promo ? PHASE[promo.phase] : null;
  const rules = promo ? describeRules(promo, currency) : [];
  const canManage = promo?.canManage;

  return (
    <motion.div
      onClick={(e) => e.stopPropagation()}
      initial={{ x: '50%', y: '0%' }}
      animate={{ x: 0, y: 0 }}
      transition={{ duration: 0.75 }}
      className="relative w-1/2 h-full bg-text-white flex flex-col p-4 text-sm text-text-gray gap-3 overflow-y-auto scrollbar-thin rounded-l-xl"
    >
      <div className="absolute top-0 right-0 z-50 p-1 rounded-full text-brand-gray text-lg bg-brand-gray hover:bg-error cursor-pointer m-1">
        <FaTimes className="text-text-white" onClick={onClose} />
      </div>

      {error && <p className="text-error">{error}</p>}
      {!promo && !error && <Spinner />}

      {promo && (
        <>
          <div className="pr-8">
            <h3 className="text-lg font-semibold text-text-black flex flex-row gap-1 mb-2">
              <span>
                <FaGift />
              </span>
              <span>{promo.name}</span>
            </h3>
            <span className={`px-2 py-1 rounded-md ${phase.style}`}>
              {phase.label}
            </span>
            <p className="my-2">
              <strong className="text-text-black">
                {promo.offer.description}
              </strong>
            </p>
            {promo.description && (
              <p className="whitespace-pre-wrap break-words">
                {promo.description}
              </p>
            )}
            <p>
              {formatDate(new Date(promo.startsAt))} to{' '}
              {formatDate(new Date(promo.endsAt))} · each reward lasts{' '}
              {promo.validityDays} days
            </p>
            <p>
              Branches:{' '}
              {promo.isGlobal
                ? 'all branches'
                : names(
                    promo.branches.map((b) => b._id ?? b),
                    promo.lookups.branches
                  )}
            </p>
            <p>
              Limits: {promo.limits.maxPerCustomer} per customer
              {promo.limits.maxTotal
                ? `, ${promo.limits.maxTotal} in total`
                : ', no total limit'}
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-text-black">
              Rules (
              {promo.criteria.mode === 'any'
                ? 'any one is enough'
                : 'all must be met'}
              )
            </h4>
            {rules.length ? (
              <ul className="list-disc pl-5">
                {rules.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            ) : (
              <p className="italic">
                No rules yet. Turn at least one on before activating.
              </p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              ['Given', promo.awardedCount],
              ['Available', rewards?.counts?.available || 0],
              ['Used', rewards?.counts?.redeemed || 0],
              ['Expired', rewards?.counts?.expired || 0],
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

          {canManage ? (
            <div className="flex flex-wrap gap-2 items-center">
              {promo.status !== 'ended' && (
                <button
                  onClick={onEdit}
                  className="py-1 px-3 rounded-lg border border-gray-border flex flex-row gap-1"
                >
                  <span>
                    <FaEdit />
                  </span>
                  <span>Edit</span>
                </button>
              )}
              {['draft', 'paused'].includes(promo.status) && (
                <button
                  onClick={() => act('activate')}
                  disabled={busy}
                  className="py-1 px-3 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
                >
                  {promo.status === 'draft' ? 'Activate' : 'Resume'}
                </button>
              )}
              {promo.status === 'active' && (
                <button
                  onClick={() => act('pause')}
                  disabled={busy}
                  className="py-1 px-3 rounded-lg border border-gray-border disabled:opacity-50"
                >
                  Pause
                </button>
              )}
              {['active', 'paused'].includes(promo.status) &&
                (confirm === 'end' ? (
                  <span className="flex items-center gap-2">
                    End this promo? No more rewards will be earned.
                    <button
                      onClick={() => act('end')}
                      disabled={busy}
                      className="py-1 px-3 rounded-lg bg-error text-text-white"
                    >
                      Yes, end
                    </button>
                    <button
                      onClick={() => setConfirm('')}
                      className="py-1 px-3 rounded-lg border border-gray-border"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirm('end')}
                    className="py-1 px-3 rounded-lg border border-error text-error"
                  >
                    End promo
                  </button>
                ))}
              {promo.status === 'draft' &&
                (confirm === 'delete' ? (
                  <span className="flex items-center gap-2">
                    Delete this draft?
                    <button
                      onClick={remove}
                      disabled={busy}
                      className="py-1 px-3  rounded-lg bg-error text-text-white"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirm('')}
                      className="py-1 px-3 rounded-lg border border-gray-border"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirm('delete')}
                    className="py-1 px-3 rounded-lg border border-error text-error flex flex-row gap-1 hover:bg-red-200"
                  >
                    <FaTrash />
                    Delete draft
                  </button>
                ))}
            </div>
          ) : (
            <p className="italic">
              You can view this promo but only admins can change it.
            </p>
          )}

          {message.text && (
            <p
              className={
                message.type === 'error' ? 'text-error' : 'text-green-600'
              }
            >
              {message.text}
            </p>
          )}

          {canManage &&
            promo.status !== 'ended' &&
            promo.rulesEnabled.length > 0 && (
              <div className="border border-gray-border rounded-md p-3 flex flex-col gap-2">
                <h4 className="font-semibold text-text-black">
                  Who has qualified
                </h4>
                <p className="text-xs">
                  Rewards are given automatically when a customer&apos;s next
                  sale is recorded. Use this to give them to everyone who has
                  already qualified, without waiting for their next visit.
                </p>
                <button
                  onClick={check}
                  disabled={busy}
                  className="w-fit py-1 px-3 rounded-lg border border-brand-blue text-brand-blue disabled:opacity-50"
                >
                  Check who qualifies
                </button>

                {preview && (
                  <div className="border border-gray-border rounded-md p-2">
                    <p className="text-text-black">
                      <strong>{preview.qualifyingCustomers}</strong> customer(s)
                      qualify. {preview.rewardsAlreadyGiven} reward(s) already
                      given, <strong>{preview.rewardsToCreate}</strong> to give
                      now.
                    </p>
                    {preview.cappedByTotalLimit && (
                      <p className="text-error">
                        The total limit means not everyone will get one.
                      </p>
                    )}
                    {preview.sample.length > 0 && (
                      <p className="text-xs">
                        e.g.{' '}
                        {preview.sample
                          .map(
                            (s) =>
                              `${s.name}${s.rewards > 1 ? ` (${s.rewards})` : ''}`
                          )
                          .join(', ')}
                      </p>
                    )}
                    {!preview.canAwardNow && (
                      <p className="text-xs">
                        Rewards can only be given while the promo is active and
                        within its dates.
                      </p>
                    )}
                    {preview.canAwardNow && preview.rewardsToCreate > 0 && (
                      <div className="mt-2 flex flex-col gap-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveGroup}
                            onChange={(e) => setSaveGroup(e.target.checked)}
                          />
                          Also save everyone who holds this reward as a customer
                          group (so you can message them)
                        </label>
                        {saveGroup && (
                          <input
                            type="text"
                            placeholder="Group name"
                            value={groupName}
                            maxLength={80}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="h-8 px-2 border border-gray-border rounded-md text-sm focus:outline-none"
                          />
                        )}
                        {confirm === 'award' ? (
                          <span className="flex items-center gap-2">
                            Give {preview.rewardsToCreate} reward(s) now?
                            <button
                              onClick={award}
                              disabled={busy}
                              className="py-1 px-3 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
                            >
                              {busy ? 'Working...' : 'Yes, give them'}
                            </button>
                            <button
                              onClick={() => setConfirm('')}
                              className="py-1 px-3 rounded-lg border border-gray-border"
                            >
                              Back
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={() => setConfirm('award')}
                            className="w-fit py-1 px-3 rounded-lg bg-brand-blue text-text-white"
                          >
                            Give rewards
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-text-black">Rewards given</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search customer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setAppliedSearch(search);
                    setPage(1);
                  }
                }}
                className="h-8 px-2 border border-gray-border rounded-md focus:outline-none"
              />
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="h-8 px-2 border border-gray-border rounded-md focus:outline-none"
                aria-label="Filter by status"
              >
                <option value="">All</option>
                {['available', 'redeemed', 'expired', 'revoked'].map((s) => (
                  <option key={s} value={s}>
                    {capitalizeFirst(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-shadow10">
                <th className="px-2 py-2">Customer</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Earned</th>
                <th className="px-2 py-2">Expires</th>
                {canManage && <th className="px-2 py-2"></th>}
              </tr>
            </thead>
            <tbody>
              {rewards?.rewards?.length ? (
                rewards.rewards.map((r) => (
                  <tr key={r._id} className="border-b border-gray-border">
                    <td className="px-2 py-2">
                      <span className="block text-text-black">
                        {r.customer?.name || 'Unknown'}
                        {r.cycle > 1 ? ` (#${r.cycle})` : ''}
                      </span>
                      <span className="text-xs">
                        {r.customer?.customerNumber}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`px-2 py-1 rounded-md ${REWARD_STATUS[r.status]}`}
                      >
                        {capitalizeFirst(r.status)}
                      </span>
                    </td>
                    <td className="px-2 py-2">
                      {formatDate(new Date(r.earnedAt))}
                    </td>
                    <td className="px-2 py-2">
                      {formatDate(new Date(r.expiresAt))}
                    </td>
                    {canManage && (
                      <td className="px-2 py-2">
                        {r.status === 'available' && (
                          <button
                            onClick={() => revoke(r._id)}
                            disabled={busy}
                            className="text-error underline disabled:opacity-50"
                          >
                            Revoke
                          </button>
                        )}
                        {r.status === 'redeemed' && r.redeemedAt ? (
                          <span className="text-xs">
                            {ISOStringToLocalTime(r.redeemedAt)}
                          </span>
                        ) : null}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-2 py-6 text-center italic"
                    colSpan={canManage ? 5 : 4}
                  >
                    No rewards given yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {rewards?.pagination && (
            <Pagination
              currentPage={page}
              totalPages={rewards.pagination.totalPages || 1}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default PromoDetailSideView;
