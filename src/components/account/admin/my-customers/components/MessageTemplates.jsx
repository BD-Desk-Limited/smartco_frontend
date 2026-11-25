import React, { useEffect, useState } from 'react';
import {
  FaBell,
  FaGift,
  FaList,
  FaPray,
  FaTimes,
  FaUserAlt,
} from 'react-icons/fa';
import Spinner from '@/components/account/Spinner';
import {
  fetchTemplatesService,
  createTemplateService,
  updateTemplateService,
  deleteTemplateService,
} from '@/services/customerServices';
import { capitalizeFirst } from '@/utilities/stringUtils';

const TYPES = [
  {
    style: 'bg-green-shadow5 text-brand-green font-semibold shadow-md',
    name: 'promo',
    icon: <FaGift />,
  },
  {
    style: 'bg-error text-gray-shadow10 font-semibold shadow-md',
    name: 'reminder',
    icon: <FaBell />,
  },
  {
    style: 'bg-blue-shadow10 text-brand-blue font-semibold shadow-md',
    name: 'appreciation',
    icon: <FaPray />,
  },
  {
    style: 'bg-orange-500 text-text-white font-semibold shadow-md',
    name: 'winback',
    icon: <FaUserAlt />,
  },
  {
    style: 'bg-gray-shadow9 text-brand-gray font-semibold shadow-md',
    name: 'general',
    icon: <FaList />,
  },
];
const field =
  'w-full px-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring focus:border-brand-blue focus:ring-brand-blue focus:ring-opacity-30';

const TemplateForm = ({ template, placeholders, onClose, onSaved }) => {
  const editing = Boolean(template);
  const [form, setForm] = useState({
    name: template?.name || '',
    type: template?.type || 'general',
    subject: template?.subject || '',
    body: template?.body || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    setError('');
    setSaving(true);
    const res = editing
      ? await updateTemplateService(template._id, form)
      : await createTemplateService(form);
    setSaving(false);
    if (res.error) return setError(String(res.error));
    onSaved();
  };

  return (
    <div className="relative bg-white p-5 rounded-lg shadow-lg w-[620px] max-w-[95vw] max-h-[90vh] overflow-y-auto text-sm text-text-gray">
      <button
        onClick={onClose}
        title="Close"
        className="absolute top-2 right-2 p-1 rounded-full bg-brand-gray hover:bg-error"
      >
        <FaTimes className="text-text-white" />
      </button>
      <h2 className="text-lg font-semibold text-text-black mb-3">
        {editing ? 'Edit template' : 'New template'}
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <label className="flex flex-col gap-1">
          Name
          <input
            type="text"
            value={form.name}
            maxLength={80}
            onChange={set('name')}
            className={`${field} h-8`}
          />
        </label>
        <label className="flex flex-col gap-1">
          Kind of message
          <select
            value={form.type}
            onChange={set('type')}
            className={`${field} h-8`}
          >
            {TYPES.map((t) => (
              <option key={t.name} value={t.name}>
                {capitalizeFirst(t.name)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 mb-3">
        Subject (emails)
        <input
          type="text"
          value={form.subject}
          maxLength={150}
          onChange={set('subject')}
          className={`${field} h-8`}
        />
      </label>
      <label className="flex flex-col gap-1 mb-2">
        Message
        <textarea
          value={form.body}
          rows={9}
          maxLength={5000}
          onChange={set('body')}
          className={`${field} p-2`}
        />
      </label>
      <p className="text-sm text-yellow-800 mb-3">
        You can use:{' '}
        {Object.entries(placeholders)
          .map(([key]) => `{{${key}}}`)
          .join(', ')}
        . Leave a blank line between paragraphs. Do not write a greeting,
        because each email starts with &quot;Hi&quot; and the customer&apos;s
        name.
      </p>

      {error && <p className="mb-3 text-error">{error}</p>}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={saving}
          className="py-2 px-3 rounded-lg border border-gray-border"
        >
          Cancel
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="py-2 px-4 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save template'}
        </button>
      </div>
    </div>
  );
};

const MessageTemplates = ({ canManage, placeholders, onChanged }) => {
  const [templates, setTemplates] = useState(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(null); // null | { template }
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchTemplatesService().then((res) => {
      if (cancelled) return;
      if (res.error) setError(String(res.error));
      else setTemplates(res.data.templates);
    });
    return () => {
      cancelled = true;
    };
  }, [reload]);

  const changed = () => {
    setReload((r) => r + 1);
    onChanged?.(); // so the compose screen picks up the new list
  };

  const remove = async (id) => {
    const res = await deleteTemplateService(id);
    setConfirmDelete(null);
    if (res.error) return setError(String(res.error));
    changed();
  };

  const fetchTypesField = (name, fieldToFetch) => {
    const type = TYPES.find((t) => t.name === name);
    if (!type) return null;
    return type[fieldToFetch];
  };

  return (
    <div className="flex flex-col gap-3 text-sm text-text-gray">
      <div className="flex items-center justify-between">
        <p>
          {canManage
            ? 'Templates are shared by everyone in your company. Changes apply to future messages only.'
            : 'Company templates you can start a message from. Only admins can change them.'}
        </p>
        {canManage && (
          <button
            onClick={() => setForm({ template: null })}
            className="px-3 py-1 shadow-md bg-blue-shadow1 text-text-white rounded-md hover:bg-brand-blue whitespace-nowrap"
          >
            New template
          </button>
        )}
      </div>

      {error && <p className="text-error">{error}</p>}
      {templates === null ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {templates.map((t) => (
            <article
              key={t._id}
              className="border border-gray-border rounded-md p-3 flex flex-col gap-1 hover:bg-green-shadow8 shadow-md cursor-pointer scale-95 hover:scale-105 transition-transform"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-text-black">{t.name}</h4>
                <span
                  className={`px-2 py-1 rounded-md text-xs flex flex-row gap-1 ${fetchTypesField(t.type, 'style')}`}
                >
                  <span>{fetchTypesField(t.type, 'icon')}</span>
                  <span>{capitalizeFirst(t.type)}</span>
                </span>
              </div>
              {t.subject && <p className="text-text-black">{t.subject}</p>}
              <p className="whitespace-pre-wrap break-words line-clamp-4">
                {t.body}
              </p>
              {canManage && (
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setForm({ template: t })}
                    className="py-1 px-3 rounded-lg border border-gray-border"
                  >
                    Edit
                  </button>
                  {confirmDelete === t._id ? (
                    <span className="flex items-center gap-2">
                      Delete?
                      <button
                        onClick={() => remove(t._id)}
                        className="py-1 px-3 rounded-lg bg-error text-text-white"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="py-1 px-3 rounded-lg border border-gray-border"
                      >
                        No
                      </button>
                    </span>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(t._id)}
                      className="py-1 px-3 rounded-lg border border-error text-error"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </article>
          ))}
          {templates.length === 0 && (
            <p className="italic">No templates yet.</p>
          )}
        </div>
      )}

      {form && (
        <div className="inset-0 fixed bg-black bg-opacity-50 z-[60] flex justify-center items-center">
          <TemplateForm
            template={form.template}
            placeholders={placeholders}
            onClose={() => setForm(null)}
            onSaved={() => {
              setForm(null);
              changed();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default MessageTemplates;
