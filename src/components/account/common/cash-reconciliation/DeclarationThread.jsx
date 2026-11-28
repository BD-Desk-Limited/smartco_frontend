import React from 'react';
import {
  FaAt,
  FaPaperclip,
  FaPaperPlane,
  FaTag,
  FaTimes,
} from 'react-icons/fa';
import {
  openDeclarationDocument,
  postDeclarationMessage,
} from '@/services/cashDeclarationServices';
import {
  ACCEPTED_FILES,
  DOCUMENT_KINDS,
  MAX_FILE_MB,
  fileTooBig,
  showTime,
} from './cashRecHelpers';

const EVENT_TEXT = {
  submitted: 'submitted it for approval',
  approved: 'approved it',
  changes_requested: 'asked for changes',
  declaration_requested: 'asked for this day to be declared',
};
const EVENT_STYLE = {
  submitted: 'border-amber-300 bg-amber-50',
  approved: 'border-green-300 bg-green-50',
  changes_requested: 'border-red-300 bg-red-50',
  declaration_requested: 'border-blue-300 bg-blue-50',
};
const SIDE_LABEL = { manager: 'Manager', finance: 'Finance' };
const MAX_MENTIONS = 10;

// the "@name" being typed just before the caret, if any
const mentionQueryAt = (value, caret) => {
  const match = /(^|\s)@([^\s@]{0,30})$/.exec(value.slice(0, caret));
  return match ? { query: match[2], start: caret - match[2].length - 1 } : null;
};

