import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import { fetchGroupsService } from '@/services/customerServices';
import { fetchCustomersService } from '@/services/customerServices';
import {
  previewRecipientsService,
  sendMessageService,
} from '@/services/customerServices';

const TYPE_LABELS = {
  promo: 'Promotion',
  reminder: 'Reminder',
  appreciation: 'Appreciation',
  winback: 'Win-back',
  general: 'General',
};

const defaultSenderLabel = (companyName, branchNames) => {
  const names = branchNames.filter(Boolean);
  if (names.length === 0) return companyName;
  if (names.length === 1) return `${companyName}, ${names[0]}`;
  if (names.length === 2) return `${companyName}, ${names[0]} & ${names[1]}`;
  return `${companyName}, ${names[0]} & ${names.length - 1} more branches`;
};

const Section = ({ title, children }) => (
  <section className="border border-gray-border rounded-md p-3 flex flex-col gap-2">
    <h3 className="font-semibold text-text-black">{title}</h3>
    {children}
  </section>
);

const field =
  'w-full px-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring focus:border-brand-blue';

const MessageComposer = ({ options, onSent }) => {
  const {
    branches,
    settings,
    companyContact,
    templates,
    channels,
    limits,
    permissions,
  } = options;
  const isAdmin = permissions.isAdmin;

  const [channel, setChannel] = useState('email');
  const [type, setType] = useState('general');
  const [templateId, setTemplateId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const bodyRef = useRef(null);

  // recipients
  const [groups, setGroups] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]); // { _id, name, customerNumber }
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerApplied, setPickerApplied] = useState('');
  const [pickerPage, setPickerPage] = useState(1);
  const [picker, setPicker] = useState(null);
  const [pickerLoading, setPickerLoading] = useState(false);

  // sender and replies
  const [sendingBranches, setSendingBranches] = useState(
    branches.length === 1 ? [branches[0]._id] : []
  );
  const [senderName, setSenderName] = useState('');
  const [allowReplies, setAllowReplies] = useState(settings.allowReplies);
  const [replyEmail, setReplyEmail] = useState('');
  const [replyPhone, setReplyPhone] = useState('');
  const [replyTouched, setReplyTouched] = useState(false);
  const [saveAsDefault, setSaveAsDefault] = useState(false);

  // review and send
  const [preview, setPreview] = useState(null);
  const [previewing, setPreviewing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchGroupsService().then((res) => {
      if (!cancelled) setGroups(res.data?.groups || []);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // individual customers to pick from
  useEffect(() => {
    const fetch = async () => {
      if (!pickerApplied) {
        setPicker(null);
        return;
      }
      let cancelled = false;
      setPickerLoading(true);
      fetchCustomersService({
        searchTerm: pickerApplied,
        sortBy: 'name',
        page: pickerPage,
        limit: 8,
      }).then((res) => {
        if (cancelled) return;
        setPicker(res.data || null);
        setPickerLoading(false);
      });
      return () => {
        cancelled = true;
      };
    };
    fetch();
  }, [pickerApplied, pickerPage]);

  // reply details: your saved defaults, else the single branch's contact, else the company's.
  // Stops following these once you type in the fields yourself.
  useEffect(() => {
    const setStates = () => {
      if (replyTouched) return;
      const chosen = branches.filter((b) => sendingBranches.includes(b._id));
      const branch = chosen.length === 1 ? chosen[0] : null;
      setReplyEmail(
        settings.replyEmail || branch?.email || companyContact.email || ''
      );
      setReplyPhone(
        settings.replyPhone || branch?.phone || companyContact.phone || ''
      );
    };
    setStates();
  }, [sendingBranches, replyTouched]); // eslint-disable-line react-hooks/exhaustive-deps

  // any change to who receives it means the recipient check must be run again
  useEffect(() => {
    const setStates = () => {
      setPreview(null);
      setConfirming(false);
    };
    setStates();
  }, [channel, selectedGroups, selectedCustomers]);

  const toggleGroup = (id) =>
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleCustomer = (c) =>
    setSelectedCustomers((prev) =>
      prev.some((x) => x._id === c._id)
        ? prev.filter((x) => x._id !== c._id)
        : [
            ...prev,
            { _id: c._id, name: c.name, customerNumber: c.customerNumber },
          ]
    );

  const chooseTemplate = (id) => {
    setTemplateId(id);
    const t = templates.find((x) => x._id === id);
    if (t) {
      setType(t.type);
      setSubject(t.subject || '');
      setBody(t.body);
    }
  };

  const insertPlaceholder = (key) => {
    const el = bodyRef.current;
    const text = `{{${key}}}`;
    if (!el) return setBody((b) => b + text);
    const start = el.selectionStart ?? body.length;
    const end = el.selectionEnd ?? body.length;
    setBody(body.slice(0, start) + text + body.slice(end));
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const effectiveBranchNames = (
    sendingBranches.length || isAdmin
      ? branches.filter((b) => sendingBranches.includes(b._id))
      : branches
  ).map((b) => b.name);
  const senderLabel =
    senderName.trim() ||
    defaultSenderLabel(options.companyName, effectiveBranchNames);

  const selection = {
    channel,
    groups: selectedGroups,
    customers: selectedCustomers.map((c) => c._id),
  };

  const checkRecipients = async () => {
    setError('');
    setPreviewing(true);
    const res = await previewRecipientsService(selection);
    setPreviewing(false);
    if (res.error) return setError(String(res.error));
    setPreview(res.data);
  };

  const send = async () => {
    setError('');
    setSending(true);
    const res = await sendMessageService({
      ...selection,
      type,
      templateId: templateId || undefined,
      subject,
      body,
      sendingBranches,
      senderName,
      allowReplies,
      replyEmail,
      replyPhone,
      saveAsDefault,
    });
    setSending(false);
    setConfirming(false);
    if (res.error) return setError(String(res.error));
    onSent?.(res.data, res.message);
  };

  const canSend =
    preview &&
    preview.willSend > 0 &&
    !preview.overLimit &&
    body.trim() &&
    (channel === 'sms' || subject.trim());

  return (
    <div className="flex flex-col gap-4 text-sm text-text-gray">
      {/* ---------- recipients ---------- */}
      <Section title="1. Who should receive it?">
        <div>
          <p className="mb-1">Groups</p>
          {groups === null ? (
            <Spinner />
          ) : groups.length === 0 ? (
            <p className="italic">
              There are no customer groups you can use yet.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-1 max-h-40 overflow-y-auto border border-gray-border rounded-md p-2">
              {groups.map((g) => (
                <label
                  key={g._id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedGroups.includes(g._id)}
                    onChange={() => toggleGroup(g._id)}
                  />
                  <span>
                    {g.name} <span className="text-xs">({g.memberCount})</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="mb-1">Individual customers</p>
          <div className="h-8 px-2 border border-gray-border rounded-md flex items-center">
            <FaSearch aria-hidden="true" />
            <input
              type="text"
              placeholder="Search by name or customer number, then press Enter"
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setPickerApplied(pickerSearch.trim());
                  setPickerPage(1);
                }
              }}
              className="focus:outline-none ml-2 w-full"
            />
          </div>
          {pickerLoading && <Spinner />}
          {picker?.customers?.length > 0 && (
            <ul className="border border-gray-border rounded-md mt-1 max-h-44 overflow-y-auto">
              {picker.customers.map((c) => (
                <li
                  key={c._id}
                  className="border-b border-gray-border last:border-b-0"
                >
                  <label className="flex items-center gap-2 p-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.some((x) => x._id === c._id)}
                      onChange={() => toggleCustomer(c)}
                    />
                    <span className="text-text-black">{c.name}</span>
                    <span className="text-xs">{c.customerNumber}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {picker && picker.customers?.length === 0 && (
            <p className="italic mt-1">No customers found.</p>
          )}
          {picker?.pagination?.totalPages > 1 && (
            <div className="flex gap-2 mt-1">
              <button
                disabled={pickerPage <= 1}
                onClick={() => setPickerPage((p) => p - 1)}
                className="px-2 border border-gray-border rounded-md disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={pickerPage >= picker.pagination.totalPages}
                onClick={() => setPickerPage((p) => p + 1)}
                className="px-2 border border-gray-border rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
          {selectedCustomers.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedCustomers.map((c) => (
                <span
                  key={c._id}
                  className="flex items-center gap-1 px-2 py-1 rounded-md bg-blue-shadow10"
                >
                  {c.name}
                  <FaTimes
                    className="cursor-pointer"
                    aria-label={`Remove ${c.name}`}
                    onClick={() => toggleCustomer(c)}
                  />
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="text-xs">
          You can only reach customers from your own branches. Customers who
          unsubscribed, or have no
          {channel === 'email' ? ' email address' : ' phone number'} on file,
          are skipped automatically.
        </p>
      </Section>

      {/* ---------- message ---------- */}
      <Section title="2. What do you want to say?">
        <div className="grid grid-cols-3 gap-3">
          <label className="flex flex-col gap-1">
            Channel
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className={`${field} h-8`}
            >
              <option value="email">Email</option>
              <option value="sms" disabled={!channels.sms}>
                {channels.sms ? 'SMS' : 'SMS (not set up yet)'}
              </option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Start from a template
            <select
              value={templateId}
              onChange={(e) => chooseTemplate(e.target.value)}
              className={`${field} h-8`}
            >
              <option value="">Write my own</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            Kind of message
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`${field} h-8`}
            >
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {channel === 'email' && (
          <label className="flex flex-col gap-1">
            Subject
            <input
              type="text"
              value={subject}
              maxLength={150}
              onChange={(e) => setSubject(e.target.value)}
              className={`${field} h-8`}
            />
          </label>
        )}
        <label className="flex flex-col gap-1">
          Message
          <textarea
            ref={bodyRef}
            value={body}
            rows={8}
            maxLength={5000}
            onChange={(e) => setBody(e.target.value)}
            className={`${field} p-2`}
          />
        </label>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span>Insert:</span>
          {Object.entries(options.placeholders).map(([key, hint]) => (
            <button
              key={key}
              type="button"
              title={hint}
              onClick={() => insertPlaceholder(key)}
              className="px-2 py-1 border border-gray-border rounded-md hover:bg-gray-shadow10"
            >
              {`{{${key}}}`}
            </button>
          ))}
          <span>
            Each customer sees their own details. Line breaks are kept as you
            type them.
          </span>
        </div>
      </Section>

      {/* ---------- sender and replies ---------- */}
      <Section title="3. Who is it from, and can they reply?">
        {branches.length > 0 && (
          <div>
            <p className="mb-1">Sent from {isAdmin ? '(optional)' : ''}</p>
            <div className="flex flex-wrap gap-3">
              {branches.map((b) => (
                <label
                  key={b._id}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={sendingBranches.includes(b._id)}
                    onChange={() =>
                      setSendingBranches((prev) =>
                        prev.includes(b._id)
                          ? prev.filter((x) => x !== b._id)
                          : [...prev, b._id]
                      )
                    }
                  />
                  {b.name}
                </label>
              ))}
            </div>
          </div>
        )}
        <label className="flex flex-col gap-1">
          Send as (leave blank to use the default)
          <input
            type="text"
            value={senderName}
            maxLength={80}
            placeholder={senderLabel}
            onChange={(e) => setSenderName(e.target.value)}
            className={`${field} h-8`}
          />
        </label>
        <p className="text-xs">
          Customers will see this message from: <strong>{senderLabel}</strong>
        </p>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allowReplies}
            onChange={(e) => setAllowReplies(e.target.checked)}
          />
          Allow customers to reply
        </label>
        {allowReplies && (
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1">
              Reply email
              <input
                type="email"
                value={replyEmail}
                onChange={(e) => {
                  setReplyTouched(true);
                  setReplyEmail(e.target.value);
                }}
                className={`${field} h-8`}
              />
            </label>
            <label className="flex flex-col gap-1">
              Reply phone (shown in the message)
              <input
                type="text"
                value={replyPhone}
                onChange={(e) => {
                  setReplyTouched(true);
                  setReplyPhone(e.target.value);
                }}
                className={`${field} h-8`}
              />
            </label>
          </div>
        )}
        {!allowReplies && (
          <p className="text-xs">
            The message will say it is automated and not to reply.
          </p>
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={saveAsDefault}
            onChange={(e) => setSaveAsDefault(e.target.checked)}
          />
          Remember these reply settings as my default
        </label>
      </Section>

      {/* ---------- review and send ---------- */}
      <Section title="4. Check and send">
        <div className="flex items-center gap-3">
          <button
            onClick={checkRecipients}
            disabled={
              previewing ||
              (selectedGroups.length === 0 && selectedCustomers.length === 0)
            }
            className="px-3 py-1 rounded-lg border border-brand-blue text-brand-blue disabled:opacity-40"
          >
            {previewing ? 'Checking...' : 'Check recipients'}
          </button>
          {!preview && (
            <span className="text-xs">
              Run this after choosing who to send to.
            </span>
          )}
        </div>

        {preview && (
          <div className="border border-gray-border rounded-md p-2">
            <p className="text-text-black">
              <strong>{preview.willSend}</strong>{' '}
              {preview.willSend === 1 ? 'customer' : 'customers'} will receive
              this message
              {preview.sample.length
                ? ` (${preview.sample.join(', ')}${preview.willSend > preview.sample.length ? ', ...' : ''})`
                : ''}
              .
            </p>
            {(preview.skipped.optedOut > 0 ||
              preview.skipped.noContact > 0 ||
              preview.skipped.notAccessible > 0) && (
              <p>
                Skipped: {preview.skipped.optedOut} unsubscribed,{' '}
                {preview.skipped.noContact} with no{' '}
                {channel === 'email' ? 'email' : 'phone'} on file,{' '}
                {preview.skipped.notAccessible} you cannot access.
              </p>
            )}
            {preview.overLimit && (
              <p className="text-error">
                That is more than the {limits.maxRecipients} customers allowed
                in one send. Choose fewer groups or customers.
              </p>
            )}
          </div>
        )}

        {error && <p className="text-error">{error}</p>}

        {confirming ? (
          <div className="flex items-center gap-2 border border-gray-border rounded-md p-2">
            <span>
              Send to {preview?.willSend}{' '}
              {preview?.willSend === 1 ? 'customer' : 'customers'} as{' '}
              <strong>{senderLabel}</strong>? This cannot be undone once sent.
            </span>
            <button
              onClick={send}
              disabled={sending}
              className="px-3 py-1 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Yes, send'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              disabled={sending}
              className="px-3 py-1 rounded-lg border border-gray-border"
            >
              Back
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            disabled={!canSend}
            className="w-fit px-4 py-2 rounded-lg bg-brand-blue text-text-white disabled:opacity-40"
          >
            Send message
          </button>
        )}
      </Section>
    </div>
  );
};

export default MessageComposer;
