import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  createGroupService,
  updateGroupService,
} from '@/services/customerServices';

const CustomerGroupFormModal = ({
  group,
  branchOptions = [],
  canCreateGlobal,
  onClose,
  onSaved,
}) => {
  const editing = Boolean(group);
  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  // admins may choose company-wide; everyone else works with branches only
  const [scope, setScope] = useState(
    group ? (group.isGlobal ? 'global' : 'branches') : 'branches'
  );
  const [branchIds, setBranchIds] = useState(
    (group?.branches || []).map((b) => b._id)
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleBranch = (id) =>
    setBranchIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const submit = async () => {
    setError('');
    if (!name.trim()) return setError('Give the group a name.');
    if (scope === 'branches' && branchIds.length === 0)
      return setError('Choose at least one branch.');

    const payload = {
      name,
      description,
      isGlobal: scope === 'global',
      branches: scope === 'global' ? [] : branchIds,
    };
    setSaving(true);
    const res = editing
      ? await updateGroupService(group._id, payload)
      : await createGroupService(payload);
    setSaving(false);
    if (res.error) return setError(String(res.error));
    onSaved?.(res.data);
  };

  const field =
    'w-full px-2 border border-gray-border rounded-md text-sm focus:outline-none focus:ring focus:border-brand-blue';

  return (
    <div className="relative bg-white p-5 rounded-lg shadow-lg w-[520px] max-w-[95vw] max-h-[90vh] overflow-y-auto text-sm text-text-gray">
      <button
        onClick={onClose}
        title="Close"
        className="absolute top-2 right-2 p-1 rounded-full bg-brand-gray hover:bg-error"
      >
        <FaTimes className="text-text-white" />
      </button>

      <h2 className="text-lg font-semibold text-text-black mb-4">
        {editing ? 'Edit group' : 'Create customer group'}
      </h2>

      <label className="flex flex-col gap-1 mb-3">
        Name
        <input
          type="text"
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          className={`${field} h-8`}
        />
      </label>

      <label className="flex flex-col gap-1 mb-4">
        Description (optional)
        <textarea
          value={description}
          maxLength={300}
          rows={2}
          onChange={(e) => setDescription(e.target.value)}
          className={`${field} p-2`}
        />
      </label>

      <fieldset className="mb-3">
        <legend className="font-semibold text-text-black mb-1">
          Who can use this group
        </legend>
        {canCreateGlobal && (
          <label className="flex items-center gap-2 mb-1">
            <input
              type="radio"
              checked={scope === 'global'}
              onChange={() => setScope('global')}
            />
            All branches (company-wide)
          </label>
        )}
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={scope === 'branches'}
            onChange={() => setScope('branches')}
          />
          Selected branches only
        </label>
      </fieldset>

      {scope === 'branches' && (
        <div className="border border-gray-border rounded-md p-2 max-h-48 overflow-y-auto mb-3">
          {branchOptions.length === 0 ? (
            <p className="italic">No branches available.</p>
          ) : (
            branchOptions?.map((b) => (
              <label
                key={b._id}
                className="flex items-center gap-2 p-1 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={branchIds.includes(b._id)}
                  onChange={() => toggleBranch(b._id)}
                />
                {b.name}
              </label>
            ))
          )}
        </div>
      )}

      <p className="text-xs mb-3">
        {scope === 'global'
          ? 'Everyone in the company can see and use this group. Only admins can change it.'
          : 'Only people with access to these branches can see this group, and it can only hold customers from them.'}
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
          onClick={submit}
          disabled={saving}
          className="py-2 px-4 rounded-lg bg-brand-blue text-text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : editing ? 'Save changes' : 'Create group'}
        </button>
      </div>
    </div>
  );
};

export default CustomerGroupFormModal;
