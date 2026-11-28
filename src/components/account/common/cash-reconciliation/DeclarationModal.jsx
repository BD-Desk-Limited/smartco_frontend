import React from 'react';
import { FaPaperclip, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';
import {
  deleteDeclarationDocument,
  getDeclaration,
  openDeclarationDocument,
  requestDeclaration,
  reviewDeclaration,
  saveDeclaration,
  submitDeclaration,
  uploadDeclarationDocument,
} from '@/services/cashDeclarationServices';
import { OFFERED_METHODS } from '@/utilities/paymentMethods';
import DeclarationThread from './DeclarationThread';
import {
  ACCEPTED_FILES,
  DOCUMENT_KINDS,
  MAX_FILE_MB,
  StatusChip,
  fileTooBig,
  formBody,
  formFrom,
  makeMoney,
  methodLabel,
  previewLines,
  showDay,
  showTime,
  totalsOf,
  visibleMethods,
} from './cashRecHelpers';

const BANNER = {
  manager: 'border-blue-300 bg-blue-50 text-blue-900',
  finance: 'border-amber-300 bg-amber-50 text-amber-900',
  done: 'border-green-300 bg-green-50 text-green-900',
};

const Variance = ({ value, money }) => {
  if (value === null || value === undefined)
    return <span className="text-gray-400">-</span>;
  if (Math.abs(value) < 0.01) return <span className="text-green-700">0</span>;
  return (
    <span className="text-red-600 font-semibold whitespace-nowrap">
      {value > 0 ? '+' : ''}
      {money(value)} {value < 0 ? 'short' : 'over'}
    </span>
  );
};

/*
  One branch's cash declaration for one day. Managers prepare and submit it; finance checks it and
  approves it or sends it back. Both talk in the thread beside it.
*/
const DeclarationModal = ({
  side,
  declarationId,
  initial,
  onClose,
  onChanged,
}) => {
  const [decl, setDecl] = React.useState(initial || null);
  const [form, setForm] = React.useState(() => formFrom(initial));
  const [dirty, setDirty] = React.useState(false);
  const [busy, setBusy] = React.useState(null); // what is running: 'save' | 'submit' | ...
  const [error, setError] = React.useState(null);
  const [flash, setFlash] = React.useState(null);
  const [reviewNote, setReviewNote] = React.useState('');
  const [reviewing, setReviewing] = React.useState(null); // 'approve' | 'request_changes'
  const [uploadKind, setUploadKind] = React.useState('proof_of_payment');
  const [requestNote, setRequestNote] = React.useState('');
  const fileRef = React.useRef(null);
  // a preview (a day not started) has no id until finance asks the branch to declare it
  const idRef = React.useRef(declarationId);

  const money = React.useMemo(
    () => makeMoney(decl?.currency),
    [decl?.currency]
  );

  // the parent's callback, kept in a ref so a new function each render does not reload the declaration
  const onChangedRef = React.useRef(onChanged);
  React.useEffect(() => {
    onChangedRef.current = onChanged;
  }, [onChanged]);

  // a new copy from the server; the form follows it unless there are unsaved changes
  const take = React.useCallback((data, { keepForm = false } = {}) => {
    if (data?._id) idRef.current = data._id;
    setDecl(data);
    if (!keepForm) {
      setForm(formFrom(data));
      setDirty(false);
    }
    onChangedRef.current?.(data);
  }, []);

  const reload = React.useCallback(async () => {
    if (!idRef.current) return;
    const { data, error: err } = await getDeclaration(side, idRef.current);
    if (err) return setError(err);
    take(data);
  }, [side, take]);

  const hasInitial = Boolean(initial);
  React.useEffect(() => {
    if (!hasInitial) reload();
  }, [hasInitial, reload]);

  // a 409 means someone else changed it: reload and say so
  const handle = async (promise, { success, keepForm } = {}) => {
    setError(null);
    setFlash(null);
    const { data, error: err, status } = await promise;
    if (err) {
      setError(err);
      if (status === 409) await reload();
      return null;
    }
    take(data, { keepForm });
    if (success) setFlash(success);
    return data;
  };

  const run = async (what, fn) => {
    setBusy(what);
    try {
      return await fn();
    } finally {
      setBusy(null);
    }
  };

  const save = () =>
    run('save', () =>
      handle(saveDeclaration(decl._id, formBody(form, decl.revision)), {
        success: 'Saved',
      })
    );

  const submit = () =>
    run('submit', async () => {
      let revision = decl.revision;
      if (dirty) {
        const saved = await handle(
          saveDeclaration(decl._id, formBody(form, decl.revision))
        );
        if (!saved) return;
        revision = saved.revision;
      }
      await handle(submitDeclaration(decl._id, revision), {
        success: 'Submitted. Finance will check it.',
      });
    });

  const upload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (fileTooBig(file))
      return setError(`A file can be at most ${MAX_FILE_MB}MB.`);
    run('upload', () =>
      handle(uploadDeclarationDocument(decl._id, file, uploadKind), {
        success: 'Uploaded',
        keepForm: dirty,
      })
    );
  };

  const removeDoc = (doc) => {
    if (!window.confirm(`Remove "${doc.name}"?`)) return;
    run('delete', () =>
      handle(deleteDeclarationDocument(decl._id, doc._id), {
        keepForm: dirty,
      })
    );
  };

  const openDoc = async (docId) => {
    const { error: err } = await openDeclarationDocument(side, decl._id, docId);
    if (err) setError(err);
  };

  const review = () =>
    run('review', async () => {
      const done = await handle(
        reviewDeclaration(decl._id, {
          decision: reviewing,
          note: reviewNote,
          revision: decl.revision,
        }),
        {
          success:
            reviewing === 'approve' ? 'Approved' : 'Sent back to the manager',
        }
      );
      if (done) {
        setReviewing(null);
        setReviewNote('');
      }
    });

  // finance: ask the branch's managers to declare this day (they are reminded until they submit)
  const askBranch = () =>
    run('request', async () => {
      const done = await handle(
        requestDeclaration(
          decl.branch._id,
          decl.businessDay,
          requestNote.trim()
        ),
        {
          success:
            'The branch has been asked. Its managers are reminded until they submit it.',
        }
      );
      if (done) setRequestNote('');
    });

  // form edits
  const edit = (fn) => {
    setForm((f) => fn(structuredClone(f)));
    setDirty(true);
  };
  const setBanked = (method, field, value) =>
    edit((f) => {
      f.banked[method] = { amount: '', reference: '', ...f.banked[method] };
      f.banked[method][field] = value;
      return f;
    });
  const addDeduction = () =>
    edit((f) => {
      f.deductions.push({ method: 'cash', label: '', amount: '', note: '' });
      return f;
    });
  const setDeduction = (i, field, value) =>
    edit((f) => {
      f.deductions[i][field] = value;
      return f;
    });
  const removeDeduction = (i) =>
    edit((f) => {
      f.deductions.splice(i, 1);
      return f;
    });

  const close = () => {
    if (dirty && !window.confirm('You have unsaved changes. Close anyway?'))
      return;
    onClose();
  };

  if (!decl) {
    return (
      <Shell onClose={onClose} title="Cash declaration">
        <p className="p-6 text-sm text-gray-600">{error || 'Loading…'}</p>
      </Shell>
    );
  }

  const editing = decl.can.edit;
  const lines = editing ? previewLines(decl.lines, form) : decl.lines;
  const shown = visibleMethods(lines);
  const totals = editing ? totalsOf(lines) : decl.totals;
  const proofs = decl.documents.filter((d) => d.kind === 'proof_of_payment');
  const bannerTone = decl.next.waitingOn || 'done';

  return (
    <Shell
      onClose={close}
      title={
        <span className="flex flex-wrap items-center gap-2">
          <span>
            {decl.branch.name} · {showDay(decl.businessDay)}
          </span>
          <StatusChip status={decl.status} />
        </span>
      }
    >
      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 min-h-0 overflow-y-auto lg:overflow-hidden flex-1">
        <div className="flex-1 min-w-0 flex flex-col gap-4 lg:overflow-y-auto lg:pr-2">
          <div
            className={`rounded-lg border px-3 py-2 text-sm ${BANNER[bannerTone]}`}
          >
            <span className="font-semibold">Next: </span>
            {decl.next.text}
            {decl.status === 'approved' && decl.approvedBy && (
              <span className="block text-xs mt-1">
                Approved by {decl.approvedBy.fullName} on{' '}
                {showTime(decl.approvedAt)}
              </span>
            )}
            {decl.status === 'submitted' && decl.submittedBy && (
              <span className="block text-xs mt-1">
                Submitted by {decl.submittedBy.fullName} on{' '}
                {showTime(decl.submittedAt)}
                {decl.submitCount > 1
                  ? ` (submission ${decl.submitCount})`
                  : ''}
              </span>
            )}
            {side === 'finance' &&
              decl.status === 'submitted' &&
              !decl.can.review && (
                <span className="block text-xs mt-1">
                  You submitted this one, so another finance admin has to review
                  it.
                </span>
              )}
          </div>

          {decl.tillsChangedSinceSubmit && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              The tills now show {money(decl.tillsChangedSinceSubmit.now)} for
              this day, but {money(decl.tillsChangedSinceSubmit.submitted)} when
              it was submitted (a sale or refund synced late). The figures below
              are the submitted ones.
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          {flash && !error && (
            <div className="rounded-lg border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800">
              {flash}
            </div>
          )}

          {decl.can.requestDeclaration && (
            <section className="rounded-lg border border-blue-200 p-3 flex flex-col gap-2">
              <h3 className="font-semibold text-sm">
                {decl.preview
                  ? 'Ask the branch to declare this day'
                  : 'Remind the branch to submit'}
              </h3>
              <p className="text-xs text-gray-500">
                The branch managers get a reminder that keeps coming back until
                they submit it.
              </p>
              <textarea
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="Message to the managers (optional)"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
              <div>
                <button
                  type="button"
                  onClick={askBranch}
                  disabled={Boolean(busy)}
                  className="px-4 py-2 rounded-md bg-brand-blue text-white disabled:opacity-50"
                >
                  {busy === 'request' ? 'Sending…' : 'Send request'}
                </button>
              </div>
            </section>
          )}

          <section>
            <h3 className="font-semibold text-sm mb-1">By payment method</h3>
            <p className="text-xs text-gray-500 mb-2">
              Expected = recorded at the tills less refunds. To bank = expected
              less deductions. Variance = banked less to bank.
            </p>
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-xs text-gray-600">
                  <tr>
                    <th className="text-left p-2">Method</th>
                    <th className="text-right p-2">Recorded</th>
                    <th className="text-right p-2">Refunds</th>
                    <th className="text-right p-2">Expected</th>
                    <th className="text-right p-2">Deductions</th>
                    <th className="text-right p-2">To bank</th>
                    <th className="text-right p-2">Banked / settled</th>
                    <th className="text-left p-2">Reference</th>
                    <th className="text-right p-2">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {lines
                    .filter((l) => shown.includes(l.method))
                    .map((l) => (
                      <tr key={l.method} className="border-t">
                        <td className="p-2 font-medium whitespace-nowrap">
                          {methodLabel(l.method)}
                        </td>
                        <td className="p-2 text-right">{money(l.takenIn)}</td>
                        <td className="p-2 text-right">
                          {l.refunds ? `- ${money(l.refunds)}` : money(0)}
                        </td>
                        <td className="p-2 text-right">{money(l.expected)}</td>
                        <td className="p-2 text-right">
                          {l.deductions ? `- ${money(l.deductions)}` : money(0)}
                        </td>
                        <td className="p-2 text-right font-semibold">
                          {money(l.toBank)}
                        </td>
                        <td className="p-2 text-right">
                          {editing ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              inputMode="decimal"
                              aria-label={`Banked for ${methodLabel(l.method)}`}
                              value={form.banked[l.method]?.amount ?? ''}
                              onChange={(e) =>
                                setBanked(l.method, 'amount', e.target.value)
                              }
                              className="w-28 rounded border border-gray-300 p-1 text-right"
                            />
                          ) : l.banked === null ? (
                            <span className="text-gray-400">-</span>
                          ) : (
                            money(l.banked)
                          )}
                        </td>
                        <td className="p-2">
                          {editing ? (
                            <input
                              type="text"
                              maxLength={120}
                              aria-label={`Reference for ${methodLabel(l.method)}`}
                              placeholder="Slip / settlement no."
                              value={form.banked[l.method]?.reference ?? ''}
                              onChange={(e) =>
                                setBanked(l.method, 'reference', e.target.value)
                              }
                              className="w-36 rounded border border-gray-300 p-1"
                            />
                          ) : (
                            l.reference || (
                              <span className="text-gray-400">-</span>
                            )
                          )}
                        </td>
                        <td className="p-2 text-right">
                          <Variance value={l.variance} money={money} />
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr className="border-t bg-gray-50 font-semibold">
                    <td className="p-2">Total</td>
                    <td className="p-2 text-right">{money(totals.takenIn)}</td>
                    <td className="p-2 text-right">
                      {totals.refunds ? `- ${money(totals.refunds)}` : money(0)}
                    </td>
                    <td className="p-2 text-right">{money(totals.expected)}</td>
                    <td className="p-2 text-right">
                      {totals.deductions
                        ? `- ${money(totals.deductions)}`
                        : money(0)}
                    </td>
                    <td className="p-2 text-right">{money(totals.toBank)}</td>
                    <td className="p-2 text-right">{money(totals.banked)}</td>
                    <td />
                    <td className="p-2 text-right">
                      <Variance value={totals.variance} money={money} />
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>

          {!decl.preview && (
            <>
              <section>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-sm">Deductions</h3>
                  {editing && (
                    <button
                      type="button"
                      onClick={addDeduction}
                      className="inline-flex items-center gap-1 text-sm text-brand-green"
                    >
                      <FaPlus /> Add deduction
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  Approved money taken out before banking (e.g. petty cash, an
                  expense paid from the till). Finance checks them when
                  approving.
                </p>
                {(editing ? form.deductions : decl.deductions).length === 0 ? (
                  <p className="text-sm text-gray-500">None.</p>
                ) : editing ? (
                  <ul className="flex flex-col gap-2">
                    {form.deductions.map((d, i) => (
                      <li
                        key={d._id || `new-${i}`}
                        className="flex flex-wrap gap-2 items-start rounded-lg border p-2"
                      >
                        <select
                          value={d.method}
                          onChange={(e) =>
                            setDeduction(i, 'method', e.target.value)
                          }
                          aria-label="Taken from"
                          className="rounded border border-gray-300 p-1 text-sm"
                        >
                          {OFFERED_METHODS.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={d.label}
                          maxLength={120}
                          placeholder="What for (e.g. Diesel for generator)"
                          onChange={(e) =>
                            setDeduction(i, 'label', e.target.value)
                          }
                          className="flex-1 min-w-[10rem] rounded border border-gray-300 p-1 text-sm"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={d.amount}
                          placeholder="Amount"
                          aria-label="Amount"
                          onChange={(e) =>
                            setDeduction(i, 'amount', e.target.value)
                          }
                          className="w-28 rounded border border-gray-300 p-1 text-sm text-right"
                        />
                        <input
                          type="text"
                          value={d.note}
                          maxLength={500}
                          placeholder="Approved by / note"
                          onChange={(e) =>
                            setDeduction(i, 'note', e.target.value)
                          }
                          className="flex-1 min-w-[10rem] rounded border border-gray-300 p-1 text-sm"
                        />
                        <button
                          type="button"
                          aria-label="Remove deduction"
                          onClick={() => removeDeduction(i)}
                          className="p-2 text-red-600"
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="text-sm flex flex-col gap-1">
                    {decl.deductions.map((d) => (
                      <li
                        key={d._id}
                        className="flex justify-between gap-3 border-b py-1"
                      >
                        <span>
                          {d.label}{' '}
                          <span className="text-xs text-gray-500">
                            ({methodLabel(d.method)}
                            {d.addedBy
                              ? `, added by ${d.addedBy.fullName}`
                              : ''}
                            )
                          </span>
                          {d.note && (
                            <span className="block text-xs text-gray-600">
                              {d.note}
                            </span>
                          )}
                        </span>
                        <span className="whitespace-nowrap">
                          - {money(d.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-1">Note</h3>
                {editing ? (
                  <textarea
                    value={form.note}
                    maxLength={1000}
                    rows={2}
                    placeholder="Explain any variance, or anything finance should know"
                    onChange={(e) =>
                      edit((f) => {
                        f.note = e.target.value;
                        return f;
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">
                    {decl.note || <span className="text-gray-500">None.</span>}
                  </p>
                )}
              </section>

              <section>
                <h3 className="font-semibold text-sm mb-1">
                  Documents{' '}
                  <span className="text-xs font-normal text-gray-500">
                    ({proofs.length} proof of payment)
                  </span>
                </h3>
                {decl.documents.length === 0 ? (
                  <p className="text-sm text-gray-500">No documents yet.</p>
                ) : (
                  <ul className="flex flex-col gap-1 text-sm">
                    {decl.documents.map((d) => (
                      <li
                        key={d._id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b py-1"
                      >
                        <button
                          type="button"
                          onClick={() => openDoc(d._id)}
                          className="inline-flex items-center gap-1 text-brand-green underline text-left break-all"
                        >
                          <FaPaperclip /> {d.name}
                        </button>
                        <span className="text-xs text-gray-500">
                          {d.kindLabel}
                          {d.uploadedBy
                            ? ` · ${d.uploadedBy.fullName}`
                            : ''} · {showTime(d.uploadedAt)}
                          {d.inThread ? ' · sent in conversation' : ''}
                        </span>
                        {editing && !d.inThread && (
                          <button
                            type="button"
                            aria-label={`Remove ${d.name}`}
                            onClick={() => removeDoc(d)}
                            className="p-1 text-red-600"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
                {editing && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <select
                      value={uploadKind}
                      onChange={(e) => setUploadKind(e.target.value)}
                      aria-label="Document type"
                      className="rounded border border-gray-300 p-1"
                    >
                      {DOCUMENT_KINDS.map((k) => (
                        <option key={k.value} value={k.value}>
                          {k.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={Boolean(busy)}
                      onClick={() => fileRef.current?.click()}
                      className="px-3 py-1 rounded-md border border-brand-green text-brand-green disabled:opacity-50"
                    >
                      {busy === 'upload' ? 'Uploading…' : 'Upload file'}
                    </button>
                    <span className="text-xs text-gray-500">
                      PDF, image, Word, Excel or CSV, up to {MAX_FILE_MB}MB
                    </span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept={ACCEPTED_FILES}
                      onChange={upload}
                      className="hidden"
                    />
                  </div>
                )}
              </section>
            </>
          )}

          {editing && (
            <div className="flex flex-wrap gap-2 sticky bottom-0 bg-white py-2 border-t">
              <button
                type="button"
                onClick={save}
                disabled={!dirty || Boolean(busy)}
                className="px-4 py-2 rounded-md border border-brand-green text-brand-green disabled:opacity-50"
              >
                {busy === 'save' ? 'Saving…' : dirty ? 'Save draft' : 'Saved'}
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={Boolean(busy)}
                className="px-4 py-2 rounded-md bg-brand-green text-white disabled:opacity-50"
              >
                {busy === 'submit'
                  ? 'Submitting…'
                  : decl.status === 'changes_requested'
                    ? 'Submit again'
                    : 'Submit for approval'}
              </button>
            </div>
          )}

          {decl.can.review && (
            <div className="flex flex-col gap-2 sticky bottom-0 bg-white py-2 border-t">
              {reviewing ? (
                <>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={2}
                    maxLength={2000}
                    placeholder={
                      reviewing === 'approve'
                        ? 'Note (optional)'
                        : 'What needs to change? (the manager sees this)'
                    }
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={review}
                      disabled={
                        Boolean(busy) ||
                        (reviewing === 'request_changes' && !reviewNote.trim())
                      }
                      className={`px-4 py-2 rounded-md text-white disabled:opacity-50 ${reviewing === 'approve' ? 'bg-brand-green' : 'bg-red-600'}`}
                    >
                      {reviewing === 'approve'
                        ? 'Confirm approval'
                        : 'Send back for changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewing(null)}
                      className="px-4 py-2 rounded-md border border-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewing('approve')}
                    className="px-4 py-2 rounded-md bg-brand-green text-white"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewing('request_changes')}
                    className="px-4 py-2 rounded-md border border-red-500 text-red-600"
                  >
                    Ask for changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="lg:w-[22rem] shrink-0 border-t lg:border-t-0 lg:border-l pt-3 lg:pt-0 lg:pl-4 flex flex-col min-h-[20rem] lg:min-h-0">
          {decl.preview ? (
            <p className="text-sm text-gray-500">
              The branch has not started this day, so there is no conversation
              yet. Asking the branch to declare it starts one.
            </p>
          ) : (
            <DeclarationThread
              side={side}
              declaration={decl}
              onUpdated={(data) => take(data, { keepForm: dirty })}
              onError={setError}
            />
          )}
        </aside>
      </div>
    </Shell>
  );
};

const Shell = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-[80] bg-black/40 flex items-stretch sm:items-center justify-center sm:p-4"
    role="dialog"
    aria-modal="true"
  >
    <div className="bg-white text-gray-800 w-full sm:max-w-6xl h-full sm:h-[90vh] sm:rounded-xl shadow-2xl flex flex-col min-h-0">
      <div className="flex items-center justify-between gap-2 border-b px-3 sm:px-4 py-3">
        <h2 className="font-semibold min-w-0">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="p-2 text-gray-500 hover:text-gray-800"
        >
          <FaTimes />
        </button>
      </div>
      {children}
    </div>
  </div>
);

export default DeclarationModal;