// message text with the @-mentioned names highlighted
const MessageText = ({ text, mentions = [] }) => {
  if (!mentions.length) return text;
  const names = mentions
    .map((p) => p.fullName)
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!names.length) return text;
  const parts = text.split(new RegExp(`(@(?:${names.join('|')}))`, 'g'));
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="font-semibold text-brand-blue">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const TagChip = ({ tag, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={!onClick}
    className={`inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-800 ${onClick ? 'hover:bg-blue-100 cursor-pointer' : 'cursor-default'}`}
  >
    <FaTag className="text-[9px]" />
    {tag.label}
  </button>
);

/*
  The conversation between the manager and finance on one declaration: messages, files sent as replies,
  tags pointing at a line (a payment method, a deduction, a document, or a topic like Variance), and the
  submit / approve / changes events. Closed once the day is approved.

  @-mentions: type @ and pick someone (the branch's managers or finance). They are notified and reminded
  until they open it.
*/
const DeclarationThread = ({ side, declaration, onUpdated, onError }) => {
  const [text, setText] = React.useState('');
  const [tags, setTags] = React.useState([]);
  const [mentions, setMentions] = React.useState([]);
  // the @ suggestions: { query, start } while typing a name, plus the highlighted row
  const [mentionAt, setMentionAt] = React.useState(null);
  const [highlight, setHighlight] = React.useState(0);
  const textRef = React.useRef(null);
  const people = React.useMemo(
    () => declaration.people || [],
    [declaration.people]
  );
  const [file, setFile] = React.useState(null);
  const [kind, setKind] = React.useState('supporting_document');
  const [picking, setPicking] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const endRef = React.useRef(null);
  const fileRef = React.useRef(null);

  const docs = React.useMemo(
    () => new Map(declaration.documents.map((d) => [String(d._id), d])),
    [declaration.documents]
  );
  const openDoc = async (docId) => {
    const { error } = await openDeclarationDocument(
      side,
      declaration._id,
      docId
    );
    if (error) onError(error);
  };

  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' });
  }, [declaration.messages.length]);

  const hasTag = (t) => tags.some((x) => x.kind === t.kind && x.ref === t.ref);
  const toggleTag = (t) =>
    setTags((prev) =>
      hasTag(t)
        ? prev.filter((x) => !(x.kind === t.kind && x.ref === t.ref))
        : [...prev, t].slice(0, 10)
    );

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (fileTooBig(f))
      return onError(`A file can be at most ${MAX_FILE_MB}MB.`);
    setFile(f);
  };

  const suggestions = React.useMemo(() => {
    if (!mentionAt) return [];
    const q = mentionAt.query.toLowerCase();
    return people
      .filter((p) => p.fullName.toLowerCase().includes(q))
      .slice(0, 8);
  }, [mentionAt, people]);

  const onTextChange = (e) => {
    setText(e.target.value);
    setMentionAt(mentionQueryAt(e.target.value, e.target.selectionStart));
    setHighlight(0);
  };

  // replaces the "@que" being typed with "@Full Name "
  const pickPerson = (person) => {
    const el = textRef.current;
    const at = mentionAt || {
      start: el?.selectionStart ?? text.length,
      query: '',
    };
    const before = text.slice(0, at.start);
    const after = text.slice(at.start + 1 + at.query.length);
    const pad = before && !/\s$/.test(before) ? ' ' : '';
    const inserted = `${pad}@${person.fullName} `;
    setText(before + inserted + after);
    setMentions((prev) =>
      prev.some((p) => p._id === person._id)
        ? prev
        : [...prev, person].slice(0, MAX_MENTIONS)
    );
    setMentionAt(null);
    const caret = (before + inserted).length;
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };

  // the @ button: start a mention at the caret
  const startMention = () => {
    const el = textRef.current;
    const caret = el?.selectionStart ?? text.length;
    const before = text.slice(0, caret);
    const pad = before && !/\s$/.test(before) ? ' ' : '';
    const next = `${before}${pad}@${text.slice(caret)}`;
    setText(next);
    setMentionAt({ query: '', start: caret + pad.length });
    setHighlight(0);
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret + pad.length + 1, caret + pad.length + 1);
    });
  };

  const onTextKeyDown = (e) => {
    if (!mentionAt || !suggestions.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setHighlight((h) => (h + step + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      pickPerson(suggestions[highlight] || suggestions[0]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setMentionAt(null);
    }
  };

  const send = async () => {
    if (!text.trim() && !file) return;
    // only the people still named in the text
    const named = mentions.filter((p) => text.includes(`@${p.fullName}`));
    setSending(true);
    const { data, error } = await postDeclarationMessage(
      side,
      declaration._id,
      {
        text: text.trim(),
        tags: tags.map(({ kind: k, ref }) => ({ kind: k, ref })),
        mentions: named.map((p) => p._id),
        file,
        kind: side === 'manager' ? kind : undefined,
      }
    );
    setSending(false);
    if (error) return onError(error);
    setText('');
    setTags([]);
    setMentions([]);
    setMentionAt(null);
    setFile(null);
    onUpdated(data);
  };

  const groups = [
    { kind: 'topic', label: 'Topic' },
    { kind: 'method', label: 'Payment method' },
    { kind: 'deduction', label: 'Deduction' },
    { kind: 'document', label: 'Document' },
  ];

  return (
    <div className="flex flex-col min-h-0 h-full">
      <h3 className="font-semibold text-sm px-1 pb-2">
        Conversation with {side === 'manager' ? 'finance' : 'the manager'}
      </h3>
      <ol className="flex-1 min-h-[12rem] overflow-y-auto flex flex-col gap-2 pr-1">
        {declaration.messages.length === 0 && (
          <li className="text-xs text-gray-500 p-3 text-center">
            No messages yet.
          </li>
        )}
        {declaration.messages.map((m) =>
          m.kind === 'event' ? (
            <li
              key={m._id}
              className={`rounded-lg border px-3 py-2 text-xs ${EVENT_STYLE[m.event] || ''}`}
            >
              <span className="font-semibold">
                {m.author?.fullName || 'Someone'}
              </span>{' '}
              {EVENT_TEXT[m.event] || m.event}
              <span className="text-gray-500"> · {showTime(m.createdAt)}</span>
              {m.text && m.event !== 'submitted' && m.text !== 'Approved.' && (
                <p className="mt-1 text-sm whitespace-pre-wrap break-words">
                  {m.text}
                </p>
              )}
            </li>
          ) : (
            <li
              key={m._id}
              className={`max-w-[90%] rounded-xl px-3 py-2 text-sm ${
                m.mine
                  ? 'self-end bg-green-50 border border-green-200'
                  : 'self-start bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="text-[11px] text-gray-500">
                {m.author?.fullName || 'Someone'} (
                {m.side === 'finance' ? 'finance' : 'manager'}) ·{' '}
                {showTime(m.createdAt)}
              </div>
              {m.text && (
                <p className="whitespace-pre-wrap break-words">
                  <MessageText text={m.text} mentions={m.mentions} />
                </p>
              )}
              {m.documents.length > 0 && (
                <ul className="mt-1 flex flex-col gap-1">
                  {m.documents.map((id) => {
                    const d = docs.get(String(id));
                    return (
                      <li key={id}>
                        <button
                          type="button"
                          onClick={() => openDoc(id)}
                          className="inline-flex items-center gap-1 text-xs text-brand-green underline break-all text-left"
                        >
                          <FaPaperclip />
                          {d ? `${d.kindLabel}: ${d.name}` : 'File'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {m.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1">
                  {m.tags.map((t) => (
                    <TagChip
                      key={`${t.kind}-${t.ref}`}
                      tag={t}
                      onClick={
                        t.kind === 'document' && docs.has(t.ref)
                          ? () => openDoc(t.ref)
                          : undefined
                      }
                    />
                  ))}
                </div>
              )}
            </li>
          )
        )}
        <li ref={endRef} aria-hidden />
      </ol>

      {declaration.can.message ? (
        <div className="mt-2 border-t pt-2 flex flex-col gap-2">
          {(tags.length > 0 || file) && (
            <div className="flex flex-wrap gap-1 items-center">
              {tags.map((t) => (
                <span
                  key={`${t.kind}-${t.ref}`}
                  className="inline-flex items-center gap-1"
                >
                  <TagChip tag={t} />
                  <button
                    type="button"
                    aria-label={`Remove tag ${t.label}`}
                    onClick={() => toggleTag(t)}
                    className="text-gray-400 hover:text-gray-700 text-xs"
                  >
                    <FaTimes />
                  </button>
                </span>
              ))}
              {file && (
                <span className="inline-flex items-center gap-1 text-xs rounded border px-2 py-0.5">
                  <FaPaperclip />
                  <span className="max-w-[12rem] truncate">{file.name}</span>
                  {side === 'manager' && (
                    <select
                      value={kind}
                      onChange={(e) => setKind(e.target.value)}
                      className="ml-1 border rounded text-xs"
                      aria-label="What the file is"
                    >
                      {DOCUMENT_KINDS.map((k) => (
                        <option key={k.value} value={k.value}>
                          {k.label}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    aria-label="Remove file"
                    onClick={() => setFile(null)}
                    className="text-gray-400 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </span>
              )}
            </div>
          )}

          {picking && (
            <div className="rounded-lg border p-2 max-h-40 overflow-y-auto text-xs flex flex-col gap-2">
              {groups.map((g) => {
                const options = declaration.tagOptions.filter(
                  (o) => o.kind === g.kind
                );
                if (!options.length) return null;
                return (
                  <div key={g.kind}>
                    <p className="text-gray-500 mb-1">{g.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {options.map((o) => (
                        <button
                          key={`${o.kind}-${o.ref}`}
                          type="button"
                          onClick={() => toggleTag(o)}
                          className={`rounded-full border px-2 py-0.5 ${hasTag(o) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-end gap-2">
            <div className="relative flex-1 min-w-0">
              {mentionAt && (
                <ul
                  role="listbox"
                  aria-label="People to mention"
                  className="absolute bottom-full left-0 mb-1 w-full sm:w-72 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg z-10 text-sm"
                >
                  {suggestions.length === 0 && (
                    <li className="px-3 py-2 text-xs text-gray-500">
                      {people.length
                        ? 'No one by that name.'
                        : 'No one else to mention on this branch.'}
                    </li>
                  )}
                  {suggestions.map((p, i) => (
                    <li
                      key={p._id}
                      role="option"
                      aria-selected={i === highlight}
                    >
                      <button
                        type="button"
                        // mousedown so the textarea keeps its caret
                        onMouseDown={(e) => {
                          e.preventDefault();
                          pickPerson(p);
                        }}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-1.5 text-left ${i === highlight ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <span className="truncate">{p.fullName}</span>
                        <span className="text-[11px] text-gray-500 shrink-0">
                          {SIDE_LABEL[p.side] || ''}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <textarea
                ref={textRef}
                value={text}
                onChange={onTextChange}
                onKeyDown={onTextKeyDown}
                onBlur={() => setMentionAt(null)}
                rows={2}
                maxLength={2000}
                placeholder="Write a message… type @ to mention someone"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm resize-y"
              />
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                title="Mention someone"
                aria-label="Mention someone"
                onMouseDown={(e) => e.preventDefault()}
                onClick={startMention}
                className="p-2 rounded-md border border-gray-300"
              >
                <FaAt />
              </button>
              <button
                type="button"
                title="Tag a line, deduction or document"
                aria-label="Tag"
                onClick={() => setPicking((v) => !v)}
                className={`p-2 rounded-md border ${picking ? 'bg-blue-50 border-blue-300' : 'border-gray-300'}`}
              >
                <FaTag />
              </button>
              <button
                type="button"
                title="Attach a file"
                aria-label="Attach a file"
                onClick={() => fileRef.current?.click()}
                className="p-2 rounded-md border border-gray-300"
              >
                <FaPaperclip />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_FILES}
                onChange={pickFile}
                className="hidden"
              />
            </div>
            <button
              type="button"
              onClick={send}
              disabled={sending || (!text.trim() && !file)}
              className="p-3 rounded-md bg-brand-green text-white disabled:opacity-50"
              aria-label="Send"
              title="Send"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 border-t pt-2 text-xs text-gray-500">
          This day is approved, so the conversation is closed.
        </p>
      )}
    </div>
  );
};

export default DeclarationThread;
